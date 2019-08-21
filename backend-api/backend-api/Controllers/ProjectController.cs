using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Neo4j.Driver.V1;
using Neo4jClient;


namespace backend_api.Controllers
{
    [Route("api/person/{userId}/[controller]")]
    public class ProjectController : Controller
    {
        public string userId { get; set; }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            this.userId = context.RouteData.Values["userId"].ToString();
            base.OnActionExecuting(context);
        }

        private readonly string _databaseUrl = ConfigurationManager.AppSettings["databaseURL"];
        private readonly string _databaseHttpUrl = ConfigurationManager.AppSettings["databaseHttpURL"];
        private readonly string _dbUser = ConfigurationManager.AppSettings["databaseUsername"];
        private readonly string _dbPw = ConfigurationManager.AppSettings["databasePassword"];


        // GET: api/values
        [HttpGet]
        public ActionResult<List<Project>> Get()
        {
            try
            {
                var client = new GraphClient(new Uri(_databaseHttpUrl + "/db/data"), _dbUser, _dbPw);
                client.Connect();

                var projectResult = client.Cypher
                        .Match("(person:Person) -- (project:Project)")
                        .Where((Person person) => person.guid == userId)
                       .Return(project => project.CollectAs<Project>())
                       .Results;

                if (!projectResult.Any())
                {
                    return StatusCode(404);
                }
                else
                {
                    List<Project> returnedProjects = projectResult.ElementAt(0).ToList();

                    foreach(Project currentProject in returnedProjects)
                    {
                        var tagResult = client.Cypher
                        .Match("(project:Project) -- (tag:Tag)")
                        .Where((Project project) => project.guid == currentProject.guid)
                        .Return(tag => tag.As<Tag>())
                        .Results;

                        currentProject.tagList = tagResult.ToList();

                        var taskResult = client.Cypher
                           .Match("(project:Project) -- (projectTask:ProjectTask)")
                           .Where((Project project) => project.guid == currentProject.guid)
                           .Return(projectTask => projectTask.As<ProjectTask>())
                           .Results;

                        currentProject.taskList = taskResult.ToList();
                    }



                    return returnedProjects;
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

        // GET api/values/5
        [HttpGet("{projectId}")]
        public ActionResult<Project> Get(string projectId)
        {
            //DO DATABASE CALL TO RETRIEVE ALL DETAILS OF PROJECT NODE AND RELATIONSHIPS TO TAGS AND NODES
            //Convert into a Project Object
            //Send back to front end 

            try
            {

                var client = new GraphClient(new Uri(_databaseHttpUrl + "/db/data"), _dbUser, _dbPw);
                client.Connect();

                var projectResult = client.Cypher
                    .Match("(project:Project)")
                    .Where((Project project) => project.guid == projectId)
                    .Return(project => project.As<Project>())
                    .Results;

                if (projectResult.Count() == 0)
                {
                    return StatusCode(404);
                }
                else
                {
                    Project returnedProject = projectResult.ElementAt(0);
                    //Get all the tags
                    var tagResult = client.Cypher
                        .Match("(project:Project) -- (tag:Tag)")
                        .Where((Project project) => project.guid == projectId)
                        .Return(tag => tag.As<Tag>())
                        .Results;

                    returnedProject.tagList = tagResult.ToList();

                    var taskResult = client.Cypher
                       .Match("(project:Project) -- (projectTask:ProjectTask)")
                       .Where((Project project) => project.guid == projectId)
                       .Return(projectTask => projectTask.As<ProjectTask>())
                       .Results;

                    returnedProject.taskList = taskResult.ToList();


                    return returnedProject;
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

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody]Project project)
        {
            var driver = GraphDatabase.Driver(_databaseUrl, AuthTokens.Basic(_dbUser, _dbPw));
            Guid guid = Guid.NewGuid();
            project.guid = guid.ToString();
            try
            {

                using (var session = driver.Session())
                {
                    session.WriteTransaction(tx => CreateProjectNode(tx, project));
                    session.WriteTransaction(tx => CreateProjectRelationship(tx, project));

                    session.WriteTransaction(tx => CreateTagNodes(tx, project));
                    session.WriteTransaction(tx => CreateTagRelationships(tx, project));

                    session.WriteTransaction(tx => CreateTaskNodes(tx, project));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, project));
                    return StatusCode(201, project.guid);
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

        private void CreateProjectRelationship(ITransaction tx, Project project)
        {
            //Create the relationship to the project
            string projectGuid = project.guid;
            string typeString = "owner";
            tx.Run("MATCH (p:Project),(pe:Person) WHERE p.guid = $projectGuid AND pe.guid = $userId CREATE (pe)-[:CONTRIBUTES_TO {type:[$typeString]}]->(p)", new { projectGuid, userId, typeString });


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
                bool taskCompleted = false;
                tx.Run("CREATE(pt:ProjectTask {name: $taskName, guid: $taskGuid, completed: $taskCompleted})", new { taskName, taskGuid, taskCompleted });
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
        [HttpPut("{projectId}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{projectId}")]
        public void Delete(int id)
        {

        }
    }
}
