using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.CommentRepository
{
    public interface ICommentRepository
    {
        RepositoryReturn<Comment> Add(Comment comment, Guid authorGuid, Guid updateGuid);
        
        RepositoryReturn<IEnumerable<Comment>> GetAllForUpdate(Guid updateGuid);

        RepositoryReturn<bool> Edit(Comment comment);
        
        RepositoryReturn<bool> Delete(Guid commentGuid);
    }
}