using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver.V1;
using Neo4jClient;

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

            if (loginPerson.password != allegedAccount.ReturnValue.password)
            {
                // Wrong password, unauthorized
                return StatusCode(401);
            }

            string token =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJ1enogVGVzdCBUb2tlbiIsImlhdCI6MTUxNjIzOTAyMn0.vUOPQDwOUup64tXOj5BXxAS9lEqmd4rLy01eCbwPDAA";
            return StatusCode(200, token);
        }
    }
}
