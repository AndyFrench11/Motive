using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Database.ProjectRepository;

namespace backend_api.Models
{
    // Used to track encrypted content through the DB
    public class MediaTracker : BaseEntity
    {
        public string extension { get; private set; }
        public string encryptedFilePath { get; private set; }
        public string contentHeader { get; private set; }
        public byte[] salt { get; set; }
        
        
        public bool IsEncrypted { private set; get; }
        
        public MediaTracker(string extension, string contentHeader, byte[] salt)
        {
            System.IO.Directory.CreateDirectory(Path.Combine(Environment.CurrentDirectory, @"Uploads/"));
            this.encryptedFilePath = Path.Combine(Environment.CurrentDirectory, @"Uploads/", this.Guid.ToString());;
            this.extension = extension;
            this.contentHeader = contentHeader;
            this.salt = salt;
        }

        public MediaTracker(IReadOnlyDictionary<string, object> props)
        {
            this.extension = props["extension"].ToString();
            this.encryptedFilePath = props["encryptedFilePath"].ToString();
            this.contentHeader = props["contentHeader"].ToString();
            this.salt = Convert.FromBase64String(props["salt"].ToString());
            this.IsEncrypted = Convert.ToBoolean(props["isEncrypted"].ToString());
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
        
        public MediaTracker(string extension, string contentHeader)
        {
            this.encryptedFilePath = Path.Combine(Environment.CurrentDirectory, @"Uploads/", this.Guid.ToString());;
            this.extension = extension;
            this.contentHeader = contentHeader;
        }

        public bool EncryptHeaders(string password)
        {
            if (IsEncrypted) return false;
            
            AESEngine aesEngine = new AESEngine();
            this.extension = Convert.ToBase64String(aesEngine.EncryptStringToBytes_Aes(this.extension, password));
            this.contentHeader = Convert.ToBase64String(aesEngine.EncryptStringToBytes_Aes(this.contentHeader, password));
            this.IsEncrypted = true;
            return true;
        }
        
        public bool DecryptHeaders(string password)
        {
            if (!IsEncrypted) return false;
            
            AESEngine aesEngine = new AESEngine();
            this.extension = aesEngine.DecryptStringFromBytes_Aes(Convert.FromBase64String(this.extension), password);
            this.contentHeader = aesEngine.DecryptStringFromBytes_Aes(Convert.FromBase64String(this.contentHeader), password);
            this.IsEncrypted = false;
            return true;
        }

        public MediaType GetMediaType()
        {
            if (this.IsEncrypted)
                throw new InvalidOperationException("MediaTracker is currently encrypted");
            
            if (this.contentHeader.StartsWith("image"))
            {
                return MediaType.Image;
            }

            if (this.contentHeader.StartsWith("video"))
            {
                return MediaType.Video;
            }
            
            throw new InvalidDataException("MediaTracker has invalid content type");
        }
    }
}