using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.ProjectUpdateRepository
{
    public class ProjectUpdateRepository : IProjectUpdateRepository
    {
        public RepositoryReturn<IEnumerable<Project>> GetAllForUser(Guid userGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<IEnumerable<Project>> GetAllForProject(Guid projectGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<Project> GetByGuid(Guid updateGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Add(ProjectUpdate projectUpdateToAdd, Guid projectGuid, Guid userGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Edit(Guid projectUpdateGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid projectUpdateGuid)
        {
            throw new NotImplementedException();
        }
    }
}