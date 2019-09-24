using System;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Database.CommentRepository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ISession _session;

        public CommentRepository()
        {
            var neo4JConnection = new neo4jConnection();
            _session = neo4JConnection.driver.Session();
        }
        
        public RepositoryReturn<bool> Add(Comment comment, Guid authorGuid, Guid taskGuid)
        {
            try
            {
                using (_session)
                {
                    // Add comment node
                    _session.WriteTransaction(tx => CreateCommentNode(tx, comment));
                    
                    // Add has relationship to task
                    _session.WriteTransaction(tx => AddTaskRelationship(tx, comment.Guid, taskGuid));
                    
                    // Add authored relationship
                    _session.WriteTransaction(tx => AddAuthorRelationship(tx, comment.Guid, authorGuid));
                    
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

        private void CreateCommentNode(ITransaction tx, Comment comment)
        {
            var messageString = comment.Message;
            var commentId = comment.Guid.ToString();

            const string statement = "CREATE (comment:Comment {" + 
                                     "message: $messageString " + 
                                     "guid: $commentId" + 
                                     "})";
            tx.Run(statement, new {messageString, commentId});

        }

        private void AddTaskRelationship(ITransaction tx, Guid commentGuid, Guid taskGuid)
        {
            var commentId = commentGuid.ToString();
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (comment:Comment), (task:ProjectTask) " + 
                                     "WHERE comment.guid = $commentId " + 
                                     "AND task.guid = $taskId " + 
                                     "CREATE UNIQUE (task)-[:HAS]->(comment)";
            tx.Run(statement, new {commentId, taskId});
            
        }

        private void AddAuthorRelationship(ITransaction tx, Guid commentGuid, Guid authorGuid)
        {
            var commentId = commentGuid.ToString();
            var authorId = authorGuid.ToString();
            
            const string statement = "MATCH (comment:Comment), (author:Person) " + 
                                     "WHERE comment.guid = $commentId " + 
                                     "AND author.guid = $authorId " + 
                                     "CREATE UNIQUE (author)-[:AUTHORS]->(comment)";
            tx.Run(statement, new {commentId, authorId});
        }
        
        public RepositoryReturn<bool> GetAllForTask(Guid taskGuid)
        {
            //TODO: Get all comments
            return new RepositoryReturn<bool>(true);
        }
        
        public RepositoryReturn<bool> GetOne(Guid commentGuid)
        {
            //TODO: get one comment
            return new RepositoryReturn<bool>(true);
        }
        
        public RepositoryReturn<bool> Edit(Comment comment)
        {
            try
            {
                using (_session)
                {
                    // Update comment node
                    _session.WriteTransaction(tx => UpdateCommentNode(tx, comment));

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
        
        private void UpdateCommentNode(ITransaction tx, Comment comment)
        {
            var messageString = comment.Message;
            var commentId = comment.Guid.ToString();

            const string statement = "MATCH (comment:Comment) " +
                                     "WHERE comment.guid = $commentId " +
                                     "SET comment.message = $messageString ";
            
            tx.Run(statement, new {messageString, commentId});

        }
        
        public RepositoryReturn<bool> Delete(Guid commentGuid)
        {
            //TODO: Delete comment
            return new RepositoryReturn<bool>(true);
        }
    }
}