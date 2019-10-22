using System;
using System.Linq;
using backend_api.Database;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskAssignment.Repository
{
    public class TaskAssignmentRepository: ITaskAssignmentRepository
    {
        
        private readonly neo4jConnection _neo4JConnection;

        public TaskAssignmentRepository()
        {
            _neo4JConnection = new neo4jConnection();
        }
        
        public RepositoryReturn<Person> GetForTask(Guid taskGuid) {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Get user assigned to task
                    var assignee = session.ReadTransaction(tx => GetAssignee(tx, taskGuid));
                    
                    return new RepositoryReturn<Person>(assignee);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<Person>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<Person>(true, e);
            }
        }
        
        private Person GetAssignee(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (person:Person)-[:ASSIGNED_TO]-(task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "RETURN person";
            
            var result = tx.Run(statement, new {taskId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Person(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<bool> Edit(Guid taskGuid, Guid userGuid) {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Remove old relationship
                    session.WriteTransaction(tx => RemoveAssignees(tx, taskGuid));

                    // Add new relationship
                    session.WriteTransaction(tx => AssignUser(tx, taskGuid, userGuid));

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
        
        private void AssignUser(ITransaction tx, Guid taskGuid, Guid userGuid)
        {
            var taskId = taskGuid.ToString();
            var userId = userGuid.ToString();
            
            const string statement = "MATCH (task:ProjectTask), (person:Person) " +
                                     "WHERE task.guid = $taskId " +
                                     "AND person.guid = $userId " +
                                     "CREATE UNIQUE (person)-[:ASSIGNED_TO]->(task) ";
            
            tx.Run(statement, new {taskId, userId});
        }
        
        private void RemoveAssignees(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (person:Person)-[r:ASSIGNED_TO]-(task:ProjectTask) " +
                                     "WHERE task.guid = $taskId " +
                                     "DELETE r";

            tx.Run(statement, new {taskId});
        }
        
        public RepositoryReturn<bool> Delete(Guid taskGuid) {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Remove assignee relationship
                    session.WriteTransaction(tx => RemoveAssignees(tx, taskGuid));

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