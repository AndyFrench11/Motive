using System;
using System.Collections.Generic;
using backend_api.Database.ProjectRepository;
using backend_api.Database.ProjectTaskRepository;
using backend_api.Features.TaskForum.Models;
using backend_api.Features.TaskForum.Repository;
using backend_api.Util;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Features.TaskForum.Controller
{
    [Route("api/[controller]")]
    public class MessageController: Microsoft.AspNetCore.Mvc.Controller
    {
        private readonly IMessageRepository _messageRepository;

        public MessageController()
        {
            _messageRepository = new MessageRepository();
        }
        
        // CREATE
        // POST api/message/:channelId
        [HttpPost("{channelId}")]
        public ActionResult Post(string channelId, [FromBody]Message messageToCreate, [FromHeader]string userId)
        {
            // Parse channel guid and user guid
            var channelGuid = ValidationUtil.ParseGuid(channelId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (channelGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // Check channel exists
            var existError = CheckChannelExists(channelGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is an owner of the project so has permission to access
            var error = CheckGroupMember(channelGuid, userGuid);
            if (error != null)
            {
                return error;
            }
            
            // Check valid message
            if (string.IsNullOrEmpty(messageToCreate.Text.Trim()))
            {
                return StatusCode(400, Errors.MessageEmpty);
            }
            
            // Create
            var result = _messageRepository.Add(messageToCreate, userGuid, channelGuid);
            
            return result.IsError ? StatusCode(500, result.ErrorException.Message) : StatusCode(201, result.ReturnValue);
        }
        
        // READ
        // GET api/message/:channelId
        [HttpGet("{channelId}")]
        public ActionResult<List<Channel>> GetAll(string channelId, [FromHeader]string userId)
        {
            // Parse channel guid and user guid
            var channelGuid = ValidationUtil.ParseGuid(channelId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (channelGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // Check channel exists
            var existError = CheckChannelExists(channelGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is an owner of the project so has permission to access
            var error = CheckGroupMember(channelGuid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Read
            var result = _messageRepository.GetAllForChannel(channelGuid);
            
            return result.IsError ? StatusCode(500, result.ErrorException.Message) : StatusCode(200, result.ReturnValue);
        }
        
        // UPDATE
        // PATCH api/message/:messageId
        [HttpPatch("{messageId}")]
        public ActionResult Patch(string messageId, [FromBody]Message messageToUpdate, [FromHeader]string userId)
        {
            // Parse message guid and user guid
            var messageGuid = ValidationUtil.ParseGuid(messageId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (messageGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            messageToUpdate.Guid = messageGuid;
            
            // Check message exists
            var existError = CheckMessageExists(messageGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is an owner of the project so has permission to access
            var channel = _messageRepository.GetChannel(messageGuid);
            var error = CheckGroupMember(channel.ReturnValue.Guid, userGuid);
            if (error != null)
            {
                return error;
            }
            
            // Check valid channel name
            if (string.IsNullOrEmpty(messageToUpdate.Text.Trim()))
            {
                return StatusCode(400, Errors.MessageEmpty);
            }
            
            // Edit
            var result = _messageRepository.Edit(messageToUpdate);

            return result.IsError ? StatusCode(500, result.ErrorException.Message) : StatusCode(200, result.ReturnValue);
        }
        
        // DELETE
        [HttpDelete("{messageId}")]
        public ActionResult Delete(string messageId, [FromHeader]string userId)
        {
            // Parse message guid and user guid
            var messageGuid = ValidationUtil.ParseGuid(messageId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (messageGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // Check message exists
            var existError = CheckMessageExists(messageGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is an owner of the project so has permission to access
            var channel = _messageRepository.GetChannel(messageGuid);
            var error = CheckGroupMember(channel.ReturnValue.Guid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Delete
            var result = _messageRepository.Delete(messageGuid);
            
            return result.IsError ? StatusCode(500, result.ErrorException.Message) : StatusCode(200, result.ReturnValue);
        }
        
        private ActionResult CheckGroupMember(Guid channelGuid, Guid userGuid)
        {
            var channelRepository = new ChannelRepository();
            var task = channelRepository.GetTask(channelGuid);
            if (task.IsError)
            {
                return StatusCode(500, task.ErrorException.Message);
            }

            var projectTaskRepository = new ProjectTaskRepository();
            var project = projectTaskRepository.GetProject(task.ReturnValue.Guid);
            if (project.IsError)
            {
                return StatusCode(500, project.ErrorException.Message);
            }

            var projectRepository = new ProjectRepository();
            var inGroup = projectRepository.IsGroupMember(userGuid, project.ReturnValue.Guid);
            if (inGroup.IsError)
            {
                return StatusCode(500, inGroup.ErrorException.Message);
            }

            return !inGroup.ReturnValue ? StatusCode(403, Errors.NotGroupMember) : null;
        }

        private ActionResult CheckChannelExists(Guid channelGuid)
        {
            var channelRepository = new ChannelRepository();
            var exists = channelRepository.Exists(channelGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }

            return !exists.ReturnValue ? StatusCode(404, Errors.ChannelNotFound) : null;
        }
        
        private ActionResult CheckMessageExists(Guid messageGuid)
        {
            var exists = _messageRepository.Exists(messageGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }

            return !exists.ReturnValue ? StatusCode(404, Errors.MessageNotFound) : null;
        }
    }
}