﻿using System;
using System.Linq;
using backend_api.Features.TaskForum.Repository;
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


        private void CreateTaskNode(ITransaction tx, ProjectTask task)
        {
            //Add the tag node to the database
            string taskName = task.name;
            string taskGuid = task.Guid.ToString();
            bool completed = task.completed;
            int orderIndex = task.orderIndex;
            var status = task.Status;
            tx.Run("CREATE(pt:ProjectTask {name: $taskName, " +
                   "completed: $completed, " +
                   "orderIndex: $orderIndex, " +
                   "dateTimeCreated: localdatetime({ timezone: 'Pacific/Auckland' }), " +
                   "status: $status, " +
                   "guid: $taskGuid})",
                new {taskName, completed, orderIndex, taskGuid, status});
        }

        private void CreateTaskRelationship(ITransaction tx, ProjectTask task, Guid projectGuid)
        {
            //Create the relationship to the project
            string taskId = task.Guid.ToString();
            string projectId = projectGuid.ToString();
            tx.Run(
                "MATCH (p:Project),(t:ProjectTask) WHERE p.guid = $projectId AND t.guid = $taskId CREATE (p)-[:HAS]->(t)",
                new {projectId, taskId});
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
            string query = "MATCH (a:ProjectTask) WHERE a.guid = $projectTaskId " +
                           "SET a.completed = $completed";

            if (completed)
            {
                query += ", a.dateTimeCompleted = localdatetime({ timezone: 'Pacific/Auckland' })";
            }
            else
            {
                query += ", a.dateTimeCompleted = NULL";
            }

            tx.Run(query,
                new {projectTaskId, completed});
        }

        public RepositoryReturn<bool> Delete(Guid projectTaskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    //Delete channel node and messages first
                    var channelRepository = new ChannelRepository();
                    var result = channelRepository.DeleteAll(projectTaskGuid);

                    if (result.IsError)
                    {
                        return result;
                    }

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
            tx.Run("MATCH (a:ProjectTask) WHERE a.guid = $projectTaskId DETACH DELETE a", new {projectTaskId});
        }

        public RepositoryReturn<bool> Exists(Guid projectTaskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Find single task
                    var foundTask = session.ReadTransaction(tx => RetrieveTask(tx, projectTaskGuid));
                    return foundTask != null ? new RepositoryReturn<bool>(true) : new RepositoryReturn<bool>(false);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private ProjectTask RetrieveTask(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();

            const string statement = "MATCH (task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "RETURN task";
            var result = tx.Run(statement, new {taskId});
            var record = result.SingleOrDefault();
            return record == null ? null : new ProjectTask(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<Project> GetProject(Guid projectTaskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Find project that contains task
                    var project = session.ReadTransaction(tx => RetrieveProjectFromTask(tx, projectTaskGuid));
                    return new RepositoryReturn<Project>(project);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<Project>(true, e);
            }
        }

        private Project RetrieveProjectFromTask(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();

            const string statement = "MATCH (project:Project)-[has:HAS]-(task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "RETURN project";
            var result = tx.Run(statement, new {taskId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Project(record[0].As<INode>().Properties);
        }
    }
}