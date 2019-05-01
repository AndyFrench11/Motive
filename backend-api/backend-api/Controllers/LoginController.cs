using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver.V1;
using Neo4jClient;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        public string localDatabaseUrl = "bolt://localhost:7687";
        public string serverDatabaseUrl = "bolt://csse-s402g2.canterbury.ac.nz:7687";

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody]LoginPerson loginPerson)
        {
            //var driver = GraphDatabase.Driver(localDatabaseUrl, AuthTokens.Basic("neo4j", "motive"));
            try
            {
                var client = new GraphClient(new Uri("http://localhost:7474/db/data"), "neo4j", "motive");
                client.Connect();

                var validationResult = client.Cypher
                    .Match("(person:Person)")
                    .Where((Person person) => person.email == loginPerson.email)
                    .AndWhere((Person person) => person.password == loginPerson.password)
                    .Return(person => person.As<Person>())
                    .Results;
                    
                if (!validationResult.Any())
                {
                    return StatusCode(404);
                }
                else
                {
                    return StatusCode(200);
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
    }
}
