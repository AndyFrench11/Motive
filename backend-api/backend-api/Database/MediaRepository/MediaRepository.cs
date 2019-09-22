using System;
using System.Linq;
using backend_api.Models;
using Neo4j.Driver.V1;

namespace backend_api.Database.MediaRepository
{
    public class MediaRepository : IMediaRepository
    {
        private readonly neo4jConnection _neo4jConnection;

        public MediaRepository()
        {
            _neo4jConnection = new neo4jConnection();
        }
        
        public RepositoryReturn<bool> Create(MediaTracker newFileTracker, string encryptedMediaPassword, Guid ownerGuid)
        {
            if (!newFileTracker.IsEncrypted)
            {
                return new RepositoryReturn<bool>(true, new ArgumentException("Media tracker unencrypted, please use EncryptHeaders()"));                
            }
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateMediaNode(tx, newFileTracker));
                    session.WriteTransaction(tx => LinkUserToMedia(tx, newFileTracker.Guid, ownerGuid, encryptedMediaPassword, AccessLevel.Owner));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void CreateMediaNode(ITransaction tx, MediaTracker newFileTracker)
        {
            tx.Run("CREATE(newMedia:Media {" +
                   $"guid: '{newFileTracker.Guid}', " +
                   $"extension: '{newFileTracker.extension}', " +
                   $"encryptedFilePath: '{newFileTracker.encryptedFilePath}', " +
                   $"contentHeader: '{newFileTracker.contentHeader}', " +
                   $"salt: '{Convert.ToBase64String(newFileTracker.salt)}', " +
                   $"isEncrypted: '{newFileTracker.IsEncrypted}'" +
                   "})");
        }

        private void LinkUserToMedia(ITransaction tx, Guid mediaGuid, Guid userGuid,
            string encryptedMediaPassword,
            AccessLevel accessLevel)
        {
            tx.Run("MATCH (user:Person),(media:Media)\n" +
                   $"WHERE user.guid = '{userGuid}' AND media.guid = '{mediaGuid}'\n" +
                   $"CREATE (user)-[r:{accessLevel} {{ encryptedKey: '{encryptedMediaPassword}' }}]->(media)"
            );
        }

        public RepositoryReturn<bool> AddUserToMedia(Guid mediaGuid, Guid newUserGuid, string encryptedMediaKey)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => LinkUserToMedia(tx, mediaGuid, newUserGuid, encryptedMediaKey, AccessLevel.Viewer));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        public RepositoryReturn<MediaTracker> GetByGuid(Guid mediaGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedMediaTracker = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run($"MATCH (media:Media) WHERE media.guid = '{mediaGuid}' RETURN media");

                        //Do a check to see if result.single() is empty
                        var record = result.SingleOrDefault();
                        if (record == null)
                        {
                            return null;
                        }
                        else
                        {
                            return new MediaTracker(record[0].As<INode>().Properties);
                        }
                    });

                    return new RepositoryReturn<MediaTracker>(returnedMediaTracker);
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<MediaTracker>(true, e);
            }
        }

        public RepositoryReturn<string> GetEncryptedMediaKey(Guid mediaGuid, Guid userGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedMediaTracker = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run(
                            $"MATCH (person:Person {{ guid: '{userGuid}' }})-[r]->(m:Media {{ guid : '{mediaGuid}'}})\nRETURN r");

                        var record = result.SingleOrDefault();
                        return record?[0].As<IRelationship>().Properties;
                    });
                    if (returnedMediaTracker == null)
                    {
                        return new RepositoryReturn<string>(null);
                    }
                    return new RepositoryReturn<string>(returnedMediaTracker["encryptedKey"].ToString());
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<string>(true, e);
            }
        }

        public RepositoryReturn<MediaTracker> Update(Guid mediaGuid, Guid userGuid)
        {
            throw new System.NotImplementedException();
        }

        public RepositoryReturn<bool> Delete(Guid mediaGuid, Guid userGuid)
        {
            throw new System.NotImplementedException();
        }
    }
}