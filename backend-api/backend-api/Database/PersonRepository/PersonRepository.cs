using System;
using System.Collections.Generic;
using System.Linq;
using Neo4j.Driver.V1;

namespace backend_api.Database.PersonRepository
{
    public class PersonRepository : IPersonRepository
    {
        private readonly neo4jConnection _neo4jConnection;

        public PersonRepository()
        {
            _neo4jConnection = new neo4jConnection();
        }
        
        public RepositoryReturn<IEnumerable<Models.Person>> GetAll()
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedPeople = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run("MATCH (a:Person) RETURN a");

                        //Do a check for no people

                        var records = result.Select(record => new Models.Person(record[0].As<INode>().Properties)).ToList();

                        return records;

                    });

                    return new RepositoryReturn<IEnumerable<Models.Person>>(returnedPeople);
                }
            }
            
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<Models.Person>>(true, e);
            }
        }

        public RepositoryReturn<Models.Person> GetByGuid(Guid personGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedPerson = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run($"MATCH (a:Person) WHERE a.guid = '{personGuid}' RETURN a");

                        //Do a check to see if result.single() is empty
                        var record = result.SingleOrDefault();
                        if (record == null)
                        {
                            return null;
                        }
                        else
                        {
                            return new Models.Person(record[0].As<INode>().Properties);
                        }
                    });

                    return new RepositoryReturn<Models.Person>(returnedPerson);
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<Models.Person>(true, e);
            }
        }

        public RepositoryReturn<Models.Person> GetByEmail(string personEmail)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Add(Models.Person personToAdd)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreatePersonNode(tx, personToAdd));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }        
        
        private void CreatePersonNode(ITransaction tx, Models.Person personToCreate)
        {
            tx.Run("CREATE(person:Person {" +
                   $"firstName: '{personToCreate.firstName}', " +
                   $"lastName: '{personToCreate.lastName}', " +
                   $"guid: '{personToCreate.Guid}', " +
                   $"dateJoined: '{personToCreate.dateJoined}', " +
                   $"dateOfBirth: '{personToCreate.dateOfBirth}', " +
                   $"email: '{personToCreate.email}', " +
                   $"profileBio: '{personToCreate.profileBio}'," +
                   $"password: '{personToCreate.password}'" +
                   "})");
        }

        public RepositoryReturn<bool> Edit(Models.Person personToOverwrite)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Models.Person personToDelete)
        {
            throw new NotImplementedException();
        }
    }
}