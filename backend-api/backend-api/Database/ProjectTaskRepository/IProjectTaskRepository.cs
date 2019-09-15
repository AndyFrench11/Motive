using System;
using System.Collections;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.ProjectTaskRepository
{
    public interface IProjectTaskRepository
    {
//        RepositoryReturn<IEnumerable<Project>> GetAllForUser(Guid personGuid);
//
//        RepositoryReturn<Project> GetByGuid(Guid projectGuid);
        
        RepositoryReturn<bool> Add(ProjectTask projectTaskToAdd, Guid projectGuid);

        RepositoryReturn<bool> EditCompletionStatus(bool completed, Guid projectTaskGuid);

        RepositoryReturn<bool> Delete(Guid projectTaskGuid);
    }
}

