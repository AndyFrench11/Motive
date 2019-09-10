using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;

using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using backend_api.Database.SessionRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver.V1;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private IPersonRepository _personRepository;
        private ISessionRepository _sessionRepository;

        public LoginController()
        {
            _personRepository = new PersonRepository();
            _sessionRepository = new SessionRepository();
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
            
            Session newSession = new Session();
            RepositoryReturn<bool> requestSessionAdd = _sessionRepository.Add(newSession, allegedAccount.ReturnValue.Guid);
            if (requestSessionAdd.IsError)
            {
                // Server-side/DB error
                return StatusCode(500, requestSessionAdd.ErrorException.Message);
            }

            // TODO switch to secure with HTTPS
            Response.Cookies.Append("sessionId", newSession.sessionId, new CookieOptions
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
            RepositoryReturn<Person> requestGetPersonOnSession = _sessionRepository.GetUserOnSession(sessionId);
            if (requestGetPersonOnSession.IsError)
            {
                return StatusCode(500, requestGetPersonOnSession.ErrorException.Message);
            }
            if (requestGetPersonOnSession.ReturnValue == null)
            {
                // Session ID does not exist, return Unauthorized
                return StatusCode(401);
            }
            
            
            RepositoryReturn<bool> requestSessionDelete = _sessionRepository.Delete(sessionId);
            if (requestSessionDelete.IsError)
            {
                // Server-side/DB error
                return StatusCode(500, requestSessionDelete.ErrorException.Message);
            }
            
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
