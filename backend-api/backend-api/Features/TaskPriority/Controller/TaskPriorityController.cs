using System;
using backend_api.Database.ProjectTaskRepository;
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
            // TODO: Check auth - Unauthorised()
            // TODO: Check permissions - Forbidden()
            
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // Check task exists
            var projectTaskRepository = new ProjectTaskRepository();
            var exists = projectTaskRepository.Exists(taskGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }
            if (!exists.ReturnValue)
            {
                return StatusCode(404, Errors.TaskNotFound);
            }

            // Read
            var result = _taskPriorityRepository.GetForTask(taskGuid);
            
            return result.IsError ? StatusCode(500, result.ErrorException.Message) : StatusCode(200, result.ReturnValue);
        }
        
        
        // UPDATE
        // PATCH api/taskpriority/:taskId
        [HttpPatch("{taskId}")]
        public ActionResult Patch(string taskId, [FromBody]Models.TaskPriority taskPriority, [FromHeader]string userId)
        {
            // TODO: Check auth - Unauthorised()
            // TODO: Check permissions - Forbidden()
            
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // Check task exists
            var projectTaskRepository = new ProjectTaskRepository();
            var exists = projectTaskRepository.Exists(taskGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }
            if (!exists.ReturnValue)
            {
                return StatusCode(404, Errors.TaskNotFound);
            }
            
            // Check priority is provided and parsed correctly
            if (taskPriority?.getPriority() == null)
            {
                return StatusCode(400, Errors.PriorityInvalid);
            }

            // Edit
            var result = _taskPriorityRepository.Edit(taskGuid, taskPriority.getPriority());
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
            // TODO: Check auth - Unauthorised()
            // TODO: Check permissions - Forbidden()
            
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // Check task exists
            var projectTaskRepository = new ProjectTaskRepository();
            var exists = projectTaskRepository.Exists(taskGuid);
            if (exists.IsError)
            {
                return StatusCode(500, exists.ErrorException.Message);
            }
            if (!exists.ReturnValue)
            {
                return StatusCode(404, Errors.TaskNotFound);
            }
            
            // Delete
            var result = _taskPriorityRepository.Delete(taskGuid);
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
    }
}