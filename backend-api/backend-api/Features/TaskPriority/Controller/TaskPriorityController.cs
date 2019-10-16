using System;
using backend_api.Features.TaskPriority.Repository;
using backend_api.Util;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Features.TaskPriority.Controller
{
    [Route("api/[controller]")]
    public class TaskPriorityController: Microsoft.AspNetCore.Mvc.Controller
    {

        private readonly ITaskPriorityRepository _taskPriorityRepository;

        public TaskPriorityController()
        {
            _taskPriorityRepository = new TaskPriorityRepository();
        }
        
        // READ
        // GET api/taskpriority/:taskId
        [HttpGet("{taskId}")]
        public ActionResult<string> Get(string taskId, [FromHeader]string userId)
        {
            // TODO
            // Check auth/user - Unauthorised() and Forbidden() if no access to project
            // Check task exists - NotFound()
            
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            var result = _taskPriorityRepository.GetForTask(taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);
        }
        
        
        // UPDATE
        // PATCH api/taskpriority/:taskId
        [HttpPatch("{taskId}")]
        public ActionResult Patch(string taskId, [FromBody]Models.TaskPriority taskPriority, [FromHeader]string userId)
        {
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // TODO: Check valid task
            
            if (taskPriority == null)
            {
                return StatusCode(400, Errors.PriorityInvalid);
            }

            var priority = taskPriority.getPriority();
            // Check valid status
            if (priority == null)
            {
                return StatusCode(400, Errors.PriorityInvalid);
            }
            
            // TODO: Check User can access task
            
            var result = _taskPriorityRepository.Edit(taskGuid, priority);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
        
        // DELETE
        // DELETE api/taskpriority/:taskId
        [HttpDelete("{taskId}")]
        public ActionResult Delete(string taskId, [FromHeader]string userId)
        {
            // TODO
            // Check auth - Unauthorised()
            // Check permissions - Forbidden()
            // Check task exists - NotFound()
            
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            var result = _taskPriorityRepository.Delete(taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }

    }
}