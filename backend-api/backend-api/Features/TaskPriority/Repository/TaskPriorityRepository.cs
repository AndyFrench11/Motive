using System;
using System.Linq;
using backend_api.Database;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskPriority.Repository
{
    public class TaskPriorityRepository : ITaskPriorityRepository
    {
        private readonly ISession _session;

        public TaskPriorityRepository()
        {
            var neo4JConnection = new neo4jConnection();
            _session = neo4JConnection.driver.Session();
        }
        
        public RepositoryReturn<string> GetForTask(Guid taskGuid)
        {
            try
            {
                using (_session)
                {
                    // Add task status node
                    var priority = _session.ReadTransaction(tx => GetPriorityProperty(tx, taskGuid));
                    
                    return new RepositoryReturn<string>(priority);
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
        
        private string GetPriorityProperty(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "RETURN task.priority";
            
            var result = tx.Run(statement, new {taskId}).SingleOrDefault();
            if (result == null)
            {
                return "";
            }
            var record = result[0];
            return record == null ? "" : record.ToString();
        }
        
        public RepositoryReturn<bool> Edit(Guid taskGuid, string priority)
        {
            try
            {
                using (_session)
                {
                    // Add task status node
                    _session.WriteTransaction(tx => SetPriorityProperty(tx, taskGuid, priority));

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
        
        private void SetPriorityProperty(ITransaction tx, Guid taskGuid, string priority)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "SET task.priority = $priority ";
            
            tx.Run(statement, new {taskId, priority});
        }

        public RepositoryReturn<bool> Delete(Guid taskGuid)
        {
            try
            {
                using (_session)
                {
                    // Add task status node
                    _session.WriteTransaction(tx => SetPriorityProperty(tx, taskGuid, ""));

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