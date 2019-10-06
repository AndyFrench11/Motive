using System;
using System.Collections.Generic;
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
            // TODO: Check valid auth and access
            
            // Parse channel guid and user guid
            var channelGuid = ValidationUtil.ParseGuid(channelId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (channelGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // TODO check channel exists
            
            // Check valid message
            if (string.IsNullOrEmpty(messageToCreate.Text.Trim()))
            {
                return StatusCode(400, Errors.MessageEmpty);
            }
            
            var result = _messageRepository.Add(messageToCreate, userGuid, channelGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(201, result.ReturnValue);
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
            // TODO
            // Check auth/user - Unauthorised() and Forbidden() if no access to project
            // Check channel exists - NotFound()
            
            var result = _messageRepository.GetAllForChannel(channelGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);
        }
        
        // UPDATE
        // PATCH api/message/:messageId
        [HttpPatch("{messageId}")]
        public ActionResult Patch(string messageId, [FromBody]Message messageToUpdate, [FromHeader]string userId)
        {
            // TODO: Check User auth and access - Unauthorised() || Forbidden()
            
            // Parse message guid and user guid
            var messageGuid = ValidationUtil.ParseGuid(messageId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (messageGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            messageToUpdate.Guid = messageGuid;
            
            // TODO: Check message exists
            
            // Check valid channel name
            if (string.IsNullOrEmpty(messageToUpdate.Text.Trim()))
            {
                return StatusCode(400, Errors.MessageEmpty);
            }
            
            var result = _messageRepository.Edit(messageToUpdate);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
        
        // DELETE
        [HttpDelete("{messageId}")]
        public ActionResult Delete(string messageId, [FromHeader]string userId)
        {
            // TODO
            // Check auth - Unauthorised()
            // Check permissions - Forbidden()
            // Check message exists - NotFound()
            
            // Parse message guid and user guid
            var messageGuid = ValidationUtil.ParseGuid(messageId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (messageGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            var result = _messageRepository.Delete(messageGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
    }
}