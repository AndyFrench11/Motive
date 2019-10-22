using System;
using System.Collections.Generic;
using backend_api.Database;
using backend_api.Features.TaskForum.Models;
using backend_api.Models;

namespace backend_api.Features.TaskForum.Repository
{
    public interface IChannelRepository
    {
        RepositoryReturn<Channel> Add(Channel channel, Guid taskGuid);
        
        RepositoryReturn<IEnumerable<Channel>> GetAllForTask(Guid taskGuid);

        RepositoryReturn<bool> Edit(Channel channel);
        
        RepositoryReturn<bool> Delete(Guid channelGuid);
        
        RepositoryReturn<bool> Exists(Guid channelGuid);
        
        RepositoryReturn<ProjectTask> GetTask(Guid channelGuid);
    }
}