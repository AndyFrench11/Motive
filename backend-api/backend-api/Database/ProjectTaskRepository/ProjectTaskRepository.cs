using System;
using backend_api.Models;

namespace backend_api.Database.ProjectTaskRepository
{
    public class ProjectTaskRepository : IProjectTaskRepository
    {
        public RepositoryReturn<bool> Add(ProjectTask projectTaskToAdd, Guid projectGuid)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Edit(ProjectTask projectTaskToOverwrite)
        {
            throw new NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid projectTaskGuid)
        {
            throw new NotImplementedException();
        }
    }
}