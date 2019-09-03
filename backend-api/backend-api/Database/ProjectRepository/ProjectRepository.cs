using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Database.ProjectRepository
{
    public class ProjectRepository : IProjectRepository
    {
        
        private readonly neo4jConnection _neo4jConnection;
        private readonly neo4jClient _neo4jClient;

        public ProjectRepository()
        {
            _neo4jConnection = new neo4jConnection();
            _neo4jClient = new neo4jClient();
        }
        
        public RepositoryReturn<IEnumerable<Project>> GetAllForUser(Guid personGuid)
        {
            try
            {
                   
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedProjects = session.ReadTransaction(tx => RetrieveUserProjects(tx, personGuid));
                    foreach (Project currentProject in returnedProjects)
                    {
                        var returnedTags = session.ReadTransaction(tx => RetrieveProjectTags(tx, currentProject.Guid));
                        currentProject.tagList = returnedTags.ToList();
                        var returnedTasks = session.ReadTransaction(tx => RetrieveProjectTasks(tx, currentProject.Guid));
                        currentProject.taskList = returnedTasks.ToList();
                    }
                    //TODO Do a check for projects returned

                    return new RepositoryReturn<IEnumerable<Project>>(returnedProjects);
                }

            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<Project>>(true, e);
            }
            
            
        }

        private List<Project> RetrieveUserProjects(ITransaction tx, Guid personGuid)
        {
            var personId = personGuid.ToString();
            var result = tx.Run("MATCH (person:Person) -- (project:Project) WHERE person.guid = $personId RETURN project", new { personId });

            var records = result.Select(record => new Project(record[0].As<INode>().Properties)).ToList();

            return records;
        }

        private List<Tag> RetrieveProjectTags(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (project:Project) -- (tag:Tag) WHERE project.guid = $projectId RETURN tag", new { projectId });

            var records = result.Select(record => new Tag(record[0].As<INode>().Properties)).ToList();

            return records;
        }
        
        private List<ProjectTask> RetrieveProjectTasks(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (project:Project) -- (projectTask:ProjectTask) WHERE project.guid = $projectId RETURN projectTask", new { projectId });

            var records = result.Select(record => new ProjectTask(record[0].As<INode>().Properties)).ToList();

            return records;
        }
       

        public RepositoryReturn<Project> GetByGuid(Guid projectGuid)
        {
            try
            {
                var client = _neo4jClient.client;  
                client.Connect();

                var projectResult = client.Cypher
                    .Match("(project:Project)")
                    .Where((Project project) => project.Guid == projectGuid)
                    .Return(project => project.As<Project>())
                    .Results;

                if (projectResult.Count() == 0)
                {
                    return new RepositoryReturn<Project>(true, new ArgumentNullException());
                }
                else
                {
                    Project returnedProject = projectResult.ElementAt(0);
                    //Get all the tags
                    var tagResult = client.Cypher
                        .Match("(project:Project) -- (tag:Tag)")
                        .Where((Project project) => project.Guid == projectGuid)
                        .Return(tag => tag.As<Tag>())
                        .Results;

                    returnedProject.tagList = tagResult.ToList();

                    var taskResult = client.Cypher
                       .Match("(project:Project) -- (projectTask:ProjectTask)")
                       .Where((Project project) => project.Guid == projectGuid)
                       .Return(projectTask => projectTask.As<ProjectTask>())
                       .Results;

                    returnedProject.taskList = taskResult.ToList();


                    return new RepositoryReturn<Project>(returnedProject);
                }

            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<Project>(true, e);
            }
        }

        public RepositoryReturn<bool> Add(Project projectToAdd, Guid userGuid)
        {
            
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateProjectNode(tx, projectToAdd));
                    session.WriteTransaction(tx => CreateProjectRelationship(tx, projectToAdd, userGuid));

                    session.WriteTransaction(tx => CreateTagNodes(tx, projectToAdd));
                    session.WriteTransaction(tx => CreateTagRelationships(tx, projectToAdd));

                    session.WriteTransaction(tx => CreateTaskNodes(tx, projectToAdd));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, projectToAdd));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void CreateProjectNode(ITransaction tx, Project project)
        {
            string projectName = project.name;
            string projectDescription = project.description;
            string projectGuid = project.Guid.ToString();
            tx.Run("CREATE(p:Project {name: $projectName, description: $projectDescription, guid: $projectGuid})", new { projectName, projectDescription, projectGuid });
        }

        private void CreateProjectRelationship(ITransaction tx, Project project, Guid userGuid)
        {
            //Create the relationship to the project
            string projectGuid = project.Guid.ToString();
            string typeString = "owner";
            string userId = userGuid.ToString();
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
                string projectGuid = project.Guid.ToString();
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
                string taskGuid = task.Guid.ToString();
                tx.Run("CREATE(pt:ProjectTask {name: $taskName, guid: $taskGuid})", new { taskName, taskGuid });
            }
        }

        private void CreateTaskRelationships(ITransaction tx, Project project)
        {
            foreach (ProjectTask task in project.taskList)
            {
                //Create the relationship to the project
                string taskName = task.name;
                string projectGuid = project.Guid.ToString();
                tx.Run("MATCH (p:Project),(t:ProjectTask) WHERE p.guid = $projectGuid AND t.name = $taskName CREATE (p)-[:HAS]->(t)", new { projectGuid, taskName});
            }
        }

        public RepositoryReturn<bool> Edit(Project projectToOverwrite)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid projectGuid)
        {
            throw new NotImplementedException();
        }
    }
}
