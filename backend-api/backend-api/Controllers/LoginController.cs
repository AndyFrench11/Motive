using System;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private IPersonRepository _personRepository;

        public LoginController()
        {
            _personRepository = new PersonRepository();
        }
        
        // POST api/login
        [HttpPost]
        public ActionResult Post([FromBody]LoginPerson loginPerson)
        {
            // TODO sanitise input
            
            // Grab 'alleged' account
            RepositoryReturn<Person> allegedAccount = _personRepository.GetByEmail(loginPerson.email);
            
            if (allegedAccount.IsError)
            {
                // Server-side/DB error
                return StatusCode(500, allegedAccount.ErrorException.Message);
            }
            
            if (allegedAccount.ReturnValue == null)
            {
                // No email exists, unauthorized
                return StatusCode(401);
            }

            if (!IsValidPassword(loginPerson.password, allegedAccount.ReturnValue.password))
            {
                // Wrong password, unauthorized
                return StatusCode(401);
            }

            string plaintextPassword = loginPerson.password;
            AESEngine aesEngine = new AESEngine();
            
            // Decrypt their private key to use in the session
            Session newSession = new Session
            (
                aesEngine.DecryptStringFromBytes_Aes(
                    Convert.FromBase64String(allegedAccount.ReturnValue.encryptedPrivateKey),
                    plaintextPassword),
                allegedAccount.ReturnValue.Guid
            );

            string createdSessionId = SessionsController.CreateSession(allegedAccount.ReturnValue.Guid, newSession);
            
            // TODO switch to 'Secure' with HTTPS
            Response.Cookies.Append("sessionId", createdSessionId, new CookieOptions
            {
                HttpOnly = true,
                Domain = null,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.Now.AddHours(1)
            });            
            return Ok(new StrippedPerson(allegedAccount.ReturnValue));
        }
        
        // Used to serialise user account details to client
        class StrippedPerson
        {
            public string firstName { get; set; }
        
            public string lastName { get; set; }
        
            public string email { get; set; }

            public StrippedPerson(Person personToStrip)
            {
                this.firstName = personToStrip.firstName;
                this.lastName = personToStrip.lastName;
                this.email = personToStrip.email;
            }
        }

        
        private bool IsValidPassword(string plaintextPassword, string hashPassword)
        {
            byte[] hashBytes = Convert.FromBase64String(hashPassword);

            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            var pbkdf2 = new Rfc2898DeriveBytes(plaintextPassword, salt, 10000);

            byte[] hash = pbkdf2.GetBytes(20);

            bool hashMatch = true;
            for (int i = 0; i < 20; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    hashMatch = false;
            }

            return hashMatch;
        }
                
        // DELETE api/login
        [HttpDelete]
        public ActionResult Delete()
        {
            string sessionId = Request.Cookies["sessionId"];
            if (!SessionsController.CloseSession(sessionId)) return StatusCode(401);
            
            // Successfully closed session
            Response.Cookies.Append("sessionId", sessionId, new CookieOptions
            {
                HttpOnly = true,
                Domain = null,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.Now.AddHours(-1),
            });
            return StatusCode(200);
        }
    }
}
