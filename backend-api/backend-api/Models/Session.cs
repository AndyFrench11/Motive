using System;
using System.Security.Cryptography;

namespace backend_api.Models
{
    public class Session
    {
        public Guid userGuid { get; set; }

        public DateTime expiry { get; set; }
        
        public string privateKey { get; set; }

        public Session(string decryptedPrivateKey)
        {
            this.privateKey = decryptedPrivateKey;            
            this.expiry = DateTime.Now.AddHours(1);
        }
    }
}