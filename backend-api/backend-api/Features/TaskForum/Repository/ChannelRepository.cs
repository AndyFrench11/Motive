﻿using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Database;
using backend_api.Features.TaskForum.Models;
using Neo4j.Driver.V1;

namespace backend_api.Features.TaskForum.Repository
{
    public class ChannelRepository: IChannelRepository
    {
        private readonly ISession _session;

        public ChannelRepository()
        {
            var neo4JConnection = new neo4jConnection();
            _session = neo4JConnection.driver.Session();
        }
        
        public RepositoryReturn<Channel> Add(Channel channel, Guid taskGuid)
        {
            try
            {
                using (_session)
                {
                    // Add channel node
                    var newChannel = _session.WriteTransaction(tx => CreateChannelNode(tx, channel));
                    
                    // Add has relationship to task
                    _session.WriteTransaction(tx => AddTaskRelationship(tx, channel.Guid, taskGuid));

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
                using (_session)
                {
                    // Get all channels
                    var foundChannels = _session.ReadTransaction(tx => RetrieveTaskChannels(tx, taskGuid));
                    
//                    // For each channel, get messages
//                    foreach (var channel in foundChannels)
//                    {
//                        // messageRepository.GetAllForChannel(channel.Guid);
//;
//                    }
                    
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
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid channelGuid)
        {
            throw new NotImplementedException();
        }
    }
}