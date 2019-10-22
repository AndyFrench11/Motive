using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.MediaRepository;
using backend_api.Database.PersonRepository;
using backend_api.Database.ProjectRepository;
using backend_api.Database.ProjectUpdateRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class ProjectUpdateController : Controller
    {

        private readonly IProjectUpdateRepository _projectUpdateRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IPersonRepository _personRepository;
        private readonly IMediaRepository _mediaRepository;

        public ProjectUpdateController()
        {
            _projectUpdateRepository = new ProjectUpdateRepository();
            _projectRepository = new ProjectRepository();
            _personRepository = new PersonRepository();
            _mediaRepository = new MediaRepository();
        }

        // POST api/projectupdate
        [HttpPost]
        [ValidSessionRequired]
        public ActionResult Post([FromBody]ProjectUpdate projectUpdateToCreate, [FromHeader]string projectGuid)
        {
            string sessionId = Request.Cookies["sessionId"];
            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);
            
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
            
            RepositoryReturn<bool> result =
                _projectUpdateRepository.Add(projectUpdateToCreate, projectGuidToGet, userLoggedInSession.userGuid);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201, projectUpdateToCreate.Guid);
        }
        
        // POST -> api/projectupdate/{projectGuid}/media/{projectupdateGuid}
        [HttpPost("{projectGuid}/media/{projectUpdateGuid}")]
        [DisableRequestSizeLimit]
        [ValidSessionRequired]
        public IActionResult ReceiveFileFromClient([FromForm] IFormFile filepond, string projectGuid, string projectUpdateGuid)
        {
            string sessionId = Request.Cookies["sessionId"];
            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);

            IList<String> validTypes = new List<string> {"image/png", "image/jpeg", "video/mp4", "video/mpeg", "video/webm"};
            if (!validTypes.Contains(filepond.ContentType))
                return StatusCode(404, "Invalid upload type");
            
            AESEngine aesEngine = new AESEngine();
            
            // Generate object to track this upload (and create relationships to users) in the DB
            MediaTracker newFileTracker = new MediaTracker(Path.GetExtension(filepond.FileName), filepond.ContentType);
            
            // Get the link between the requesting user and the specified project (they may not own it)
            RepositoryReturn<ProjectAccessRelationship> returnProjectAccessRelationship = 
                _projectRepository.GetUserAccessToProject(Guid.Parse(projectGuid), userLoggedInSession.userGuid);
            
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
            
            // Decrypt the project key with the user's private key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            // Got the plaintext project key
            string plainTextProjectKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnProjectAccessRelationship.ReturnValue.EncryptedMediaKey), privateKey);
            
            // Encrypt the file with the found project key
            var stream = filepond.OpenReadStream();
            newFileTracker.salt = aesEngine.EncryptStream(stream, newFileTracker.encryptedFilePath, plainTextProjectKey);
            
            MediaType fileMediaType = newFileTracker.GetMediaType();
            // Encrypt headers so the content type and extension aren't visible in DB (mandatory)
            newFileTracker.EncryptHeaders(plainTextProjectKey);
            
            RepositoryReturn<bool> returnCreate = _mediaRepository.Create(
                newFileTracker, Guid.Parse(projectUpdateGuid), fileMediaType);
            
            if (returnCreate.IsError)
            {
                return StatusCode(500, returnCreate.ErrorException.Message);
            }
            
            return StatusCode(201, newFileTracker.Guid);
        }
        
        
        // GET -> api/projectupdate/{projectGuid}/media/{mediaGuid}
        [HttpGet("{projectGuid}/media/{mediaGuid}")]
        [ValidSessionRequired]
        public IActionResult SendSecureFileToClient(string projectGuid, string mediaGuid)
        {
            string sessionId = Request.Cookies["sessionId"];
            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);
            
            RepositoryReturn<MediaTracker> returnMediaTracker = _mediaRepository.GetByGuid(Guid.Parse(mediaGuid));
            
            if (returnMediaTracker.IsError)
            {
                return StatusCode(500, returnMediaTracker.ErrorException.Message);
            }

            if (returnMediaTracker.ReturnValue == null)
            {
                return StatusCode(404);
            }

            MediaTracker queriedMediaTracker = returnMediaTracker.ReturnValue;

            RepositoryReturn<ProjectAccessRelationship> returnProjectAccessRelationship = _projectRepository.GetUserAccessToProject(Guid.Parse(projectGuid),
                userLoggedInSession.userGuid);
            
            if (returnProjectAccessRelationship.IsError)
            {
                return StatusCode(500, returnProjectAccessRelationship.ErrorException.Message);
            }
            
            if (returnProjectAccessRelationship.ReturnValue == null)
            {
                // Owner has not given access to this user, no relationship exists
                return StatusCode(404, "Unauthorised access to resource, check if owner has given access");
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            
            // Get the user's private key to fetch the media decryption key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            // Get the project key (individually encrypted for this current user)
            string plainTextProjectKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnProjectAccessRelationship.ReturnValue.EncryptedMediaKey), privateKey);

            // Decrypt the media type headers
            queriedMediaTracker.DecryptHeaders(plainTextProjectKey);
            
            // Stream the decrypted file to the user
            AESEngine aesEngine = new AESEngine();
            return new FileStreamResult(aesEngine.DecryptFileToStream(queriedMediaTracker.encryptedFilePath,
                plainTextProjectKey,
                queriedMediaTracker.salt), 
                new MediaTypeHeaderValue(queriedMediaTracker.contentHeader))
            {
                FileDownloadName = "resource" + queriedMediaTracker.extension
            };
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
        
        // Get all of the updates for a single project
        [HttpGet("{personId}/person")]
        public ActionResult<Project> GetAllUpdatesForPerson(string personId)
        {

            Guid guidToGet;
            try
            {
                guidToGet = Guid.Parse(personId);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }

            RepositoryReturn<IEnumerable<ProjectUpdate>> result = _projectUpdateRepository.GetAllForPerson(guidToGet);
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
        
        public class UpdateProjectUpdateObject
        {
            public string newContent { get; set; }
            public bool newHighlightStatus { get; set; }
        }
        
        // PATCH api/values
        [HttpPatch("{updateId}/content")]
        public ActionResult UpdateContent(string updateId, [FromBody]UpdateProjectUpdateObject updateProjectUpdateObject)
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
                _projectUpdateRepository.EditContent(projectUpdateGuidToGet, updateProjectUpdateObject.newContent);
                
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        // PATCH api/values
        [HttpPatch("{updateId}/highlight")]
        public ActionResult UpdateHighlightStatus(string updateId, [FromBody]UpdateProjectUpdateObject updateProjectUpdateObject)
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
                _projectUpdateRepository.EditHighlightStatus(projectUpdateGuidToGet,
                    updateProjectUpdateObject.newHighlightStatus);
                
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200);
        }
        
        
    }
}
