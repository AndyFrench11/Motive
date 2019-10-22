using System;
using backend_api.Database.ProjectRepository;
using backend_api.Database.ProjectTaskRepository;
using backend_api.Features.TaskPriority.Repository;
using backend_api.Util;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Features.TaskPriority.Controller
{
    [Route("api/[controller]")]
    public class TaskPriorityController : Microsoft.AspNetCore.Mvc.Controller
    {
        private readonly ITaskPriorityRepository _taskPriorityRepository;

        public TaskPriorityController()
        {
            _taskPriorityRepository = new TaskPriorityRepository();
        }

        // READ
        // GET api/taskpriority/:taskId
        [HttpGet("{taskId}")]
        public ActionResult Get(string taskId, [FromHeader] string userId)
        {
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

            // Check user is an owner of the project so has permission to access
            var error = CheckGroupMember(taskGuid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Read
            var result = _taskPriorityRepository.GetForTask(taskGuid);

            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }

        // UPDATE
        // PATCH api/taskpriority/:taskId
        [HttpPatch("{taskId}")]
        public ActionResult Patch(string taskId, [FromBody] Models.TaskPriority taskPriority, [FromHeader] string userId)
        {
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

            // Check user is an owner of the project so has permission to access
            var error = CheckGroupMember(taskGuid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Check priority is provided and parsed correctly
            if (taskPriority?.getPriority() == null)
            {
                return BadRequest(Errors.PriorityInvalid);
            }

            // Edit
            var result = _taskPriorityRepository.Edit(taskGuid, taskPriority.getPriority());

            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }

        // DELETE
        // DELETE api/taskpriority/:taskId
        [HttpDelete("{taskId}")]
        public ActionResult Delete(string taskId, [FromHeader] string userId)
        {
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

            // Check user is an owner of the project so has permission to access
            var error = CheckGroupMember(taskGuid, userGuid);
            if (error != null)
            {
                return error;
            }

            // Delete
            var result = _taskPriorityRepository.Delete(taskGuid);

            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
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
    }
}