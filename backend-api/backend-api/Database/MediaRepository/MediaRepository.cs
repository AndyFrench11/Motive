using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
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
        
        public RepositoryReturn<bool> Create(MediaTracker newFileTracker, Guid updateGuid, MediaType mediaType)
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
                    session.WriteTransaction(tx => LinkUpdateToMedia(tx, newFileTracker.Guid, updateGuid, mediaType));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        public RepositoryReturn<Tuple<MediaTracker, MediaType>> GetByProjectGuid(Guid projectUpdateGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {

                    var returnedMediaTracker = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run(
                            $"MATCH (update:ProjectUpdate)-[r]->(media:Media) " +
                            $"WHERE update.guid = '{projectUpdateGuid}'" +
                            "RETURN media");

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
                    
                    MediaType returnedMediaType = session.ReadTransaction(tx =>
                    {
                        var result = tx.Run(
                            $"MATCH (update:ProjectUpdate)-[r]->(media:Media) " +
                            $"WHERE update.guid = '{projectUpdateGuid}'" +
                            "RETURN type(r)");

                        var res = result.Select(record => record[0].As<string>()).ToList().SingleOrDefault();

                        if (res != null)
                        {
                            Enum.TryParse(res, out MediaType foundMediaType);
                            return foundMediaType;
                        }

                        return MediaType.None;
                    });
                    
                    return new RepositoryReturn<Tuple<MediaTracker, MediaType>>(new Tuple<MediaTracker, MediaType>(returnedMediaTracker, returnedMediaType));
                }
            }

            catch (Neo4jException e)
            {
                return new RepositoryReturn<Tuple<MediaTracker, MediaType>>(true, e);
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

        private void LinkUpdateToMedia(ITransaction tx, Guid mediaGuid, Guid updateGuid,
            MediaType mediaType)
        {
            // Looks for an existing relationship and updates it.
            tx.Run("MATCH (pu:ProjectUpdate),(media:Media)\n" +
                   $"WHERE pu.guid = '{updateGuid}' AND media.guid = '{mediaGuid}'\n" +
                   $"MERGE (pu)-[r:{mediaType}]->(media)"
            );
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