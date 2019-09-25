using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using backend_api.Models;

namespace backend_api.Database.MediaRepository
{
    public interface IMediaRepository
    {
        RepositoryReturn<bool> Create(MediaTracker newFileTracker, string encryptedMediaPassword, Guid ownerGuid);

        RepositoryReturn<MediaTracker> GetByGuid(Guid mediaGuid);

        RepositoryReturn<bool> AddUsersToMedia(Guid mediaGuid, IDictionary<Guid, string> newUserGuidsWithKey);
        
        RepositoryReturn<MediaAccessRelationship> GetEncryptedMediaKey(Guid mediaGuid, Guid userGuid);  

        RepositoryReturn<MediaTracker> Update(Guid mediaGuid, Guid userGuid);

        RepositoryReturn<bool> Delete(Guid mediaGuid, Guid userGuid);
    }
}