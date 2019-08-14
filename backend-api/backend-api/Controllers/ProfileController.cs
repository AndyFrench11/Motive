using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using backend_api.Models;

using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver.V1;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProfileController : Controller
    {
        
        [HttpGet]
        public String Get()
        {
            String query = "MATCH (Person { firstName: 'Buzz' })-[OWNS]->(Project)\nRETURN Project.name";
            
            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "ijwf4ufw")))
            {
                using (var session = driver.Session())
                {
                    IStatementResult greeting = session.WriteTransaction(tx =>
                    {
                        IStatementResult result = tx.Run(query);
                        return result;
                    });
                    Console.WriteLine();
                    Console.WriteLine();
                    Console.WriteLine();
                    Console.WriteLine();
                    Console.WriteLine();
                    Console.WriteLine(greeting);
                    
                    //return greeting.Keys
                }
            }

            return "Yay!";

        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {

            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "motive")))
            {
                using (var session = driver.Session())
                {
                    var greeting = session.WriteTransaction(tx =>
                    {
                        // var result = tx.Run("CREATE (Buzz:Person {firstName:'Buzz', lastName:'Knightyear'})");
                        var result = tx.Run("");

                        return result;
                    });
                }
            }

            return "Yay!";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
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
