using System;
using backend_api.Models;

namespace backend_api.Database.CommentRepository
{
    public interface ICommentRepository
    {
        RepositoryReturn<bool> Add(Comment comment, Guid authorGuid, Guid taskGuid);
        
        RepositoryReturn<bool> GetAllForTask(Guid taskGuid);
        
        RepositoryReturn<bool> GetOne(Guid commentGuid);
        
        RepositoryReturn<bool> Edit(Comment comment);
        
        RepositoryReturn<bool> Delete(Guid commentGuid);
    }
}