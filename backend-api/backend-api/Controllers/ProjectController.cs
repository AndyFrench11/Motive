using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver.V1;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class ProjectController : Controller
    {

        public string localDatabaseUrl = "bolt://localhost:7687";
        public string serverDatabaseUrl = "bolt://csse-s402g2.canterbury.ac.nz:7687";


        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]Project project)
        {

            using (var driver = GraphDatabase.Driver(localDatabaseUrl, AuthTokens.Basic("neo4j", "motive")))
            {
                using (var session = driver.Session())
                {
                    Console.WriteLine("----------------------");
                    Console.WriteLine("----------------------");

                    var creationString = "CREATE(Project {name:'" + project.name + "', description: '" + project.description + "', tasks: '', tags: ''})";
                    var result = session.Run(creationString);
                    Console.WriteLine("----------------------");

                }

            }
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
