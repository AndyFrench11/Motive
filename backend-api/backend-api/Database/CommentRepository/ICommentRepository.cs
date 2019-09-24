﻿using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.CommentRepository
{
    public interface ICommentRepository
    {
        RepositoryReturn<bool> Add(Comment comment, Guid authorGuid, Guid taskGuid);
        
        RepositoryReturn<IEnumerable<Comment>> GetAllForTask(Guid taskGuid);

        RepositoryReturn<bool> Edit(Comment comment);
        
        RepositoryReturn<bool> Delete(Guid commentGuid);
    }
}