using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using backend_api.Models;

namespace backend_api.Database.MediaRepository
{
    public interface IMediaRepository
    {
        RepositoryReturn<bool> Create(MediaTracker newFileTracker, Guid updateGuid, MediaType mediaType);

        RepositoryReturn<MediaTracker> GetByGuid(Guid mediaGuid);
        RepositoryReturn<Tuple<MediaTracker, MediaType>> GetByProjectGuid(Guid projectUpdateGuid);

        RepositoryReturn<MediaTracker> Update(Guid mediaGuid, Guid userGuid);

        RepositoryReturn<bool> Delete(Guid mediaGuid, Guid userGuid);
    }
}