using System;
using System.Collections.Generic;
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
        
        // CREATE FOR UPDATE
        // POST api/comment/:updateId
        [HttpPost("{updateId}")]
        public ActionResult Post(string updateId, [FromBody]Comment commentToCreate, [FromHeader]string userId)
        {
            // Check user is valid
            Guid authorGuid;
            try
            {
                authorGuid = Guid.Parse(userId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("User id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid user id.");
            }
            
            // Check task is valid
            Guid updateGuid;
            try
            {
                updateGuid = Guid.Parse(updateId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("Update id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid update id.");
            }
            
            // TODO
            // user has access to task/project - Forbidden()
            // task not found - NotFound()
            // Invalid comment content - BadRequest()

            var result = _commentRepository.Add(commentToCreate, authorGuid, updateGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(201, commentToCreate.Guid);
        }
        
        // READ
        // GET api/comment/:updateId
        [HttpGet("{updateId}")]
        public ActionResult<List<Comment>> GetAll(string updateId, [FromHeader]string userId)
        {
            // TODO
            // Check auth/user - Unauthorised() and Forbidden() if no access to project
            // Check task exists - NotFound()
            
            // User
            Guid userGuid;
            try
            {
                userGuid = Guid.Parse(userId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("User id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid user id.");
            }
            
            // Update
            Guid updateGuid;
            try
            {
                updateGuid = Guid.Parse(updateId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("Update id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid update id.");
            }
            
            var result = _commentRepository.GetAllForUpdate(updateGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);
        }

        // UPDATE
        // PATCH api/comment
        [HttpPatch]
        public ActionResult Patch([FromBody]Comment commentToUpdate, [FromHeader]string userId)
        {
            //Check user is valid
            Guid userGuid;
            try
            {
                userGuid = Guid.Parse(userId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("User id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid user id.");
            }
            
            //TODO 
            // Check valid comment
            // Check valid update message
            // User can access update comment i.e. they are the comment author - Forbidden()
            
            var result = _commentRepository.Edit(commentToUpdate);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
        
        // DELETE
        [HttpDelete("{commentId}")]
        public ActionResult Delete(string commentId, [FromHeader]string userId)
        {
            // TODO
            // Check auth - Unauthorised()
            // Check permissions - Forbidden()
            // Check comment exists - NotFound()
            
            //Check user is valid
            Guid userGuid;
            try
            {
                userGuid = Guid.Parse(userId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("User id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid user id.");
            }
            
            //Check comment is valid
            Guid commentGuid;
            try
            {
                commentGuid = Guid.Parse(commentId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest("Comment id is null.");
            }
            catch (FormatException)
            {
                return BadRequest("Invalid comment id.");
            }
            
            var result = _commentRepository.Delete(commentGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200);
        }
    }
}