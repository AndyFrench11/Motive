using System;
using backend_api.Database;
using backend_api.Database.ProjectTaskRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Route("api//[controller]")]
    public class ProjectTaskController : Controller
    {

        private IProjectTaskRepository _projectTaskRepository;

        public ProjectTaskController()
        {
            _projectTaskRepository = new ProjectTaskRepository();
        }
        
        //TODO Get the Project Guid from the Header of the packet


        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody]ProjectTask projectTaskToCreate)
        {
            //Retrieve the projectId from the header
            string projectId = Request.Headers["projectId"];
            
            //Check user is valid first
            Guid projectGuidToGet;
            try
            {
                projectGuidToGet = Guid.Parse(projectId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            // TODO sanitise incoming project body
            RepositoryReturn<bool> result = _projectTaskRepository.Add(projectTaskToCreate, projectGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }
        
        // DELETE api/values/5
        [HttpDelete("{guid}")]
        public ActionResult Delete(string guid)
        {
            Guid projectTaskGuidToGet;
            try
            {
                projectTaskGuidToGet = Guid.Parse(guid);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            // TODO sanitise incoming project body
            RepositoryReturn<bool> result = _projectTaskRepository.Delete(projectTaskGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        // PATCH api/values
        [HttpPatch]
        public ActionResult Update([FromBody]bool completed)
        {
            //Retrieve the projectId from the header
            string projectId = Request.Headers["projectId"];
            
            //Check user is valid first
            Guid projectTaskGuidToGet;
            try
            {
                projectTaskGuidToGet = Guid.Parse(projectId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            // TODO sanitise incoming project body
            RepositoryReturn<bool> result =
                _projectTaskRepository.EditCompletionStatus(completed, projectTaskGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        
        
    }
}