using System;
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
    public class RandomController : Controller
    {
        // GET: api/values
        [HttpGet]
        public String Get()
        {
            List<String> people = new List<string>() { "Andy", "Matilda", "Buzz" };
            Random r = new Random();
            int rInt = r.Next(0, 3);

            return people.ElementAt(rInt);

        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {

            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "andy")))
            {
                using (var session = driver.Session())
                {
                    //session.Run("CREATE (a:Person {name:'Andy', title:'SoftwareDev'})");
                    //session.Run("CREATE (a:Person {name:'Buzz', title:'The II'})");
                    ////var result = session.Run("MATCH (a:Person) WHERE a.name = 'Arthur' RETURN a.name AS name, a.title AS title");

                    ////foreach (var record in result)
                    ////Console.WriteLine($"{record["title"].As<string>()} {record["name"].As<string>()}");
                    Console.WriteLine("----------------------");

                    var greeting = session.WriteTransaction(tx =>
                    {
                        var result = tx.Run("CREATE (Andy:Person {name:'Andy', title:'SoftwareDev'})");
                        return result;
                    });
                    Console.WriteLine(greeting);
                    Console.WriteLine("----------------------");
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
