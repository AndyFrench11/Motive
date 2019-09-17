using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Database.ProjectUpdateRepository
{
    public class ProjectUpdateRepository : IProjectUpdateRepository
    {
        
        private readonly neo4jConnection _neo4jConnection;

        public ProjectUpdateRepository()
        {
            _neo4jConnection = new neo4jConnection();
        }
        
        
        public RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForUser(Guid userGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForProject(Guid projectGuid)
        {
            try
            {   
                using (var session = _neo4jConnection.driver.Session())
                {
                    var returnedUpdates = session.ReadTransaction(tx => RetrieveUpdatesForSingleProject(tx, projectGuid));
                    foreach (ProjectUpdate update in returnedUpdates)
                    {
                        var returnedProjectTask = session.ReadTransaction(tx => RetrieveProjectTaskForGivenUpdate(tx, update.Guid));
                        if (returnedProjectTask != null)
                        {
                            update.relatedTask = returnedProjectTask;
                        }
                        var returnedPerson = session.ReadTransaction(tx => RetrievePersonForGivenUpdate(tx, update.Guid));
                        update.relatedPerson = returnedPerson;
                    }
                    return new RepositoryReturn<IEnumerable<ProjectUpdate>>(returnedUpdates);
                }

            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<ProjectUpdate>>(true, e);
            }
        }

        private List<ProjectUpdate> RetrieveUpdatesForSingleProject(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (pu:ProjectUpdate) -- (p:Project) WHERE p.guid = $projectId RETURN pu", new { projectId });
            var records = result.Select(record => new ProjectUpdate(record[0].As<INode>().Properties)).ToList();
            return records;
        }

        private ProjectTask RetrieveProjectTaskForGivenUpdate(ITransaction tx, Guid updateGuid)
        {
            var updateId = updateGuid.ToString();
            var result = tx.Run("MATCH (pu:ProjectUpdate) -- (pt:ProjectTask) WHERE pu.guid = $updateId RETURN pt",
                new {updateId});

            var record = result.SingleOrDefault();
            if (record == null)
            {
                return null;
            }
            else
            {
                return new ProjectTask(record[0].As<INode>().Properties);
            }
        }
        
        private Person RetrievePersonForGivenUpdate(ITransaction tx, Guid updateGuid)
        {
            var updateId = updateGuid.ToString();
            var result = tx.Run("MATCH (pu:ProjectUpdate) -- (pe:Person) WHERE pu.guid = $updateId RETURN pe",
                new {updateId});

            var record = result.SingleOrDefault();
            if (record == null)
            {
                return null;
            }
            else
            {
                return new Person(record[0].As<INode>().Properties);
            }
        }

        public RepositoryReturn<ProjectUpdate> GetByGuid(Guid updateGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Add(ProjectUpdate projectUpdateToAdd, Guid projectGuid, Guid userGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateProjectUpdateNode(tx, projectUpdateToAdd));
                    session.WriteTransaction(tx => CreateProjectUpdateToProjectRelationship(tx, projectUpdateToAdd.Guid, projectGuid));
                    session.WriteTransaction(tx => CreateProjectUpdateToUserRelationship(tx, projectUpdateToAdd.Guid, userGuid));
                    //TODO Do a check to see if project update has a task related to it or if it has any tags
                    string projectUpdateId = projectUpdateToAdd.taskGuid.ToString();
                    if (projectUpdateId != "00000000-0000-0000-0000-000000000000")
                    {
                        session.WriteTransaction(tx => CreateProjectUpdateToTaskRelationship(tx, projectUpdateToAdd.Guid, projectUpdateToAdd.taskGuid));      
                    }
                    //session.WriteTransaction(tx => CreateProjectUpdateToTagRelationship(tx, projectUpdateToAdd.Guid, userGuid));
                    
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void CreateProjectUpdateNode(ITransaction tx, ProjectUpdate projectUpdate)
        {
            string projectUpdateContent = projectUpdate.content;
            string projectUpdateId = projectUpdate.Guid.ToString();
            tx.Run("CREATE(pu:ProjectUpdate {content: $projectUpdateContent, guid: $projectUpdateId})", 
                new { projectUpdateContent, projectUpdateId });
        }

        private void CreateProjectUpdateToProjectRelationship(ITransaction tx, Guid projectUpdateGuid, Guid projectGuid)
        {
            //Create the relationship to the project
            string projectUpdateId = projectUpdateGuid.ToString();
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (pu:ProjectUpdate),(p:Project) WHERE pu.guid = $projectUpdateId AND p.guid = $projectId CREATE (p)-[:HAS]->(pu)", 
                new { projectUpdateId, projectId });
        }

        private void CreateProjectUpdateToUserRelationship(ITransaction tx, Guid projectUpdateGuid, Guid userGuid)
        {
            //Create the relationship to the person
            string projectUpdateId = projectUpdateGuid.ToString();
            string personId = userGuid.ToString();
            tx.Run("MATCH (pu:ProjectUpdate),(pe:Person) WHERE pu.guid = $projectUpdateId AND pe.guid = $personId CREATE (pe)-[:AUTHORED]->(pu)", 
                new { projectUpdateId, personId });
        }

        private void CreateProjectUpdateToTaskRelationship(ITransaction tx, Guid projectUpdateGuid, Guid taskGuid)
        {
            string projectUpdateId = projectUpdateGuid.ToString();
            string taskId = taskGuid.ToString();
            tx.Run("MATCH (pu:ProjectUpdate),(pt:ProjectTask) WHERE pu.guid = $projectUpdateId AND pt.guid = $taskId CREATE (pu)-[:RELATES_TO]->(pt)", 
                new { projectUpdateId, taskId });
        }

        public RepositoryReturn<bool> Edit(Guid projectUpdateGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid projectUpdateGuid)
        {
            throw new NotImplementedException();
        }
    }
}