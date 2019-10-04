using System;
using System.Linq;
using backend_api.Database;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskStatus.Repository
{
    public class TaskStatusRepository: ITaskStatusRepository
    {
        
        private readonly ISession _session;

        public TaskStatusRepository()
        {
            var neo4JConnection = new neo4jConnection();
            _session = neo4JConnection.driver.Session();
        }
        public RepositoryReturn<bool> Add(Guid taskGuid, string status)
        {
            try
            {
                using (_session)
                {
                    // Add task status node
                    _session.WriteTransaction(tx => SetStatusProperty(tx, taskGuid, status));

                    return new RepositoryReturn<bool>(false);
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
                using (_session)
                {
                    // Add task status node
                    var status = _session.ReadTransaction(tx => GetStatusProperty(tx, taskGuid));
                    
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
            var record = result[0];
            return record == null ? "" : record.ToString();
        }

        public RepositoryReturn<bool> Edit(Guid taskGuid, string status)
        {
            try
            {
                using (_session)
                {
                    // Add task status node
                    _session.WriteTransaction(tx => SetStatusProperty(tx, taskGuid, status));

                    return new RepositoryReturn<bool>(false);
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
                using (_session)
                {
                    // Add task status node
                    _session.WriteTransaction(tx => SetStatusProperty(tx, taskGuid, ""));

                    return new RepositoryReturn<bool>(false);
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