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
        
        RepositoryReturn<bool> Add(Project projectToAdd, Guid userGuid, string encryptedProjectPassword);

        RepositoryReturn<bool> EditTaskOrder(List<ProjectTask> projectTaskList, Guid projectGuid);
        
        RepositoryReturn<bool> EditName(Guid projectGuid, string newProjectName);
        
        RepositoryReturn<bool> EditDescription(Guid projectGuid, string newProjectDescription);
        
        RepositoryReturn<bool> AddTag(Guid projectGuid, Tag newTag);
        
        RepositoryReturn<bool> RemoveTag(Guid projectId, string tagName);
        
        RepositoryReturn<bool> EditPhotoIndex(Guid projectGuid, int photoIndex);
        
        RepositoryReturn<bool> Delete(Guid projectGuid);

        RepositoryReturn<ProjectAccessRelationship> GetUserAccessToProject(Guid projectGuid, Guid userGuid);

        RepositoryReturn<bool> AddProjectMembers(Guid projectGuid,
            IDictionary<Guid, Tuple<AccessLevel, string>> newMemberInfo);

        RepositoryReturn<bool> RemoveProjectMembers(Guid projectGuid, IDictionary<Guid, AccessLevel> membersToRemove);
    }
}