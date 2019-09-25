using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.MediaRepository;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    [ValidSessionRequired]
    public class ResourceController : Controller
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMediaRepository _mediaRepository;
        
        public ResourceController()
        {
            _personRepository = new PersonRepository();
            _mediaRepository = new MediaRepository();
        }

        // GET -> api/resource/?resourceGuid=...
        [HttpGet]
        public IActionResult GetPublicResource([FromQuery] string resourceGuid)
        {
            throw new System.NotImplementedException();
        }


        // GET -> api/resource/secure/?resourceGuid=...
        [HttpGet("secure")]
        public IActionResult GetSecureResource([FromQuery] string resourceGuid)
        {
            string sessionId = Request.Cookies["sessionId"];

            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);
            
            RepositoryReturn<MediaTracker> returnMediaTracker = _mediaRepository.GetByGuid(Guid.Parse(resourceGuid));
            
            if (returnMediaTracker.IsError)
            {
                return StatusCode(500, returnMediaTracker.ErrorException.Message);
            }

            if (returnMediaTracker.ReturnValue == null)
            {
                return StatusCode(404);
            }

            MediaTracker queriedMediaTracker = returnMediaTracker.ReturnValue;

            RepositoryReturn<MediaAccessRelationship> returnMediaAccessRelationship = _mediaRepository.GetEncryptedMediaKey(queriedMediaTracker.Guid,
                userLoggedInSession.userGuid);
            
            if (returnMediaAccessRelationship.IsError)
            {
                return StatusCode(500, returnMediaAccessRelationship.ErrorException.Message);
            }
            
            if (returnMediaAccessRelationship.ReturnValue == null)
            {
                // Owner has not given access to this user, no relationship exists
                return StatusCode(404, "Unauthorised access to resource, check if owner has given access");
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            // Get the user's private key to fetch the media decryption key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            string plainTextMediaKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnMediaAccessRelationship.ReturnValue.EncryptedMediaKey), privateKey);

            queriedMediaTracker.DecryptHeaders(plainTextMediaKey);
            
            AESEngine aesEngine = new AESEngine();


            return new FileStreamResult(aesEngine.DecryptFileToStream(queriedMediaTracker.encryptedFilePath,
                plainTextMediaKey,
                queriedMediaTracker.salt), 
                new MediaTypeHeaderValue(queriedMediaTracker.contentHeader))
            {
                FileDownloadName = "resource" + queriedMediaTracker.extension
            };
        }
        
        // GET -> api/resource/giveAccessTo/?resourceGuid=...
        //     with body: ['exampleemail1@test.com', 'exampleemail2@test.com'...]
        [HttpGet("giveAccessTo")]
        public IActionResult GiveAccessTo([FromQuery] string resourceGuid, [FromBody] List<string> emails)
        {
            string sessionId = Request.Cookies["sessionId"];

            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);
            
            // Get the Media tracker relating to the required resource
            RepositoryReturn<MediaTracker> returnMediaTracker = _mediaRepository.GetByGuid(Guid.Parse(resourceGuid));
            
            if (returnMediaTracker.IsError)
            {
                return StatusCode(500, returnMediaTracker.ErrorException.Message);
            }

            if (returnMediaTracker.ReturnValue == null)
            {
                return StatusCode(404);
            }

            MediaTracker queriedMediaTracker = returnMediaTracker.ReturnValue;
            
            RepositoryReturn<MediaAccessRelationship> returnMediaAccessRelationship = _mediaRepository.GetEncryptedMediaKey(queriedMediaTracker.Guid,
                userLoggedInSession.userGuid);
            
            if (returnMediaAccessRelationship.IsError)
            {
                return StatusCode(500, returnMediaAccessRelationship.ErrorException.Message);
            }
            
            if (returnMediaAccessRelationship.ReturnValue == null)
            {
                // Supposed owner has no relationship to this resource
                return StatusCode(404, "You do not access to this resource");
            }

            if (returnMediaAccessRelationship.ReturnValue.AccessLevel != AccessLevel.Owner)
            {
                // Supposed owner does not have a valid access level to edit access to this resource
                return StatusCode(401, "You do not access to this resource");
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            // Get the user's private key to fetch the media decryption key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            string plainTextMediaKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnMediaAccessRelationship.ReturnValue.EncryptedMediaKey), privateKey);

            // Go through each email, and fetch the user ID and public key
            IDictionary<Guid, string> usersToGiveAccess = new Dictionary<Guid, string>();
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
                string currentUserEncryptedMediaKey = Convert.ToBase64String(rsaEngine.EncryptString(plainTextMediaKey, currentUserPublicKey));
                
                // Finally set the encrypted key to the user's GUID
                usersToGiveAccess[currentPerson.Guid] = currentUserEncryptedMediaKey;
            }
            
            RepositoryReturn<bool> requestAddUserToMedia = _mediaRepository.AddUsersToMedia(queriedMediaTracker.Guid,
                usersToGiveAccess);
            if (requestAddUserToMedia.IsError)
            {
                return StatusCode(500, requestAddUserToMedia.ErrorException.Message);
            }

            return Ok();
        }
    }
}