using System;
using System.Collections.Generic;
using backend_api.Database;
using backend_api.Database.ProjectUpdateRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class ProjectUpdateController : Controller
    {

        private IProjectUpdateRepository _projectUpdateRepository;

        public ProjectUpdateController()
        {
            _projectUpdateRepository = new ProjectUpdateRepository();
        }

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody]ProjectUpdate projectUpdateToCreate, [FromHeader]string projectGuid, [FromHeader]string userGuid)
        {
         
            //Check project is valid first
            Guid projectGuidToGet;
            try
            {
                projectGuidToGet = Guid.Parse(projectGuid);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            //Check project is valid first
            Guid userGuidToGet;
            try
            {
                userGuidToGet = Guid.Parse(userGuid);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            
            //TODO Add in a check for the Task Guid as well

            RepositoryReturn<bool> result =
                _projectUpdateRepository.Add(projectUpdateToCreate, projectGuidToGet, userGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }
        
        // Get all of the updates for a single project
        [HttpGet("{projectId}/project")]
        public ActionResult<Project> GetUpdatesForAProject(string projectId)
        {

            Guid guidToGet;
            try
            {
                guidToGet = Guid.Parse(projectId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }

            RepositoryReturn<IEnumerable<ProjectUpdate>> result = _projectUpdateRepository.GetAllForProject(guidToGet);
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);

        }
        
        // DELETE api/values/5
        [HttpDelete("{updateId}")]
        public ActionResult Delete(string updateId)
        {
            Guid projectUpdateGuidToGet;
            try
            {
                projectUpdateGuidToGet = Guid.Parse(updateId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }

            RepositoryReturn<bool> result = _projectUpdateRepository.Delete(projectUpdateGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
//        
        
        public class UpdateProjectUpdateObject
        {
            public string content { get; set; }

           
        }
        
        // PATCH api/values
        [HttpPatch("{updateId}")]
        public ActionResult Update([FromBody]UpdateProjectUpdateObject updateProjectUpdateObject, [FromHeader]string updateId)
        {
        
            //Check user is valid first
            
            Guid projectUpdateGuidToGet;
            try
            {
                projectUpdateGuidToGet = Guid.Parse(updateId);
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
                _projectUpdateRepository.EditContent(projectUpdateGuidToGet, updateProjectUpdateObject.content);
                
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        
    }
}
