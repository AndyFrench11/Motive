using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.ProjectUpdateRepository
{
    public interface IProjectUpdateRepository
    {
        RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForUser(Guid userGuid);
        
        RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForProject(Guid projectGuid);

        RepositoryReturn<ProjectUpdate> GetByGuid(Guid updateGuid);
        
        RepositoryReturn<bool> Add(ProjectUpdate projectUpdateToAdd, Guid projectGuid, Guid userGuid);

        RepositoryReturn<bool> Edit(Guid projectUpdateGuid);

        RepositoryReturn<bool> Delete(Guid projectUpdateGuid);
    }
}