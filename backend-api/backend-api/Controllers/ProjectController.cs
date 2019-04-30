using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
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
            //private static long MatchPersonNode(ITransaction tx, string name)
            //{
            //    var result = tx.Run("MATCH (a:Person {name: $name}) RETURN id(a)", new { name });
            //    return result.Single()[0].As<long>();
            //}
            return "value";
        }

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody]Project project)
        {
            var driver = GraphDatabase.Driver(localDatabaseUrl, AuthTokens.Basic("neo4j", "motive"));
            Guid guid = Guid.NewGuid();
            project.guid = guid.ToString();
            try
            {

                using (var session = driver.Session())
                {
                    session.WriteTransaction(tx => CreateProjectNode(tx, project));
                    session.WriteTransaction(tx => CreateTagNodes(tx, project));
                    session.WriteTransaction(tx => CreateTagRelationships(tx, project));
                    session.WriteTransaction(tx => CreateTaskNodes(tx, project));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, project));
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

        private void CreateProjectNode(ITransaction tx, Project project)
        {
            string projectName = project.name;
            string projectDescription = project.description;
            string projectGuid = project.guid;
            tx.Run("CREATE(p:Project {name: $projectName, description: $projectDescription, guid: $projectGuid})", new { projectName, projectDescription, projectGuid });
        }

        private void CreateTagNodes(ITransaction tx, Project project) {
            foreach(Tag tag in project.tagList)
            {
                //Add the tag node to the database
                string tagName = tag.name;
                tx.Run("MERGE(t:Tag {name: $tagName})", new { tagName });
            }

        }

        private void CreateTagRelationships(ITransaction tx, Project project)
        {
            foreach (Tag tag in project.tagList)
            {
                //Create the relationship to the project
                string projectGuid = project.guid;
                string tagName = tag.name;
                tx.Run("MATCH (p:Project),(t:Tag) WHERE p.guid = $projectGuid AND t.name = $tagName CREATE (p)-[:HAS]->(t)", new { projectGuid, tagName});
            }

        }



        private void CreateTaskNodes(ITransaction tx, Project project) {
            Guid guid;
            foreach (ProjectTask task in project.taskList)
            {
                //Add the tag node to the database
                string taskName = task.name;
                guid = Guid.NewGuid();
                task.guid = guid.ToString();
                string taskGuid = task.guid;
                tx.Run("CREATE(pt:ProjectTask {name: $taskName, guid: $taskGuid})", new { taskName, taskGuid });
            }
        }

        private void CreateTaskRelationships(ITransaction tx, Project project)
        {
            foreach (ProjectTask task in project.taskList)
            {
                //Create the relationship to the project
                string taskName = task.name;
                string projectGuid = project.guid;
                tx.Run("MATCH (p:Project),(t:ProjectTask) WHERE p.guid = $projectGuid AND t.name = $taskName CREATE (p)-[:HAS]->(t)", new { projectGuid, taskName});
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
