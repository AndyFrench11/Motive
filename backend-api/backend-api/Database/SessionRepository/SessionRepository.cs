using System;
using System.Linq;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Database.SessionRepository
{
    public class SessionRepository : ISessionRepository
    {
        private readonly neo4jConnection _neo4jConnection;

        public SessionRepository()
        {
            _neo4jConnection = new neo4jConnection();
        }
        
        public RepositoryReturn<Person> GetUserOnSession(string sessionId)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedPerson = session.ReadTransaction(tx =>
                    {
                        var result = GetUserNodeBySession(tx, sessionId);

                        //Do a check to see if result.single() is empty
                        var record = result.SingleOrDefault();
                        if (record == null)
                        {
                            return null;
                        }
                        else
                        {
                            return new Person(record[0].As<INode>().Properties);
                        }
                    });

                    return new RepositoryReturn<Person>(returnedPerson);
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<Person>(true, e);
            }
        }

        private IStatementResult GetUserNodeBySession(ITransaction tx, string sessiondId)
        {
            return tx.Run($"MATCH (session:Session {{ sessionId: '{sessiondId}'}})<-[:LoggedInOn]-(person)" +
                   "\nRETURN person"
            );
        }

        public RepositoryReturn<bool> Add(Session sessionToAdd, Guid personUsingSessionGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateSessionNode(tx, sessionToAdd, personUsingSessionGuid));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }        
        
        private void CreateSessionNode(ITransaction tx, Session sessionToCreate, Guid personUsingSessionGuid)
        {
            tx.Run($"MATCH (person:Person) WHERE person.guid = '{personUsingSessionGuid.ToString()}' " + 
                   "CREATE(session:Session {" +
                   $"sessionId: '{sessionToCreate.sessionId}', " +
                   $"expiry: '{sessionToCreate.expiry}'" +
                   "}) " +
                   "CREATE (person)-[r:LoggedInOn]->(session)");
        }

        public RepositoryReturn<bool> Edit(Session sessionToOverwrite)
        {
            throw new System.NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(string sessionId)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => DeleteSessionNode(tx, sessionId));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void DeleteSessionNode(ITransaction tx, string sessionIdToDelete)
        {
            tx.Run($"MATCH (session:Session) WHERE session.sessionId = '{sessionIdToDelete}' " +
                   "DETACH DELETE session"
            );
        }
    }
}