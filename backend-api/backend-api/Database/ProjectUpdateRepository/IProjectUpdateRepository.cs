using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.ProjectUpdateRepository
{
    public interface IProjectUpdateRepository
    {
        //Returns all of the updates on projects that a person is involved with
        RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForPerson(Guid personGuid);
        
        RepositoryReturn<IEnumerable<ProjectUpdate>> GetAllForProject(Guid projectGuid);

        RepositoryReturn<ProjectUpdate> GetByGuid(Guid updateGuid);
        
        RepositoryReturn<bool> Add(ProjectUpdate projectUpdateToAdd, Guid projectGuid, Guid userGuid);

        RepositoryReturn<bool> EditContent(Guid projectUpdateGuid, string content);
        
        RepositoryReturn<bool> EditHighlightStatus(Guid projectUpdateGuid, bool highlightStatus);
        
        RepositoryReturn<bool> EditAssociatedTask(Guid projectUpdateGuid);

        RepositoryReturn<bool> Delete(Guid projectUpdateGuid);
    }
}