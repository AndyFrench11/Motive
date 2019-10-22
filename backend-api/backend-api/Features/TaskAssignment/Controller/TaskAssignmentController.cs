using System;
using backend_api.Database.ProjectRepository;
using backend_api.Database.ProjectTaskRepository;
using backend_api.Features.TaskAssignment.Repository;
using backend_api.Util;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Features.TaskAssignment.Controller
{
    
    [Route("api/[controller]")]
    public class TaskAssignmentController: Microsoft.AspNetCore.Mvc.Controller
    {
        
        private readonly ITaskAssignmentRepository _taskAssignmentRepository;

        public TaskAssignmentController()
        {
            _taskAssignmentRepository = new TaskAssignmentRepository();
        }
        
        
        // READ
        // GET api/taskassignment/:taskId
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
            var result = _taskAssignmentRepository.GetForTask(taskGuid);

            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }
        
        // UPDATE
        // PATCH api/taskassignment/:taskId/:assigneeId
        [HttpPatch("{taskId}/{assigneeId}")]
        public ActionResult Patch(string taskId, string assigneeId, [FromHeader] string userId)
        {
            // Parse task guid, assignee guid, and user guid
            var taskGuid = ValidationUtil.ParseGuid(taskId);
            var assigneeGuid = ValidationUtil.ParseGuid(assigneeId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (taskGuid.Equals(Guid.Empty) || assigneeGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
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
            
            // Check assignee is a member of the project
            var assigneeError = CheckGroupMember(taskGuid, assigneeGuid);
            if (assigneeError != null)
            {
                return assigneeError;
            }
            
            // Edit
            var result = _taskAssignmentRepository.Edit(taskGuid, assigneeGuid);

            return result.IsError
                ? StatusCode(500, result.ErrorException.Message)
                : StatusCode(200, result.ReturnValue);
        }
        
        // DELETE
        // DELETE api/taskassignment/:taskId
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
            var result = _taskAssignmentRepository.Delete(taskGuid);

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