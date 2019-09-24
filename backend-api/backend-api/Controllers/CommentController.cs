using System;
using backend_api.Database;
using backend_api.Database.CommentRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class CommentController : Controller
    {
        private readonly ICommentRepository _commentRepository;
            
        public CommentController()
        {
            _commentRepository = new CommentRepository();
        }
        
        // CREATE FOR TASK
        // POST api/comment/:taskId
        [HttpPost("{taskId}")]
        public ActionResult Post(string taskId, [FromBody]Comment commentToCreate, [FromHeader]string loggedInUserId)
        {
            //Check user is valid
            Guid authorGuid;
            try
            {
                authorGuid = Guid.Parse(loggedInUserId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            // Check task is valid
            Guid taskGuid;
            try
            {
                taskGuid = Guid.Parse(taskId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            // TODO
            // user has access to task/project - Forbidden()
            // task not found - NotFound()
            // Invalid comment content - BadRequest()

            RepositoryReturn<bool> result = _commentRepository.Add(commentToCreate, authorGuid, taskGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(201, commentToCreate.Guid);
        }
        
        // READ
        // TODO
        
        // UPDATE
        // PATCH api/comment
        [HttpPatch]
        public ActionResult Patch([FromBody]Comment commentToUpdate, [FromHeader]string loggedInUserId)
        {
            //Check user is valid
            Guid authorGuid;
            try
            {
                authorGuid = Guid.Parse(loggedInUserId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            //TODO 
            // Check valid comment
            // Check valid update message
            // User can access update comment i.e. they are the comment author - Forbidden()
            
            RepositoryReturn<bool> result = _commentRepository.Edit(commentToUpdate);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
        
        // DELETE
        // TODO
    }
}