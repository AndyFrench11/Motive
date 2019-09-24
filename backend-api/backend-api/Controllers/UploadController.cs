using System;
using System.IO;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.MediaRepository;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    [ValidSessionRequired]
    public class UploadController : Controller
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMediaRepository _mediaRepository;
        
        public UploadController()
        {
            _personRepository = new PersonRepository();
            _mediaRepository = new MediaRepository();
        }
        
        // POST -> api/upload
        [HttpPost]
        [DisableRequestSizeLimit]
        public IActionResult ReceiveFileFromClient([FromForm] IFormFile file)
        {
            string sessionId = Request.Cookies["sessionId"];

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
            
            return StatusCode(201, Json(newFileTracker.Guid));
        }
    }
}