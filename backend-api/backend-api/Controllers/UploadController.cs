using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.MediaRepository;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using UploadStream;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMediaRepository _mediaRepository;
        
        public UploadController()
        {
            _personRepository = new PersonRepository();
            _mediaRepository = new MediaRepository();
        }
        
        [HttpPost]
        [DisableRequestSizeLimit]
        public IActionResult ReceiveFile([FromForm] IFormFile file)
        {
            string sessionId = Request.Cookies["sessionId"];

            if (sessionId == null)
                return BadRequest();
            
            Session userLoggedInSession = SessionsController.GetLoggedInSession(sessionId);

            var stream = file.OpenReadStream();
            
            AESEngine aesEngine = new AESEngine();
            
            // Generate object to track this upload (and create relationships to users) in the DB
            MediaTracker newFileTracker = new MediaTracker(Path.GetExtension(file.FileName), file.ContentType);
            
            // Create a new file password (only decryptable to the owner at upload)
            string newFilePasswordPlainText = Convert.ToBase64String(CryptoHelpers.GetRandomBytes(16));
            
            // Encrypt the file with the newly generated password
            newFileTracker.salt = aesEngine.EncryptStream(stream, newFileTracker.encryptedFilePath, newFilePasswordPlainText);
            
            // Get the user's public key
            RepositoryReturn<Person> fetchAccount = _personRepository.GetByGuid(userLoggedInSession.userGuid);
            if (fetchAccount.IsError)
            {
                return StatusCode(500, fetchAccount.ErrorException.Message);
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            RSAParameters userPublicKey = rsaEngine.ConvertStringToKey(fetchAccount.ReturnValue.publicKey);

            // Encrypt the password with the user's public key (therefore only accessible to their private key)
            string ownerEncryptedPassword = Convert.ToBase64String(rsaEngine.EncryptString(newFilePasswordPlainText, userPublicKey));
            
            // Encrypt headers so the content type and extension aren't visible in DB (mandatory)
            newFileTracker.EncryptHeaders(newFilePasswordPlainText);
            
            RepositoryReturn<bool> returnCreate = _mediaRepository.Create(
                newFileTracker,
                ownerEncryptedPassword,
                userLoggedInSession.userGuid);
            
            if (returnCreate.IsError)
            {
                return StatusCode(500, returnCreate.ErrorException.Message);
            }

            Console.WriteLine($"{file.Length / 1000000} MB");
            return Ok();
        }
        
        
        [HttpGet]
        public IActionResult Get([FromQuery] string resourceGuid)
        {
            string sessionId = Request.Cookies["sessionId"];

            if (sessionId == null)
                return BadRequest();
            
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

            RepositoryReturn<string> returnMediaKey = _mediaRepository.GetEncryptedMediaKey(queriedMediaTracker.Guid,
                userLoggedInSession.userGuid);
            
            if (returnMediaKey.IsError)
            {
                return StatusCode(500, returnMediaKey.ErrorException.Message);
            }
            
            if (returnMediaKey.ReturnValue == null)
            {
                // todo sleepy buzz this not right?
                return StatusCode(404);
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            // Get the user's private key to fetch the media decryption key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            string plainTextMediaKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnMediaKey.ReturnValue), privateKey);

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
        
        [HttpGet("giveAccessTo")]
        public IActionResult GiveAccessTo([FromQuery] string resourceGuid, string email)
        {
            string sessionId = Request.Cookies["sessionId"];

            if (sessionId == null)
                return BadRequest();
            
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

            RepositoryReturn<string> returnMediaKey = _mediaRepository.GetEncryptedMediaKey(queriedMediaTracker.Guid,
                userLoggedInSession.userGuid);
            
            if (returnMediaKey.IsError)
            {
                return StatusCode(500, returnMediaKey.ErrorException.Message);
            }
            
            if (returnMediaKey.ReturnValue == null)
            {
                // todo sleepy buzz this not right?
                return StatusCode(404);
            }
            
            RSAEngine rsaEngine = new RSAEngine();
            // Get the user's private key to fetch the media decryption key
            RSAParameters privateKey = rsaEngine.ConvertStringToKey(userLoggedInSession.privateKey);

            string plainTextMediaKey =
                rsaEngine.DecryptString(Convert.FromBase64String(returnMediaKey.ReturnValue), privateKey);

            RepositoryReturn<Person> requestPerson = _personRepository.GetByEmail(email);
            if (requestPerson.IsError)
            {
                return StatusCode(500, requestPerson.ErrorException.Message);
            }

            RSAParameters newPersonPublicKey = rsaEngine.ConvertStringToKey(requestPerson.ReturnValue.publicKey);
            
            // Encrypt the media key with the new persons public key
            string encryptedMediaKey = Convert.ToBase64String(rsaEngine.EncryptString(plainTextMediaKey, newPersonPublicKey));

            RepositoryReturn<bool> requestAddUserToMedia = _mediaRepository.AddUserToMedia(queriedMediaTracker.Guid,
                requestPerson.ReturnValue.Guid,
                encryptedMediaKey);
            if (requestAddUserToMedia.IsError)
            {
                return StatusCode(500, requestAddUserToMedia.ErrorException.Message);
            }

            return Ok();
        }

        [HttpGet("test")]
        public IActionResult GetTestFile()
        {
            var stream = new FileStream(@"/home/buzz/code/Motive/backend-api/backend-api/Resources_Output/apple.mkv", FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 65536, FileOptions.Asynchronous | FileOptions.SequentialScan);
            return File(stream, "application/octet-stream", "apple.mkv");
        }
    }
}