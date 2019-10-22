using System;
using System.Collections.Generic;
using backend_api.Database;
using backend_api.Features.Comments.Models;

namespace backend_api.Features.Comments.Repository
{
    public interface ICommentRepository
    {
        RepositoryReturn<Comment> Add(Comment comment, Guid authorGuid, Guid updateGuid);
        
        RepositoryReturn<IEnumerable<Comment>> GetAllForUpdate(Guid updateGuid);

        RepositoryReturn<bool> Edit(Comment comment);
        
        RepositoryReturn<bool> Delete(Guid commentGuid);

        RepositoryReturn<bool> DeleteAll(Guid updateGuid);
        
        RepositoryReturn<bool> Exists(Guid commentGuid);

        RepositoryReturn<bool> IsAuthor(Guid authorGuid, Guid commentGuid);
    }
}