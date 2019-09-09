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

        public ProjectRepository()
        {
            _neo4jConnection = new neo4jConnection();
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

        private Project RetrieveSingleUserProject(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (project:Project) WHERE project.guid = $projectId RETURN project", new { projectId });

            var record = result.SingleOrDefault();
            if (record == null)
            {
                return null;
            }
            return new Project(record[0].As<INode>().Properties);
            
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
                using (var session = _neo4jConnection.driver.Session())
                {
                    var returnedProject = session.ReadTransaction(tx => RetrieveSingleUserProject(tx, projectGuid));
                    
                    if (returnedProject == null)
                    {
                        return new RepositoryReturn<Project>(true, new ArgumentNullException());
                    }

                    var returnedTags = session.ReadTransaction(tx => RetrieveProjectTags(tx, projectGuid));
                    returnedProject.tagList = returnedTags.ToList();
                    var returnedTasks = session.ReadTransaction(tx => RetrieveProjectTasks(tx, projectGuid));
                    returnedProject.taskList = returnedTasks.ToList();

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

                    session.WriteTransaction(tx => CreateTaskNodes(tx, projectToAdd.taskList));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, projectToAdd.taskList, projectToAdd.Guid));
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

        private void CreateTaskNodes(ITransaction tx, List<ProjectTask> taskList) {
            foreach (ProjectTask task in taskList)
            {
                //Add the tag node to the database
                string taskName = task.name;
                string taskGuid = task.Guid.ToString();
                bool completed = task.completed;
                tx.Run("CREATE(pt:ProjectTask {name: $taskName, completed: $completed, guid: $taskGuid})", new { taskName, completed, taskGuid });
            }
        }

        private void CreateTaskRelationships(ITransaction tx, List<ProjectTask> taskList, Guid projectGuid)
        {
            foreach (ProjectTask task in taskList)
            {
                //Create the relationship to the project
                string taskGuid = task.Guid.ToString();
                string projectId = projectGuid.ToString();
                tx.Run("MATCH (p:Project),(t:ProjectTask) WHERE p.guid = $projectId AND t.guid = $taskGuid CREATE (p)-[:HAS]->(t)", new { projectId, taskGuid});
            }
        }

        public RepositoryReturn<bool> EditTaskOrder(List<ProjectTask> projectTaskList, Guid projectGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => RemoveExistingTaskNodes(tx, projectGuid));
                    session.WriteTransaction(tx => CreateTaskNodes(tx, projectTaskList));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, projectTaskList, projectGuid));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void RemoveExistingTaskNodes(ITransaction tx, Guid projectGuid)
        {
            //Create the relationship to the project
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) -- (pt:ProjectTask) WHERE p.guid = $projectId DETACH DELETE pt", new { projectId });
            
        }

        public RepositoryReturn<bool> Delete(Guid projectGuid)
        {
            throw new NotImplementedException();
        }
    }
}
