using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using backend_api.Database.ProjectRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;


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

        // POST api/project 
        [HttpPost]
        [ValidSessionRequired]
        public ActionResult Post([FromBody] Project projectToCreate)
        {
            string sessionId = Request.Cookies["sessionId"];
            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);

            // Create a new project password (only decryptable to the owner at the moment)
            string newProjectPasswordPlainText = Convert.ToBase64String(CryptoHelpers.GetRandomBytes(16));
            
            // Get the user's public key
            RepositoryReturn<Person> fetchAccount = _personRepository.GetByGuid(userLoggedInSession.userGuid);
            if (fetchAccount.IsError)
            {
                return StatusCode(500, fetchAccount.ErrorException.Message);
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            RSAParameters userPublicKey = rsaEngine.ConvertStringToKey(fetchAccount.ReturnValue.publicKey);

            // Encrypt the password with the user's public key (therefore only accessible to their private key)
            string ownerEncryptedPassword = Convert.ToBase64String(rsaEngine.EncryptString(newProjectPasswordPlainText, userPublicKey));

            RepositoryReturn<bool> result = _projectRepository.Add(projectToCreate, userLoggedInSession.userGuid, ownerEncryptedPassword);

            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201, projectToCreate.Guid);
        }
        
        // POST api/project/{projectId}/tags
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
        
        // PATCH api/project/{projectId}/tasks
        [HttpPatch("{projectId}/tasks")]
        [ValidSessionRequired]
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
        
        
        // PATCH api/values
        [HttpPatch("{projectId}/name")]
        [ValidSessionRequired]
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
        [ValidSessionRequired]
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
        [ValidSessionRequired]
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
        [ValidSessionRequired]
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
        [ValidSessionRequired]
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

        
        /**
         * Attempts to parse a given string into a Guid.
         * If the given string is null or cannot be formatted, returns a read only empty guid.
         */
        private Guid ParseGuid(string id)
        {
            Guid newGuid;
            try
            {
                newGuid = Guid.Parse(id);
            }
            catch (ArgumentNullException)
            {
                return Guid.Empty;
            }
            catch (FormatException)
            {
                return Guid.Empty;
            }
            return newGuid;
        }
        
        
        /**
         * Completes action to add a new member to a given project.
         *
         * PATCH api/project/:projectId/giveAccessTo 
         */
        [HttpPatch("{projectId}/giveAccessTo")]
        [ValidSessionRequired]
        public ActionResult AddNewMember(string projectId, [FromBody] List<string> emails)
        {
            string sessionId = Request.Cookies["sessionId"];
            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);

            Guid projectGuid = ParseGuid(projectId);
            if (projectGuid == Guid.Empty)
                return StatusCode(400, "Invalid parse project GUID");
            
            //TODO check if emails legit
            
            // Get the link between the requesting user and the specified project (they may not own it)
            RepositoryReturn<ProjectAccessRelationship> returnProjectAccessRelationship = 
                _projectRepository.GetUserAccessToProject(projectGuid, userLoggedInSession.userGuid);
            
            if (returnProjectAccessRelationship.IsError)
            {
                // Failed to get relationship
                return StatusCode(500, returnProjectAccessRelationship.ErrorException.Message);
            }
            
            if (returnProjectAccessRelationship.ReturnValue == null)
            {
                // Supposed owner has no relationship to this project
                return StatusCode(404, "You do not have access to this resource");
            }

            if (returnProjectAccessRelationship.ReturnValue.AccessLevel != AccessLevel.Owner)
            {
                // Supposed owner does not have a valid access level to edit access to this project
                return StatusCode(401, "You do not have correct access privileges to this resource");
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            // Get the user's private key to fetch the project decryption key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            string plaintextProjectKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnProjectAccessRelationship.ReturnValue.EncryptedMediaKey), privateKey);

            // Go through each email, and fetch the user ID and public key
            IDictionary<Guid, Tuple<AccessLevel, string>> usersToGiveAccess = new Dictionary<Guid, Tuple<AccessLevel, string>>();
            foreach (string email in emails)
            {
                RepositoryReturn<Person> requestPerson = _personRepository.GetByEmail(email);
                if (requestPerson.IsError)
                {
                    return StatusCode(500, requestPerson.ErrorException.Message);
                }

                Person currentPerson = requestPerson.ReturnValue;
                
                RSAParameters currentUserPublicKey =
                    rsaEngine.ConvertStringToKey(currentPerson.publicKey);
                
                // Create the media key unique to the current user's public key
                string currentUserEncryptedMediaKey = Convert.ToBase64String(rsaEngine.EncryptString(plaintextProjectKey, currentUserPublicKey));
                
                // Finally set the encrypted key to the user's GUID
                usersToGiveAccess[currentPerson.Guid] = new Tuple<AccessLevel, string>(AccessLevel.Viewer, currentUserEncryptedMediaKey);
            }
            
            RepositoryReturn<bool> requestAddUserToMedia = _projectRepository.AddProjectMembers(projectGuid,
                usersToGiveAccess);
            if (requestAddUserToMedia.IsError)
            {
                return StatusCode(500, requestAddUserToMedia.ErrorException.Message);
            }

            return Ok();
        }
        
        /**
         * Completes action to remove a specified member from a given project.
         *
         * PATCH api/project/:projectId/remove/:newMemberId
         */
        [HttpPatch("{projectId}/remove/{memberId}")]
        public ActionResult RemoveMember(string projectId, string memberId)
        {
            // Parse project guid and new member guid
//            var projectGuid = ParseGuid(projectId);
//            var newMemberGuid = ParseGuid(memberId);
//            if (projectGuid.Equals(Guid.Empty) || newMemberGuid.Equals(Guid.Empty))
//            {
//                return BadRequest("Invalid guid.");
//            }
//            
//            // TODO
//            // Check user is logged in - Unauthorised()
//            // Check logged in user owns the project - Forbidden()
//            // Check new member exists - NotFound()
//            // Check project exists - NotFound()
//
//            // Add member
//            var result = _projectRepository.RemoveProjectMember(projectGuid, newMemberGuid);
//            if (result.IsError)
//            {
//                return StatusCode(500, result.ErrorException.Message);
//            }
//
//            return StatusCode(200, "Successfully removed user.");
            throw new NotImplementedException("Not implemented yet");
        }

    }
}

