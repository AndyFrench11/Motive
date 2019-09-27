using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Database;
using backend_api.Features.TaskForum.Models;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskForum.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ISession _session;

        public MessageRepository()
        {
            var neo4JConnection = new neo4jConnection();
            _session = neo4JConnection.driver.Session();
        }
        
        public RepositoryReturn<Message> Add(Message message, Guid authorGuid, Guid channelGuid)
        {
            try
            {
                using (_session)
                {
                    // Add channel node
                    var newMessage = _session.WriteTransaction(tx => CreateMessageNode(tx, message));
                    
                    // Add has relationship to channel
                    _session.WriteTransaction(tx => AddChannelRelationship(tx, message.Guid, channelGuid));
                    
                    // Add authored relationship
                    _session.WriteTransaction(tx => AddAuthorRelationship(tx, message.Guid, authorGuid));
                    
                    // Add the author to the comment return
                    var author = _session.ReadTransaction(tx => RetrieveMessageAuthor(tx, newMessage.Guid));
                    newMessage.Author = author;

                    return new RepositoryReturn<Message>(newMessage);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<Message>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<Message>(true, e);
            }
        }
        
        private Message CreateMessageNode(ITransaction tx, Message message)
        {
            var messageId = message.Guid.ToString();
            var text = message.Text;
            var sentDate = message.Sent;

            const string statement = "CREATE (message:Message {" + 
                                     "guid: $messageId, " + 
                                     "text: $text, " + 
                                     "sent: $sentDate" +
                                     "}) " + 
                                     "RETURN message";
            
            var result = tx.Run(statement, new {messageId, text, sentDate});
            var record = result.SingleOrDefault();
            return record == null ? null : new Message(record[0].As<INode>().Properties);
        }
        
        private void AddChannelRelationship(ITransaction tx, Guid messageGuid, Guid channelGuid)
        {
            var messageId = messageGuid.ToString();
            var channelId = channelGuid.ToString();

            const string statement = "MATCH (message:Message), (channel:Channel) " + 
                                     "WHERE message.guid = $messageId " + 
                                     "AND channel.guid = $channelId " + 
                                     "CREATE UNIQUE (channel)-[:HAS]->(message)";
            
            tx.Run(statement, new {messageId, channelId});
        }
        
        private void AddAuthorRelationship(ITransaction tx, Guid messageGuid, Guid authorGuid)
        {
            var messageId = messageGuid.ToString();
            var authorId = authorGuid.ToString();
            
            const string statement = "MATCH (message:Message), (author:Person) " + 
                                     "WHERE message.guid = $messageId " + 
                                     "AND author.guid = $authorId " + 
                                     "CREATE UNIQUE (author)-[:AUTHORS]->(message)";
            
            tx.Run(statement, new {messageId, authorId});
        }
        
        private Person RetrieveMessageAuthor(ITransaction tx, Guid messageGuid)
        {
            var messageId = messageGuid.ToString();

            const string statement = "MATCH (message:Message), (author:Person) " + 
                                     "WHERE message.guid = $messageId " + 
                                     "RETURN author";
            
            var result = tx.Run(statement, new {messageId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Person(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<IEnumerable<Message>> GetAllForChannel(Guid channelGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Edit(Message message)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid messageGuid)
        {
            throw new NotImplementedException();
        }
    }
}