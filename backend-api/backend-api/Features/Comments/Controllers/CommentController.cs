using System;
using System.Collections.Generic;
using backend_api.Features.Comments.Models;
using backend_api.Features.Comments.Repository;
using backend_api.Util;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Features.Comments.Controllers
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
            // Parse update guid and user guid
            var updateGuid = ValidationUtil.ParseGuid(updateId);
            var authorGuid = ValidationUtil.ParseGuid(userId);
            if (updateGuid.Equals(Guid.Empty) || authorGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            
            // TODO: check user has access to task/project - Forbidden()
            // TODO: task not found - NotFound()
            
            // Check valid comment message
            if (string.IsNullOrEmpty(commentToCreate.Message.Trim()))
            {
                return StatusCode(400, Errors.CommentEmpty);
            }

            var result = _commentRepository.Add(commentToCreate, authorGuid, updateGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(201, result.ReturnValue);
        }
        
        // READ
        // GET api/comment/:updateId
        [HttpGet("{updateId}")]
        public ActionResult<List<Comment>> GetAll(string updateId, [FromHeader]string userId)
        {
            // TODO
            // Check auth/user - Unauthorised() and Forbidden() if no access to project
            // Check update exists - NotFound()
            
            // Parse update guid and user guid
            var updateGuid = ValidationUtil.ParseGuid(updateId);
            var authorGuid = ValidationUtil.ParseGuid(userId);
            if (updateGuid.Equals(Guid.Empty) || authorGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            var result = _commentRepository.GetAllForUpdate(updateGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);
        }

        // UPDATE
        // PATCH api/comment/:commentId
        [HttpPatch("{commentId}")]
        public ActionResult Patch(string commentId, [FromBody]Comment commentToUpdate, [FromHeader]string userId)
        {
            // Parse comment guid and user guid
            var commentGuid = ValidationUtil.ParseGuid(commentId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (commentGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
            }

            commentToUpdate.Guid = commentGuid;
            
            // TODO: Check valid comment
            
            // Check valid comment message
            if (string.IsNullOrEmpty(commentToUpdate.Message.Trim()))
            {
                return StatusCode(400, Errors.CommentEmpty);
            }
            
            // TODO: Check User can access update comment i.e. they are the comment author - Forbidden()
            
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
            
            // Parse comment guid and user guid
            var commentGuid = ValidationUtil.ParseGuid(commentId);
            var userGuid = ValidationUtil.ParseGuid(userId);
            if (commentGuid.Equals(Guid.Empty) || userGuid.Equals(Guid.Empty))
            {
                return BadRequest(Errors.InvalidGuid);
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