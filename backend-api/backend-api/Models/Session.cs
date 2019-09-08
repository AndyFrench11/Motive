using System;
using System.Security.Cryptography;

namespace backend_api.Models
{
    public class Session
    {
        public string sessionId { get; set; }

        public DateTime expiry { get; set; }

        public Session()
        {
            // Random 256 bit session ID
            byte[] random = new byte[32];
            //RNGCryptoServiceProvider is an implementation of a random number generator.
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(random); // The array is now filled with cryptographically strong random bytes.
            
            this.sessionId = Convert.ToBase64String(random);
            this.expiry = DateTime.Now.AddHours(1);
        }
    }
}