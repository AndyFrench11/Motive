using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using backend_api.Models;
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
        private string localDatabaseUrl = "bolt://localhost:7687";
        private string serverDatabaseUrl = "bolt://csse-s402g2.canterbury.ac.nz:7687";

        private string dbUser = "neo4j";
        private string dbPw = "motive";

        // GET api/person/{guid}
        [Microsoft.AspNetCore.Mvc.HttpGet("{guid}")]
        public ActionResult<Person> Get(string guid)
        {
            var client = new BoltGraphClient(new Uri(localDatabaseUrl), dbUser, dbPw);
            client.Connect();

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
            var driver = GraphDatabase.Driver(localDatabaseUrl, AuthTokens.Basic(dbUser, dbPw));
            
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
            tx.Run("CREATE(:Person {" +
               $"firstName: '{personToCreate.firstName}', " +
               $"lastName: '{personToCreate.lastName}', " +
               $"guid: '{personToCreate.guid}', " +
               $"dateJoined: '{personToCreate.dateJoined}', " +
               $"dateOfBirth: '{personToCreate.dateOfBirth}', " +
               $"email: '{personToCreate.email}', " +
               $"profileBio: '{personToCreate.profileBio}'," +
               $"password: '{personToCreate.password}'" +
            "})");
        }
    }
}
