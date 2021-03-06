﻿using System;
using System.Linq;
using backend_api.Database;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskStatus.Repository
{
    public class TaskStatusRepository: ITaskStatusRepository
    {
        
        private readonly neo4jConnection _neo4JConnection;

        public TaskStatusRepository()
        {
            _neo4JConnection = new neo4jConnection();
        }
        public RepositoryReturn<bool> Add(Guid taskGuid, string status)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Add task status node
                    session.WriteTransaction(tx => SetStatusProperty(tx, taskGuid, status));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void SetStatusProperty(ITransaction tx, Guid taskGuid, string status)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "SET task.status = $status ";
            
            tx.Run(statement, new {taskId, status});
        }

        public RepositoryReturn<string> GetForTask(Guid taskGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Add task status node
                    var status = session.ReadTransaction(tx => GetStatusProperty(tx, taskGuid));
                    
                    return new RepositoryReturn<string>(status);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<string>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<string>(true, e);
            }
        }
        
        private string GetStatusProperty(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "RETURN task.status";
            
            var result = tx.Run(statement, new {taskId}).SingleOrDefault();
            if (result == null)
            {
                return "";
            }
            var record = result[0];
            return record == null ? "" : record.ToString();
        }

        public RepositoryReturn<bool> Edit(Guid taskGuid, string status)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Add task status node
                    session.WriteTransaction(tx => SetStatusProperty(tx, taskGuid, status));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        public RepositoryReturn<bool> Delete(Guid taskGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Add task status node
                    session.WriteTransaction(tx => SetStatusProperty(tx, taskGuid, ""));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
    }
}