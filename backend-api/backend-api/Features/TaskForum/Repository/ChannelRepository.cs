using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Database;
using backend_api.Features.TaskForum.Models;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskForum.Repository
{
    public class ChannelRepository: IChannelRepository
    {
        private readonly neo4jConnection _neo4jConnection;

        public ChannelRepository()
        {
            _neo4jConnection = new neo4jConnection();
        }
        
        public RepositoryReturn<Channel> Add(Channel channel, Guid taskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Add channel node
                    var newChannel = session.WriteTransaction(tx => CreateChannelNode(tx, channel));
                    
                    // Add has relationship to task
                    session.WriteTransaction(tx => AddTaskRelationship(tx, channel.Guid, taskGuid));

                    return new RepositoryReturn<Channel>(newChannel);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<Channel>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<Channel>(true, e);
            }
        }

        private Channel CreateChannelNode(ITransaction tx, Channel channel)
        {
            var channelId = channel.Guid.ToString();
            var name = channel.Name;
            var createdDate = channel.Created;

            const string statement = "CREATE (channel:Channel {" + 
                                     "guid: $channelId, " + 
                                     "name: $name, " + 
                                     "created: $createdDate" +
                                     "}) " + 
                                     "RETURN channel";
            
            var result = tx.Run(statement, new {channelId, name, createdDate});
            var record = result.SingleOrDefault();
            return record == null ? null : new Channel(record[0].As<INode>().Properties);
        }
        
        private void AddTaskRelationship(ITransaction tx, Guid channelGuid, Guid taskGuid)
        {
            var channelId = channelGuid.ToString();
            var taskId = taskGuid.ToString();

            const string statement = "MATCH (channel:Channel), (task:ProjectTask) " + 
                                     "WHERE channel.guid = $channelId " + 
                                     "AND task.guid = $taskId " + 
                                     "CREATE UNIQUE (task)-[:HAS]->(channel)";
            
            tx.Run(statement, new {channelId, taskId});
        }

        public RepositoryReturn<IEnumerable<Channel>> GetAllForTask(Guid taskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Get all channels
                    var foundChannels = session.ReadTransaction(tx => RetrieveTaskChannels(tx, taskGuid));
                    
                    return new RepositoryReturn<IEnumerable<Channel>>(foundChannels);
                }
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<IEnumerable<Channel>>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<IEnumerable<Channel>>(true, e);
            }
        }
        
        private List<Channel> RetrieveTaskChannels(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();

            const string statement = "MATCH (task:ProjectTask) -- (channel:Channel) " + 
                                     "WHERE task.guid = $taskId " +
                                     "RETURN channel " + 
                                     "ORDER BY channel.name";
            
            var result = tx.Run(statement, new {taskId});
            var channels = result.Select(record => new Channel(record[0].As<INode>().Properties)).ToList();
            return channels;
        }

        public RepositoryReturn<bool> Edit(Channel channel)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Update comment node
                    session.WriteTransaction(tx => UpdateChannelNode(tx, channel));

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
        
        private void UpdateChannelNode(ITransaction tx, Channel channel)
        {
            var channelId = channel.Guid.ToString();
            var name = channel.Name;
            
            const string statement = "MATCH (channel:Channel) " +
                                     "WHERE channel.guid = $channelId " +
                                     "SET channel.name = $name ";
            
            tx.Run(statement, new {channelId, name});
        }

        public RepositoryReturn<bool> Delete(Guid channelGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Delete all messages for the channel first
                    var messageRepository = new MessageRepository();
                    var result = messageRepository.DeleteAll(channelGuid);
                    
                    if (result.IsError)
                    {
                        return result;
                    }
                    
                    // Delete channel node
                    session.WriteTransaction(tx => RemoveChannelNode(tx, channelGuid));
                    
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
        
        private void RemoveChannelNode(ITransaction tx, Guid channelGuid)
        {
            var channelId = channelGuid.ToString();
            
            const string statement = "MATCH (channel:Channel) " + 
                                     "WHERE channel.guid = $channelId " + 
                                     "DETACH DELETE channel";
            
            tx.Run(statement, new {channelId});
        }
        
        public RepositoryReturn<bool> DeleteAll(Guid taskGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Delete channel nodes
                    session.WriteTransaction(tx => RemoveAllChannelNodesWithMessages(tx, taskGuid));
                    session.WriteTransaction(tx => RemoveAllChannelNodesWithoutMessages(tx, taskGuid));
                    
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
        
        private void RemoveAllChannelNodesWithMessages(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (channel:Channel), (task:ProjectTask), (message:Message) " + 
                                     "WHERE task.guid = $taskId " + 
                                     "AND (task)--(channel) " + 
                                     "AND (channel)--(message) " +
                                     "DETACH DELETE channel, message";
            
            tx.Run(statement, new {taskId});
        }
        
        private void RemoveAllChannelNodesWithoutMessages(ITransaction tx, Guid taskGuid)
        {
            var taskId = taskGuid.ToString();
            
            const string statement = "MATCH (channel:Channel), (task:ProjectTask)" + 
                                     "WHERE task.guid = $taskId " + 
                                     "AND (task)--(channel) " +
                                     "DETACH DELETE channel";
            
            tx.Run(statement, new {taskId});
        }

        public RepositoryReturn<bool> Exists(Guid channelGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Find single channel
                    var foundChannel = session.ReadTransaction(tx => RetrieveChannel(tx, channelGuid));
                    return foundChannel != null ? new RepositoryReturn<bool>(true) : new RepositoryReturn<bool>(false);
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
        
        private Channel RetrieveChannel(ITransaction tx, Guid channelGuid)
        {
            var channelId = channelGuid.ToString();

            const string statement = "MATCH (channel:Channel) " + 
                                     "WHERE channel.guid = $channelId " + 
                                     "RETURN channel";
            var result = tx.Run(statement, new {channelId});
            var record = result.SingleOrDefault();
            return record == null ? null : new Channel(record[0].As<INode>().Properties);
        }

        public RepositoryReturn<ProjectTask> GetTask(Guid channelGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    // Find task that has channel
                    var task = session.ReadTransaction(tx => RetrieveTaskFromChannel(tx, channelGuid));
                    return new RepositoryReturn<ProjectTask>(task);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<ProjectTask>(true, e);
            }
        }
        
        private ProjectTask RetrieveTaskFromChannel(ITransaction tx, Guid channelGuid)
        {
            var channelId = channelGuid.ToString();

            const string statement = "MATCH (task:ProjectTask)-[has:HAS]-(channel:Channel) " +
                                     "WHERE channel.guid = $channelId " +
                                     "RETURN task";
            var result = tx.Run(statement, new {channelId});
            var record = result.SingleOrDefault();
            return record == null ? null : new ProjectTask(record[0].As<INode>().Properties);
        }

    }
}