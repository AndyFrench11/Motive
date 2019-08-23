using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using backend_api.Models;
using System.Configuration;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Scaffolding.Internal;
using Neo4j.Driver.V1;
using Neo4jClient;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class PersonController : Controller
    {
        private IPersonRepository _personRepository;
        
        public PersonController()
        {
            _personRepository = new PersonRepository();
        }

        // GET api/person/{guid}
        [HttpGet("{guid}")]
        public ActionResult<Person> Get(string guid)
        {
            Guid guidToGet;
            try
            {
                guidToGet = Guid.Parse(guid);
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }
            catch (FormatException)
            {
                return BadRequest();
            }

            RepositoryReturn<Person> result = _personRepository.GetByGuid(guidToGet);
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200, result.ReturnValue);
        }

        // POST api/person
        [HttpPost]
        public ActionResult Post([FromBody]Person personToCreate)
        {
            Console.WriteLine(personToCreate);
            // TODO sanitise incoming person body
            RepositoryReturn<bool> result = _personRepository.Add(personToCreate);
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }


        
        // Get api/person
        [HttpGet]
        public ActionResult<List<Person>> GetAllPeople()
        {
            RepositoryReturn<IEnumerable<Person>> result = _personRepository.GetAll();
            
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(200, result.ReturnValue);
        }
    }

}
