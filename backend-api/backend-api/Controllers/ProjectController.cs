using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using backend_api.Database;
using backend_api.Database.PersonRepository;
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
        private IPersonRepository _personRepository;

        public ProjectController()
        {
            _projectRepository = new ProjectRepository();
            _personRepository = new PersonRepository();
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

            return StatusCode(201, projectToCreate.Guid);
        }
        
        // POST api/values
        [HttpPost("{projectId}/tags")]
        public ActionResult PostNewTag(string projectId, [FromBody]Tag tagToCreate)
        {
            
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
            RepositoryReturn<bool> result = _projectRepository.AddTag(projectGuidToGet, tagToCreate);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }
        
        // PATCH api/values
        [HttpPatch("{projectId}/tasks")]
        public ActionResult UpdateTasks(string projectId, [FromBody]List<ProjectTask> projectTaskList)
        {
        
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
            RepositoryReturn<bool> result =
                _projectRepository.EditTaskOrder(projectTaskList, projectGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        public class UpdateProjectObject
        {
            public string newProjectName { get; set; }
            public string newProjectDescription { get; set; }
            public int newImageIndex { get; set; }
        }
        
        
        //
//        
//        /**
//         * Add a relationship between a project and a given owner.
//         */
//        private void AddProjectRelationship(GraphClient client, string projectGuid, string ownerGuid)
//        {
//            client.Connect();
//            client.Cypher
//                .Match("(project:Project), (newOwner:Person)")
//                .Where((Person newOwner) => newOwner.guid == ownerGuid)
//                .AndWhere((Project project) => project.guid == projectGuid)
//                .CreateUnique("(newOwner)-[:CONTRIBUTES_TO {type:ownerType}]->(project)")
//                .WithParam("ownerType", "type")
//                .ExecuteWithoutResults();
//        }
//
//        /**
//         * Remove a relationship between a project and a given owner.
//         */
//        private void RemoveProjectRelationship(GraphClient client, string projectGuid, string ownerGuid)
//        {
//            client.Connect();
//            
//            client.Cypher
//                .Match("(contributor:Person)-[contributes:CONTRIBUTES_TO]-(project:Project)")
//                .Where((Person contributor) => contributor.guid == ownerGuid)
//                .AndWhere((Project project) => project.guid == projectGuid)
//                .Delete("contributes")
//                .ExecuteWithoutResults();
//        }
//        
//        /**
//         * Completes action to add a new member to a given project.
//         *
//         * PATCH api/person/:userId/project/:projectId/add/:newMemberId
//         */
//        [HttpPatch("{projectGuid}/add/{newMemberGuid}")]
//        public ActionResult AddNewMember(string projectGuid, string newMemberGuid)
//        {
//            var client = new GraphClient(new Uri(_databaseHttpUrl + "/db/data"), _dbUser, _dbPw);
//            try
//            {
//                AddProjectRelationship(client, projectGuid, newMemberGuid);
//                return StatusCode(200, "Successfully added user.");
//            }
//            catch (ServiceUnavailableException)
//            {
//                return StatusCode(503);
//            }
//            catch (Exception e)
//            {
//                Console.WriteLine(e);
//                return StatusCode(500);
//            }
//        }
//
//        /**
//         * Completes action to remove a specified member from a given project.
//         *
//         * PATCH api/person/:userId/project/:projectId/remove/:newMemberId
//         */
//        [HttpPatch("{projectGuid}/remove/{newMemberGuid}")]
//        public ActionResult RemoveMember(string projectGuid, string newMemberGuid)
//        {
//            var client = new GraphClient(new Uri(_databaseHttpUrl + "/db/data"), _dbUser, _dbPw);
//            try
//            {
//                RemoveProjectRelationship(client, projectGuid, newMemberGuid);
//                return StatusCode(200, "Successfully removed user.");
//            }
//            catch (ServiceUnavailableException)
//            {
//                return StatusCode(503, "Uh oh...");
//            }
//            catch (Exception e)
//            {
//                Console.WriteLine(e);
//                return StatusCode(500, "Oops...");
//            }
//        }
        
        // PATCH api/values
        [HttpPatch("{projectId}/name")]
        public ActionResult UpdateName(string projectId, [FromBody]UpdateProjectObject updateProjectNameObject)
        {
        
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
            RepositoryReturn<bool> result =
                _projectRepository.EditName(projectGuidToGet, updateProjectNameObject.newProjectName);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        // PATCH api/values
        [HttpPatch("{projectId}/description")]
        public ActionResult UpdateDescription(string projectId, [FromBody]UpdateProjectObject updateProjectDescriptionObject)
        {
        
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
            RepositoryReturn<bool> result =
                _projectRepository.EditDescription(projectGuidToGet, updateProjectDescriptionObject.newProjectDescription);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        // PATCH api/values
        [HttpPatch("{projectId}/imageIndex")]
        public ActionResult UpdateImageIndex(string projectId, [FromBody]UpdateProjectObject updateProjectImageIndexObject)
        {
        
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
            RepositoryReturn<bool> result =
                _projectRepository.EditPhotoIndex(projectGuidToGet, updateProjectImageIndexObject.newImageIndex);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        // Get all of the owners of a single project
        [HttpGet("{projectId}/owners")]
        public ActionResult<Project> GetProjectOwners(string projectId)
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

            RepositoryReturn<IEnumerable<Person>> result = _personRepository.GetAllForProject(guidToGet);
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }
            
            return StatusCode(200, result.ReturnValue);

        }
        
        // DELETE api/values/5
        [HttpDelete("{projectId}")]
        public ActionResult Delete(string projectId)
        {
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
            RepositoryReturn<bool> result = _projectRepository.Delete(projectGuidToGet);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        // DELETE api/values/5
        [HttpDelete("{projectId}/tags")]
        public ActionResult Delete(string projectId, [FromHeader]string tagName)
        {
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
            RepositoryReturn<bool> result = _projectRepository.RemoveTag(projectGuidToGet, tagName);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }

       
    }
}

