using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    public class SignUpController : Controller
    {
        private IPersonRepository _personRepository;
        
        public SignUpController()
        {
            _personRepository = new PersonRepository();
        }
        
        // Contains the format of a Sign Up JSON object
        // POST api/signup
        [Microsoft.AspNetCore.Mvc.HttpPost]
        public ActionResult Post([Microsoft.AspNetCore.Mvc.FromBody] Person personToSignUp)
        {
            // TODO sanitise input
            
            // Check if account already exists
            RepositoryReturn<Person> userExistsResult = _personRepository.GetByEmail(personToSignUp.email);
            
            if (userExistsResult.IsError)
            {
                return StatusCode(500, userExistsResult.ErrorException.Message);
            }

            if (userExistsResult.ReturnValue != null)
            {
                // Account already exists
                return StatusCode(409);
            }
            
            RepositoryReturn<bool> result = _personRepository.Add(personToSignUp);
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }
    }

}