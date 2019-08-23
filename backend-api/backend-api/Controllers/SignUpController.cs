using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    public class SignUpController : Controller
    {
        // Contains the format of a Sign Up JSON object
        // POST api/signup
        [Microsoft.AspNetCore.Mvc.HttpPost]
        public ActionResult Post([Microsoft.AspNetCore.Mvc.FromBody] SignUpPerson loginPerson)
        {
            Console.WriteLine(loginPerson);

            // If user already exists
            return Conflict();
            return Ok();
        }
    }

}