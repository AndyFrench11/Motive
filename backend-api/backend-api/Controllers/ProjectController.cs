using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using backend_api.Database;
using backend_api.Database.ProjectRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Neo4j.Driver.V1;
using Neo4jClient;


namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class ProjectController : Controller
    {
        private IProjectRepository _projectRepository;

        public ProjectController()
        {
            _projectRepository = new ProjectRepository();
        }
        


        // GET: api/values
        [HttpGet]
        public ActionResult<List<Project>> GetAllProjectsForUser([FromHeader]string userId)
        {
            Guid guidToGet;
            try
            {
                guidToGet = Guid.Parse(userId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }

            RepositoryReturn<IEnumerable<Project>> result = _projectRepository.GetAllForUser(guidToGet);


            if (result.IsError)
            {

                return StatusCode(500, result.ErrorException.Message);

            }
            
            return StatusCode(200, result.ReturnValue);
        }

        // GET api/values/5
        [HttpGet("{projectId}")]
        public ActionResult<Project> Get(string projectId)
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

            RepositoryReturn<Project> result = _projectRepository.GetByGuid(guidToGet);
            if (result.IsError)
            {
                if (result.ErrorException is ArgumentNullException)
                {
                    return StatusCode(404, result.ErrorException.Message);
                }

                return StatusCode(500, result.ErrorException.Message);

            }
            
            return StatusCode(200, result.ReturnValue);

        }

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody]Project projectToCreate, [FromHeader]string userId)
        {
            
            //Check user is valid first
            Guid userGuidToGet;
            try
            {
                userGuidToGet = Guid.Parse(userId);
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
            RepositoryReturn<bool> result = _projectRepository.Add(projectToCreate, userGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }

       
    }
}

