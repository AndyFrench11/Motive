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
    public class ChannelController : Microsoft.AspNetCore.Mvc.Controller
    {
        private readonly IChannelRepository _channelRepository;

        public ChannelController()
        {
            _channelRepository = new ChannelRepository();
        }

        // CREATE
        // POST api/channel/:taskId
        [HttpPost("{taskId}")]
        public ActionResult Post(string taskId, [FromBody] Channel channelToCreate, [FromHeader] string userId)
        {
            // TODO: Check auth - Unauthorised()

            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            // Check task exists
            var existError = CheckTaskExists(taskGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is part of group
            var error = CheckGroupMember(taskGuid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Check valid channel name
            if (string.IsNullOrEmpty(channelToCreate.Name.Trim()))
            {
                return StatusCode(400, Errors.ChannelNameEmpty);
            }

            var result = _channelRepository.Add(channelToCreate, taskGuid);

            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(201, result.ReturnValue);
        }

        // READ
        // GET api/channel/:taskId
        [HttpGet("{taskId}")]
        public ActionResult<List<Channel>> GetAll(string taskId, [FromHeader] string userId)
        {
            // TODO: Check auth - Unauthorised()

            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            // Check task exists
            var existError = CheckTaskExists(taskGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is part of group
            var error = CheckGroupMember(taskGuid, userGuid);
            if (error != null)
            {
                return error;
            }

            var result = _channelRepository.GetAllForTask(taskGuid);

            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200, result.ReturnValue);
        }

        // UPDATE
        // PATCH api/channel/:channelId
        [HttpPatch("{channelId}")]
        public ActionResult Patch(string channelId, [FromBody] Channel channelToUpdate, [FromHeader] string userId)
        {
            // TODO: Check auth - Unauthorised()

            // Parse channel guid and user guid
            var channelGuid = ValidationUtil.ParseGuid(channelId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (channelGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            channelToUpdate.Guid = channelGuid;

            // Check channel exists
            var existError = CheckChannelExists(channelGuid);
            if (existError != null)
            {
                return existError;
            }

            // Check user is part of group
            var task = _channelRepository.GetTask(channelGuid);
            var error = CheckGroupMember(task.ReturnValue.Guid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Check valid channel name
            if (string.IsNullOrEmpty(channelToUpdate.Name.Trim()))
            {
                return StatusCode(400, Errors.ChannelNameEmpty);
            }

            var result = _channelRepository.Edit(channelToUpdate);

            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }

        // DELETE
        [HttpDelete("{channelId}")]
        public ActionResult Delete(string channelId, [FromHeader] string userId)
        {
            // TODO: Check auth - Unauthorised()

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

            // Check user is part of group
            var task = _channelRepository.GetTask(channelGuid);
            var error = CheckGroupMember(task.ReturnValue.Guid, userGuid);
            if (error != null)
            {
                return error;
            }

            var result = _channelRepository.Delete(channelGuid);

            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }

        private ActionResult CheckGroupMember(Guid taskGuid, Guid userGuid)
        {
            var projectTaskRepository = new ProjectTaskRepository();
            var project = projectTaskRepository.GetProject(taskGuid);
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

        private ActionResult CheckTaskExists(Guid taskGuid)
        {
            var projectTaskRepository = new ProjectTaskRepository();
            var exists = projectTaskRepository.Exists(taskGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }

            return !exists.ReturnValue ? NotFound(Errors.TaskNotFound) : null;
        }

        private ActionResult CheckChannelExists(Guid channelGuid)
        {
            var exists = _channelRepository.Exists(channelGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }

            return !exists.ReturnValue ? StatusCode(404, Errors.CommentNotFound) : null;
        }
    }
}