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
            
            var driver = GraphDatabase.Driver(_databaseUrl, AuthTokens.Basic(_dbUser, _dbPw));

            try
            {
                using (var session = driver.Session())
                {

                    var returnedPerson = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run($"MATCH (a:Person) WHERE a.guid = '{guid}' RETURN a");

                        //Do a check to see if result.single() is empty
                        var record = result.SingleOrDefault();
                        if (record == null)
                        {
                            return null;
                        }
                        else
                        {
                            return new Person(record[0].As<INode>().Properties);
                        }
                    });

                    if (returnedPerson == null)
                    {
                        return StatusCode(404);
                    }

                    return StatusCode(200, returnedPerson);
                }
            }

            catch (ServiceUnavailableException e)
            {
                Console.WriteLine(e);
                return StatusCode(503);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return StatusCode(500);
            }
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

       
        [Microsoft.AspNetCore.Mvc.HttpGet("allpeople")]
        public ActionResult<List<Person>> GetAllPeople()
        {
            var driver = GraphDatabase.Driver(_databaseUrl, AuthTokens.Basic(_dbUser, _dbPw));

            try
            {
                using (var session = driver.Session())
                {

                    var returnedPeople = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run("MATCH (a:Person) RETURN a");

                        //Do a check for no people

                        var records = result.Select(record => new Person(record[0].As<INode>().Properties)).ToList();

                        return records;

                    });

                    return StatusCode(200, returnedPeople);
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
