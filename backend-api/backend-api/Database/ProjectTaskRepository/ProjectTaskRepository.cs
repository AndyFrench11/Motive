using System;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Database.ProjectTaskRepository
{
    public class ProjectTaskRepository : IProjectTaskRepository
    {
        
        private readonly neo4jConnection _neo4jConnection;

        public ProjectTaskRepository()
        {
            _neo4jConnection = new neo4jConnection();
        }
        
        public RepositoryReturn<bool> Add(ProjectTask projectTaskToAdd, Guid projectGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateTaskNode(tx, projectTaskToAdd));
                    session.WriteTransaction(tx => CreateTaskRelationship(tx, projectTaskToAdd, projectGuid));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }


        private void CreateTaskNode(ITransaction tx, ProjectTask task) {
            //Add the tag node to the database
            string taskName = task.name;
            string taskGuid = task.Guid.ToString();
            bool completed = task.completed;
            tx.Run("CREATE(pt:ProjectTask {name: $taskName, completed: $completed, guid: $taskGuid})", new { taskName, completed, taskGuid });
        }

        private void CreateTaskRelationship(ITransaction tx, ProjectTask task, Guid projectGuid)
        {
            //Create the relationship to the project
            string taskId = task.Guid.ToString();
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project),(t:ProjectTask) WHERE p.guid = $projectId AND t.guid = $taskId CREATE (p)-[:HAS]->(t)", new { projectId, taskId});
        }
        
        public RepositoryReturn<bool> EditCompletionStatus(bool completed, Guid projectTaskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => EditTaskNode(tx, completed, projectTaskGuid));
                    return new RepositoryReturn<bool>(true);
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void EditTaskNode(ITransaction tx, bool completed, Guid projectTaskGuid)
        {
            //Edit the task node based on completion status
            string projectTaskId = projectTaskGuid.ToString();
            tx.Run("MATCH (a:ProjectTask) WHERE a.guid = $projectTaskId SET a.completed = $completed", new { projectTaskId, completed });
        }

        public RepositoryReturn<bool> Delete(Guid projectTaskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => DeleteTaskNode(tx, projectTaskGuid));
                    return new RepositoryReturn<bool>(true);
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void DeleteTaskNode(ITransaction tx, Guid projectTaskGuid)
        {
            //Delete the task node
            string projectTaskId = projectTaskGuid.ToString();
            tx.Run("MATCH (a:ProjectTask) WHERE a.guid = $projectTaskId DETACH DELETE a", new { projectTaskId });

        }
    }
}