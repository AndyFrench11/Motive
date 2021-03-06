﻿using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Database;
using backend_api.Features.Comments.Models;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Features.Comments.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly neo4jConnection _neo4JConnection;

        public CommentRepository()
        {
            _neo4JConnection = new neo4jConnection();
        }

        public RepositoryReturn<Comment> Add(Comment comment, Guid authorGuid, Guid updateGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Add comment node
                    var newComment = session.WriteTransaction(tx => CreateCommentNode(tx, comment));
                    
                    // Add has relationship to task
                    session.WriteTransaction(tx => AddUpdateRelationship(tx, comment.Guid, updateGuid));
                    
                    // Add authored relationship
                    session.WriteTransaction(tx => AddAuthorRelationship(tx, comment.Guid, authorGuid));
                    
                    // Add the author to the comment return
                    var author = session.ReadTransaction(tx => RetrieveCommentAuthor(tx, newComment.Guid));
                    newComment.Author = author;
                    
                    return new RepositoryReturn<Comment>(newComment);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<Comment>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<Comment>(true, e);
            }
        }

        private Comment CreateCommentNode(ITransaction tx, Comment comment)
        {
            var commentId = comment.Guid.ToString();
            var messageString = comment.Message;
            var authoredDate = comment.Authored;

            const string statement = "CREATE (comment:Comment {" + 
                                     "guid: $commentId, " + 
                                     "message: $messageString, " + 
                                     "authored: $authoredDate" +
                                     "}) " + 
                                     "RETURN comment";
            
            var result = tx.Run(statement, new {messageString, commentId, authoredDate});
            var record = result.SingleOrDefault();
            return record == null ? null : new Comment(record[0].As<INode>().Properties);
        }

        private void AddUpdateRelationship(ITransaction tx, Guid commentGuid, Guid updateGuid)
        {
            var commentId = commentGuid.ToString();
            var updateId = updateGuid.ToString();

            const string statement = "MATCH (comment:Comment), (update:ProjectUpdate) " + 
                                     "WHERE comment.guid = $commentId " + 
                                     "AND update.guid = $updateId " + 
                                     "CREATE UNIQUE (update)-[:HAS]->(comment)";
            tx.Run(statement, new {commentId, updateId});
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

        public RepositoryReturn<IEnumerable<Comment>> GetAllForUpdate(Guid updateGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Get all comments
                    var foundComments = session.ReadTransaction(tx => RetrieveUpdateComments(tx, updateGuid));
                    
                    // For each comment, find and add the author
                    foreach (var comment in foundComments)
                    {
                        var author = session.ReadTransaction(tx => RetrieveCommentAuthor(tx, comment.Guid));
                        comment.Author = author;
                    }
                    
                    return new RepositoryReturn<IEnumerable<Comment>>(foundComments);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<IEnumerable<Comment>>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<IEnumerable<Comment>>(true, e);
            }
        }

        private List<Comment> RetrieveUpdateComments(ITransaction tx, Guid updateGuid)
        {
            var updateId = updateGuid.ToString();

            const string statement = "MATCH (update:ProjectUpdate) -- (comment:Comment) " + 
                                     "WHERE update.guid = $updateId " +
                                     "RETURN comment " + 
                                     "ORDER BY comment.authored";
            var result = tx.Run(statement, new {updateId});
            var comments = result.Select(record => new Comment(record[0].As<INode>().Properties)).ToList();
            return comments;
        }

        private Person RetrieveCommentAuthor(ITransaction tx, Guid commentGuid)
        {
            var commentId = commentGuid.ToString();

            const string statement = "MATCH (comment:Comment), (author:Person) " + 
                                     "WHERE comment.guid = $commentId " + 
                                     "AND (author)-[:AUTHORS]-(comment) " +
                                     "RETURN author";
            var result = tx.Run(statement, new {commentId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Person(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<bool> Edit(Comment comment)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Update comment node
                    session.WriteTransaction(tx => UpdateCommentNode(tx, comment));

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
            var commentId = comment.Guid.ToString();
            var messageString = comment.Message;
            
            const string statement = "MATCH (comment:Comment) " +
                                     "WHERE comment.guid = $commentId " +
                                     "SET comment.message = $messageString ";
            
            tx.Run(statement, new {messageString, commentId});
        }
        
        public RepositoryReturn<bool> Delete(Guid commentGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Delete comment node
                    session.WriteTransaction(tx => RemoveCommentNode(tx, commentGuid));

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

        private void RemoveCommentNode(ITransaction tx, Guid commentGuid)
        {
            var commentId = commentGuid.ToString();
            
            const string statement = "MATCH (comment:Comment) " + 
                                     "WHERE comment.guid = $commentId " + 
                                     "DETACH DELETE comment";
            
            tx.Run(statement, new {commentId});
        }
        
        public RepositoryReturn<bool> DeleteAll(Guid updateGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Delete all comment nodes for update
                    session.WriteTransaction(tx => RemoveAllCommentNodes(tx, updateGuid));

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
        
        private void RemoveAllCommentNodes(ITransaction tx, Guid updateGuid)
        {
            var updateId = updateGuid.ToString();
            
            const string statement = "MATCH (comment:Comment), (update:ProjectUpdate) " + 
                                     "WHERE update.guid = $updateId " + 
                                     "AND (update)--(comment) " +
                                     "DETACH DELETE comment";
            
            tx.Run(statement, new {updateId});
        }
        
        public RepositoryReturn<bool> Exists(Guid commentGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Find single comment
                    var foundComment = session.ReadTransaction(tx => RetrieveComment(tx, commentGuid));
                    return foundComment != null ? new RepositoryReturn<bool>(true) : new RepositoryReturn<bool>(false);
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
        
        private Comment RetrieveComment(ITransaction tx, Guid commentGuid)
        {
            var commentId = commentGuid.ToString();

            const string statement = "MATCH (comment:Comment) " + 
                                     "WHERE comment.guid = $commentId " + 
                                     "RETURN comment";
            var result = tx.Run(statement, new {commentId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Comment(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<bool> IsAuthor(Guid authorGuid, Guid commentGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Check author
                    var author = session.ReadTransaction(tx => RetrieveCommentAuthor(tx, commentGuid));
                    return author.Guid == authorGuid ? new RepositoryReturn<bool>(true) : new RepositoryReturn<bool>(false);
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