using System;
using backend_api.Database;

namespace backend_api.Features.TaskStatus.Repository
{
    public interface ITaskStatusRepository
    {
        RepositoryReturn<bool> Add(Guid taskGuid, string status);
        
        RepositoryReturn<string> GetForTask(Guid taskGuid);

        RepositoryReturn<bool> Edit(Guid taskGuid, string status);
        
        RepositoryReturn<bool> Delete(Guid taskGuid);
    }
}