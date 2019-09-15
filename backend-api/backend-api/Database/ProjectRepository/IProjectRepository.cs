using System;
using System.Collections;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.ProjectRepository
{
    public interface IProjectRepository
    {
        RepositoryReturn<IEnumerable<Project>> GetAllForUser(Guid personGuid);

        RepositoryReturn<Project> GetByGuid(Guid projectGuid);
        
        RepositoryReturn<bool> Add(Project projectToAdd, Guid userGuid);

        RepositoryReturn<bool> EditTaskOrder(List<ProjectTask> projectTaskList, Guid projectGuid);

        RepositoryReturn<bool> Delete(Guid projectGuid);

    }
}