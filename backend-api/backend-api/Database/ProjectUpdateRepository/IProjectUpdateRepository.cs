using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.ProjectUpdateRepository
{
    public interface IProjectUpdateRepository
    {
        RepositoryReturn<IEnumerable<Project>> GetAllForUser(Guid userGuid);
        
        RepositoryReturn<IEnumerable<Project>> GetAllForProject(Guid projectGuid);

        RepositoryReturn<Project> GetByGuid(Guid updateGuid);
        
        RepositoryReturn<bool> Add(ProjectUpdate projectUpdateToAdd, Guid projectGuid, Guid userGuid);

        RepositoryReturn<bool> Edit(Guid projectUpdateGuid);

        RepositoryReturn<bool> Delete(Guid projectUpdateGuid);
    }
}