//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using backend_api.Models;
//using Microsoft.AspNetCore.Mvc;
//using Neo4j.Driver.V1;
//using Neo4jClient;
//
//namespace backend_api.Controllers
//{
//    [Route("api/[controller]")]
//    public class LoginController : Controller
//    {
//        public string localDatabaseUrl = "bolt://localhost:7687";
//        public string serverDatabaseUrl = "bolt://csse-s402g2.canterbury.ac.nz:7687";
//
//        // POST api/values
//        [HttpPost]
//        public ActionResult Post([FromBody]LoginPerson loginPerson)
//        {
//            //var driver = GraphDatabase.Driver(localDatabaseUrl, AuthTokens.Basic("neo4j", "motive"));
//            try
//            {
//                
//            }
//            catch (ServiceUnavailableException)
//            {
//                return StatusCode(503);
//            }
//            catch (Exception e)
//            {
//                Console.WriteLine(e);
//                return StatusCode(500);
//            }
//
//        }
//    }
//}
