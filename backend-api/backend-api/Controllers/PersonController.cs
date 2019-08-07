using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using backend_api.Models;
using System.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Scaffolding.Internal;
using Neo4j.Driver.V1;
using Neo4jClient;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend_api.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    public class PersonController : Controller
    {
        private readonly string _databaseUrl = ConfigurationManager.AppSettings["databaseURL"];
        private readonly string _dbUser = ConfigurationManager.AppSettings["databaseUsername"];
        private readonly string _dbPw = ConfigurationManager.AppSettings["databasePassword"];

        // GET api/person/{guid}
        [Microsoft.AspNetCore.Mvc.HttpGet("{guid}")]
        public ActionResult<Person> Get(string guid)
        {
            Console.WriteLine("Hello");
            var client = new GraphClient(new Uri(_databaseUrl), _dbUser, _dbPw);
            Console.WriteLine("Hello1");
            // TODO rewrite using official driver + replace credentials with proper values
            client.Connect();
            Console.WriteLine("Hello2");

            var result = client.Cypher
                .Match("(fetchedPerson:Person)")
                .Where((Person fetchedPerson) => fetchedPerson.guid == guid)
                .Return(fetchedPerson => fetchedPerson.As<Person>())
                .Results;

            if (!result.Any())
            {
                return StatusCode(404);
            }

            Person returnedPerson = result.ElementAt(0);
            returnedPerson.guid = guid;
            return StatusCode(200, returnedPerson);        
        }
        

        // POST api/person
        [Microsoft.AspNetCore.Mvc.HttpPost]
        public ActionResult Post([Microsoft.AspNetCore.Mvc.FromBody]Person personToCreate)
        {
            var driver = GraphDatabase.Driver(_databaseUrl, AuthTokens.Basic(_dbUser, _dbPw));
            
            try
            {
                using (var session = driver.Session())
                {
                    session.WriteTransaction(tx => CreatePersonNode(tx, personToCreate));
                    return Ok();
                }
            }
            catch (ServiceUnavailableException)
            {
                return StatusCode(503);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return StatusCode(500);
            }
        }

        private void CreatePersonNode(ITransaction tx, Person personToCreate)
        {
            tx.Run("CREATE(person:Person {" +
               $"firstName: '{personToCreate.firstName}', " +
               $"lastName: '{personToCreate.lastName}', " +
               $"guid: '{personToCreate.guid}', " +
               $"dateJoined: '{personToCreate.dateJoined}', " +
               $"dateOfBirth: '{personToCreate.dateOfBirth}', " +
               $"email: '{personToCreate.email}', " +
               $"profileBio: '{personToCreate.profileBio}'" +
            "})");
        }
    }
}
