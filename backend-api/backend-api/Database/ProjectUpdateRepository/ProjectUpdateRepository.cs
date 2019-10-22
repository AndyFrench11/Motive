using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Database.MediaRepository;
using backend_api.Features.Comments.Repository;
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


        
        public RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForPerson(Guid personGuid)
        {
            try
            {   
                using (var session = _neo4jConnection.driver.Session())
                {
                    var returnedUpdates = session.ReadTransaction(tx => RetrieveUpdatesAssociatedToPerson(tx, personGuid));
                    
                    foreach (ProjectUpdate update in returnedUpdates)
                    {
                        //Retrieve the project task associated to the update
                        var returnedProjectTask = session.ReadTransaction(tx => RetrieveProjectTaskForGivenUpdate(tx, update.Guid));
                        if (returnedProjectTask != null)
                        {
                            update.relatedTask = returnedProjectTask;
                        }
                        
                        //Retrieve the person associated to the update
                        var returnedPerson = session.ReadTransaction(tx => RetrievePersonForGivenUpdate(tx, update.Guid));
                        update.relatedPerson = returnedPerson;
                        
                        //Retrieve the project associated to the update
                        Project returnedProject =
                            session.ReadTransaction(tx => RetrieveProjectForGivenUpdate(tx, update.Guid));
                        update.relatedProject = returnedProject;

                        //Retrieve the tags associated to the project
                        var associatedTags =
                            session.ReadTransaction(tx => RetrieveProjectTags(tx, returnedProject.Guid));
                        update.relatedProject.tagList = associatedTags.ToList();
                        
                        //Retrieve all comments for the update
                        ICommentRepository commentRepository = new CommentRepository();
                        var comments = 
                            session.ReadTransaction(tx => commentRepository.GetAllForUpdate(update.Guid));
                        update.comments = comments.ReturnValue.ToList();
                        
                        IMediaRepository mediaRepository = new MediaRepository.MediaRepository();
                        Tuple<MediaTracker, MediaType> relatedMedia = mediaRepository.GetByProjectGuid(update.Guid).ReturnValue;
                        
                        if (relatedMedia.Item2 == MediaType.Image)
                        {
                            update.imageGuid = relatedMedia.Item1.Guid;
                        } else if (relatedMedia.Item2 == MediaType.Video)
                        {
                            update.videoGuid = relatedMedia.Item1.Guid;
                        }

                        update.relatedProjectGuid = returnedProject.Guid;
                    }
                    return new RepositoryReturn<IEnumerable<ProjectUpdate>>(returnedUpdates);
                }

            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<ProjectUpdate>>(true, e);
            }
        }
        
        private Project RetrieveProjectForGivenUpdate(ITransaction tx, Guid updateGuid)
        {
            var updateId = updateGuid.ToString();
            var result = tx.Run("MATCH (p:Project) -- (pu:ProjectUpdate) WHERE pu.guid = $updateId RETURN p", new { updateId });

            var record = result.SingleOrDefault();
            if (record == null)
            {
                return null;
            }
            return new Project(record[0].As<INode>().Properties);
            
        }
        
        private List<ProjectUpdate> RetrieveUpdatesAssociatedToPerson(ITransaction tx, Guid personGuid)
        {
            var personId = personGuid.ToString();
            var result = tx.Run("MATCH (pe:Person) -- (p:Project) -- (pu:ProjectUpdate) WHERE pe.guid = $personId RETURN pu", new { personId });
            var records = result.Select(record => new ProjectUpdate(record[0].As<INode>().Properties)).ToList();
            return records;
        }
        
        private List<Tag> RetrieveProjectTags(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (project:Project) -- (tag:Tag) WHERE project.guid = $projectId RETURN tag", new { projectId });

            var records = result.Select(record => new Tag(record[0].As<INode>().Properties)).ToList();

            return records;
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
                        
                        //Retrieve all comments for the update
                        ICommentRepository commentRepository = new CommentRepository();
                        var comments = 
                            session.ReadTransaction(tx => commentRepository.GetAllForUpdate(update.Guid));
                        update.comments = comments.ReturnValue.ToList();
                        
                        IMediaRepository mediaRepository = new MediaRepository.MediaRepository();
                        Tuple<MediaTracker, MediaType> relatedMedia = mediaRepository.GetByProjectGuid(update.Guid).ReturnValue;
                        
                        if (relatedMedia.Item2 == MediaType.Image)
                        {
                            update.imageGuid = relatedMedia.Item1.Guid;
                        } else if (relatedMedia.Item2 == MediaType.Video)
                        {
                            update.videoGuid = relatedMedia.Item1.Guid;
                        }

                        update.relatedProjectGuid = projectGuid;
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
            
            //Works for non sub project
//            var query = "MATCH (pu:ProjectUpdate),(parent:Project),(child:Project) " +
//                        "WHERE (pu) -- (parent) OR (pu) -- (child) -[:IS_SUBPROJECT_OF]-> (parent) " +
//                        "AND parent.guid = $projectId " +
//                        "RETURN DISTINCT pu";

            var query = "MATCH (pu:ProjectUpdate) -- (parent:Project) " +
                        "WHERE parent.guid = $projectId RETURN pu";
            var result = tx.Run(query, new { projectId });
            var records = result.Select(record => new ProjectUpdate(record[0].As<INode>().Properties)).ToList();
            //records = records.Distinct().ToList();
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
            bool highlight = projectUpdate.highlight;
            string projectUpdateCreatedDateTime = projectUpdate.dateTimeCreated;
            tx.Run("CREATE(pu:ProjectUpdate {content: $projectUpdateContent, highlight: $highlight, dateTimeCreated: $projectUpdateCreatedDateTime, guid: $projectUpdateId})", 
                new { projectUpdateContent, highlight, projectUpdateCreatedDateTime, projectUpdateId });
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

        public RepositoryReturn<bool> EditContent(Guid projectUpdateGuid, string content)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => UpdateProjectUpdateNodeContent(tx, projectUpdateGuid, content));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }


        private void UpdateProjectUpdateNodeContent(ITransaction tx, Guid projectUpdateGuid, string content)
        {
            string updateId = projectUpdateGuid.ToString();
            tx.Run("MATCH (pu:ProjectUpdate) WHERE pu.guid = $updateId SET pu.content = $content", 
                new { updateId, content});
        }
        
        public RepositoryReturn<bool> EditHighlightStatus(Guid projectUpdateGuid, bool highlightStatus)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => UpdateProjectUpdateNodeHighlightStatus(tx, projectUpdateGuid, highlightStatus));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void UpdateProjectUpdateNodeHighlightStatus(ITransaction tx, Guid projectUpdateGuid, bool highlightStatus)
        {
            string updateId = projectUpdateGuid.ToString();
            tx.Run("MATCH (pu:ProjectUpdate) WHERE pu.guid = $updateId SET pu.highlight = $highlightStatus", 
                new { updateId, highlightStatus});
            
        }

        public RepositoryReturn<bool> EditAssociatedTask(Guid projectUpdateGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid projectUpdateGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Delete update comments first
                    var commentRepository = new CommentRepository();
                    var result = commentRepository.DeleteAll(projectUpdateGuid);

                    if (result.IsError)
                    {
                        return result;
                    }
                    
                    session.WriteTransaction(tx => RemoveProjectUpdateNode(tx, projectUpdateGuid));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void RemoveProjectUpdateNode(ITransaction tx, Guid updateGuid)
        {
            string updateId = updateGuid.ToString();
            tx.Run("MATCH (pu:ProjectUpdate) WHERE pu.guid = $updateId DETACH DELETE pu", new { updateId });
        }
    }
}