using System;
using System.Collections.Generic;
using backend_api.Database;
using backend_api.Features.TaskForum.Models;

namespace backend_api.Features.TaskForum.Repository
{
    public interface IChannelRepository
    {
        RepositoryReturn<Channel> Add(Channel channel, Guid taskGuid);
        
        RepositoryReturn<IEnumerable<Channel>> GetAllForTask(Guid taskGuid);

        RepositoryReturn<bool> Edit(Channel channel);
        
        RepositoryReturn<bool> Delete(Guid channelGuid);
    }
}