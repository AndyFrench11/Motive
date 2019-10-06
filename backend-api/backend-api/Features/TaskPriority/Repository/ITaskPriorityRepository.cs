using System;
using backend_api.Database;

namespace backend_api.Features.TaskPriority.Repository
{
    public interface ITaskPriorityRepository
    {
        RepositoryReturn<string> GetForTask(Guid taskGuid);

        RepositoryReturn<bool> Edit(Guid taskGuid, string priority);
        
        RepositoryReturn<bool> Delete(Guid taskGuid);
    }
}