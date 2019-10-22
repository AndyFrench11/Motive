using System;
using System.Collections.Generic;
using backend_api.Database;
using backend_api.Features.TaskForum.Models;

namespace backend_api.Features.TaskForum.Repository
{
    public interface IMessageRepository
    {
        RepositoryReturn<Message> Add(Message message, Guid authorGuid, Guid channelGuid);
        
        RepositoryReturn<IEnumerable<Message>> GetAllForChannel(Guid channelGuid);

        RepositoryReturn<bool> Edit(Message message);
        
        RepositoryReturn<bool> Delete(Guid messageGuid);
        
        RepositoryReturn<bool> Exists(Guid messageGuid);
        
        RepositoryReturn<Channel> GetChannel(Guid messageGuid);
    }
}