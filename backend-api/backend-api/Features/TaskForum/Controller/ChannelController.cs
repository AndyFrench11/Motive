using System;
using System.Collections.Generic;
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
        public ActionResult Post(string taskId, [FromBody]Channel channelToCreate, [FromHeader]string userId)
        {
            // TODO: Check valid auth and access
            
            // Parse project guid and new member guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest("Invalid guid.");
            }
            
            // TODO check task exists
            
            // Check valid channel name
            if (string.IsNullOrEmpty(channelToCreate.Name.Trim()))
            {
                return StatusCode(400, "Discussion Channel name cannot be empty.");
            }
            
            var result = _channelRepository.Add(channelToCreate, taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(201, result.ReturnValue);
        }

        // READ
        // GET api/channel/:taskId
        [HttpGet("{taskId}")]
        public ActionResult<List<Channel>> GetAll(string taskId, [FromHeader]string userId)
        {
            // Parse project guid and new member guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest("Invalid guid.");
            }
            // TODO
            // Check auth/user - Unauthorised() and Forbidden() if no access to project
            // Check task exists - NotFound()
            
            var result = _channelRepository.GetAllForTask(taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);
        }

        // UPDATE

        // DELETE

    }
}