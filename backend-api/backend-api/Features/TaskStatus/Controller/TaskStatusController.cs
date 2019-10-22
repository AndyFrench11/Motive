using System;
using backend_api.Database.ProjectTaskRepository;
using backend_api.Features.TaskStatus.Repository;
using backend_api.Util;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Features.TaskStatus.Controller
{
    [Route("api/[controller]")]
    public class TaskStatusController: Microsoft.AspNetCore.Mvc.Controller
    {

        private readonly ITaskStatusRepository _taskStatusRepository;

        public TaskStatusController()
        {
            _taskStatusRepository = new TaskStatusRepository();
        }
                
        // ADD TO TASK
        // POST api/taskstatus/:taskId
        [HttpPost("{taskId}")]
        public ActionResult Post(string taskId, [FromBody]Model.TaskStatus taskStatus, [FromHeader]string userId)
        {
            // TODO: Check auth - Unauthorised()
            // TODO: Check permissions - Forbidden()
            
            // Parse task guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var authorGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || authorGuid.Equals(Guid.Empty))
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
            
            // Check status is provided and parsed correctly
            if (taskStatus?.getStatus() == null)
            {
                return StatusCode(400, Errors.StatusInvalid);
            }

            // Create
            var result = _taskStatusRepository.Add(taskGuid, taskStatus.getStatus());
            
            return result.IsError ? StatusCode(500, result.ErrorException.Message) : StatusCode(201, result.ReturnValue);
        }
        
        // READ
        // GET api/taskstatus/:taskId
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
            var result = _taskStatusRepository.GetForTask(taskGuid);
            
            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }

        // UPDATE
        // PATCH api/taskstatus/:taskId
        [HttpPatch("{taskId}")]
        public ActionResult Patch(string taskId, [FromBody]Model.TaskStatus taskStatus, [FromHeader]string userId)
        {
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
            
            // Check status is provided and parsed correctly
            if (taskStatus?.getStatus() == null)
            {
                return StatusCode(400, Errors.StatusInvalid);
            }
            
            // Edit
            var result = _taskStatusRepository.Edit(taskGuid, taskStatus.getStatus());
            
            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }
        
        // DELETE
        // DELETE api/taskstatus/:taskId
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
            var result = _taskStatusRepository.Delete(taskGuid);
            
            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }
    }
}