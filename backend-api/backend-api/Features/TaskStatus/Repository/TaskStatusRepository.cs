using System;
using backend_api.Database;
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
                    _session.WriteTransaction(tx => AddStatusProperty(tx, taskGuid, status));

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
        
        private void AddStatusProperty(ITransaction tx, Guid taskGuid, string status)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "SET task.status = $status ";
            
            tx.Run(statement, new {taskId, status});
        }

        public RepositoryReturn<string> GetForTask(Guid taskGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Edit(Guid taskGuid, string status)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid taskGuid)
        {
            throw new NotImplementedException();
        }
    }
}