using System;
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
            // Parse update guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var authorGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || authorGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            
            // TODO: check user has access to task/project - Forbidden()
            // TODO: task not found - NotFound()

            if (taskStatus == null)
            {
                return StatusCode(400, Errors.StatusInvalid);
            }
            
            var status = taskStatus.getStatus();
            // Check valid status
            if (status == null)
            {
                return StatusCode(400, Errors.StatusInvalid);
            }

            var result = _taskStatusRepository.Add(taskGuid, status);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(201, result.ReturnValue);
        }
        
        // READ
        // GET api/taskstatus/:taskId
        [HttpGet("{taskId}")]
        public ActionResult<string> Get(string taskId, [FromHeader]string userId)
        {
            // TODO
            // Check auth/user - Unauthorised() and Forbidden() if no access to project
            // Check update exists - NotFound()
            
            // Parse update guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var authorGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || authorGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            var result = _taskStatusRepository.GetForTask(taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);
        }

        // UPDATE
        // PATCH api/taskstatus/:taskId
        [HttpPatch("{taskId}")]
        public ActionResult Patch(string taskId, [FromBody]Model.TaskStatus taskStatus, [FromHeader]string userId)
        {
            // Parse comment guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }
            
            // TODO: Check valid task
            
            if (taskStatus == null)
            {
                return StatusCode(400, Errors.StatusInvalid);
            }

            var status = taskStatus.getStatus();
            // Check valid status
            if (status == null)
            {
                return StatusCode(400, Errors.StatusInvalid);
            }
            
            // TODO: Check User can access task
            
            var result = _taskStatusRepository.Edit(taskGuid, status);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
        
        // DELETE
        // DELETE api/taskstatus/:taskId
        [HttpDelete("{taskId}")]
        public ActionResult Delete(string taskId, [FromHeader]string userId)
        {
            // TODO
            // Check auth - Unauthorised()
            // Check permissions - Forbidden()
            // Check comment exists - NotFound()
            
            // Parse comment guid and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            var result = _taskStatusRepository.Delete(taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
    }
}