using System;
using backend_api.Database;
using backend_api.Models;

namespace backend_api.Features.TaskAssignment.Repository
{
    public interface ITaskAssignmentRepository
    {
        RepositoryReturn<Person> GetForTask(Guid taskGuid);

        RepositoryReturn<bool> Edit(Guid taskGuid, Guid userGuid);
        
        RepositoryReturn<bool> Delete(Guid taskGuid);
    }
}