using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Models;
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
        
        public RepositoryReturn<IEnumerable<Person>> GetAll()
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedPeople = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run("MATCH (a:Person) RETURN a");

                        //Do a check for no people

                        var records = result.Select(record => new Person(record[0].As<INode>().Properties)).ToList();

                        return records;

                    });

                    return new RepositoryReturn<IEnumerable<Person>>(returnedPeople);
                }
            }
            
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<Person>>(true, e);
            }
        }

        public RepositoryReturn<IEnumerable<Person>> GetAllForProject(Guid projectGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    var returnedPeople = session.ReadTransaction(tx =>
                    {
                        string projectId = projectGuid.ToString();
                        var result = tx.Run("MATCH (p:Project) -- (a:Person) WHERE p.guid = $projectId RETURN a", new { projectId });
                        var records = result.Select(record => new Person(record[0].As<INode>().Properties)).ToList();

                        return records;
                    });

                    return new RepositoryReturn<IEnumerable<Person>>(returnedPeople);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<Person>>(true, e);
            }
        }

        public RepositoryReturn<Person> GetByGuid(Guid personGuid)
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

        public RepositoryReturn<Person> GetByEmail(string personEmail)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedPerson = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run($"MATCH (a:Person) WHERE a.email = '{personEmail}' RETURN a");

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

        public RepositoryReturn<bool> Add(Person personToAdd)
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
        
        private void CreatePersonNode(ITransaction tx, Person personToCreate)
        {
            tx.Run("CREATE(person:Person {" +
                   $"firstName: '{personToCreate.firstName}', " +
                   $"lastName: '{personToCreate.lastName}', " +
                   $"guid: '{personToCreate.Guid}', " +
                   "dateJoined: localdatetime({ timezone: 'Pacific/Auckland' }), " +
                   $"dateOfBirth: '{personToCreate.dateOfBirth}', " +
                   $"email: '{personToCreate.email}', " +
                   $"profileBio: '{personToCreate.profileBio}'," +
                   $"password: '{personToCreate.password}'" +
                   "})");
        }

        public RepositoryReturn<bool> Edit(Person personToOverwrite)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid personToDelete)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedPerson = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run($"MATCH (a:Person) WHERE a.guid = '{personToDelete}' DELETE a");

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

                    return new RepositoryReturn<bool>(true);
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
    }
}