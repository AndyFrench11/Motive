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
        private readonly neo4jConnection _neo4JConnection;

        public MessageRepository()
        {
            _neo4JConnection = new neo4jConnection();
        }

        public RepositoryReturn<Message> Add(Message message, Guid authorGuid, Guid channelGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Add channel node
                    var newMessage = session.WriteTransaction(tx => CreateMessageNode(tx, message));

                    // Add has relationship to channel
                    session.WriteTransaction(tx => AddChannelRelationship(tx, message.Guid, channelGuid));

                    // Add authored relationship
                    session.WriteTransaction(tx => AddAuthorRelationship(tx, message.Guid, authorGuid));

                    // Add the author to the comment return
                    var author = session.ReadTransaction(tx => RetrieveMessageAuthor(tx, newMessage.Guid));
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
                                     "AND (author)-[:AUTHORS]-(message)" +
                                     "RETURN author";

            var result = tx.Run(statement, new {messageId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Person(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<IEnumerable<Message>> GetAllForChannel(Guid channelGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Get all messages
                    var foundMessages = session.ReadTransaction(tx => RetrieveChannelMessages(tx, channelGuid));

                    // For each message, find and add the author
                    foreach (var message in foundMessages)
                    {
                        var author = session.ReadTransaction(tx => RetrieveMessageAuthor(tx, message.Guid));
                        message.Author = author;
                    }

                    return new RepositoryReturn<IEnumerable<Message>>(foundMessages);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<IEnumerable<Message>>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<IEnumerable<Message>>(true, e);
            }
        }

        private List<Message> RetrieveChannelMessages(ITransaction tx, Guid channelGuid)
        {
            var channelId = channelGuid.ToString();

            const string statement = "MATCH (channel:Channel) -- (message:Message) " +
                                     "WHERE channel.guid = $channelId " +
                                     "RETURN message " +
                                     "ORDER BY message.sent";

            var result = tx.Run(statement, new {channelId});
            var comments = result.Select(record => new Message(record[0].As<INode>().Properties)).ToList();
            return comments;
        }

        public RepositoryReturn<bool> Edit(Message message)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Update message node
                    session.WriteTransaction(tx => UpdateMessageNode(tx, message));

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

        private void UpdateMessageNode(ITransaction tx, Message message)
        {
            var messageId = message.Guid.ToString();
            var text = message.Text;

            const string statement = "MATCH (message:Message) " +
                                     "WHERE message.guid = $messageId " +
                                     "SET message.text = $text ";

            tx.Run(statement, new {messageId, text});
        }

        public RepositoryReturn<bool> Delete(Guid messageGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Delete message node
                    session.WriteTransaction(tx => RemoveMessageNode(tx, messageGuid));

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

        private void RemoveMessageNode(ITransaction tx, Guid messageGuid)
        {
            var messageId = messageGuid.ToString();

            const string statement = "MATCH (message:Message) " +
                                     "WHERE message.guid = $messageId " +
                                     "DETACH DELETE message";

            tx.Run(statement, new {messageId});
        }


        public RepositoryReturn<bool> DeleteAll(Guid channelGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Delete all message nodes
                    session.WriteTransaction(tx => RemoveAllMessageNodes(tx, channelGuid));

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

        private void RemoveAllMessageNodes(ITransaction tx, Guid channelGuid)
        {
            var channelId = channelGuid.ToString();

            const string statement = "MATCH (message:Message), (channel:Channel) " +
                                     "WHERE channel.guid = $channelId " +
                                     "AND (channel)--(message) " +
                                     "DETACH DELETE message";

            tx.Run(statement, new {channelId});
        }

        public RepositoryReturn<bool> Exists(Guid messageGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Find single message
                    var foundMessage = session.ReadTransaction(tx => RetrieveMessage(tx, messageGuid));
                    return foundMessage != null ? new RepositoryReturn<bool>(true) : new RepositoryReturn<bool>(false);
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
        
        private Message RetrieveMessage(ITransaction tx, Guid messageGuid)
        {
            var messageId = messageGuid.ToString();

            const string statement = "MATCH (message:Message) " + 
                                     "WHERE message.guid = $messageId " + 
                                     "RETURN message";
            var result = tx.Run(statement, new {messageId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Message(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<Channel> GetChannel(Guid messageGuid)
        {
            try
            {
                using (var session = _neo4JConnection.driver.Session())
                {
                    // Find the channel that has the given message
                    var channel = session.ReadTransaction(tx => RetrieveChannelFromMessage(tx, messageGuid));
                    return new RepositoryReturn<Channel>(channel);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<Channel>(true, e);
            }
        }
        
        private Channel RetrieveChannelFromMessage(ITransaction tx, Guid messageGuid)
        {
            var messageId = messageGuid.ToString();

            const string statement = "MATCH (channel:Channel)-[has:HAS]-(message:Message) " +
                                     "WHERE message.guid = $messageId " +
                                     "RETURN channel";
            var result = tx.Run(statement, new {messageId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Channel(record[0].As<INode>().Properties);
        }
    }
}