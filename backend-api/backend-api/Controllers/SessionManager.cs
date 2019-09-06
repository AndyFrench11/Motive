using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace backend_api.Controllers
{
    public static class SessionManager
    {
        private static readonly IList<string> Sessions = new List<string>();

        public static string CreateSessionToken()
        {
            // Random 256 bit session ID
            byte[] random = new byte[32];
            //RNGCryptoServiceProvider is an implementation of a random number generator.
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(random); // The array is now filled with cryptographically strong random bytes.
            
            string sessionId = Convert.ToBase64String(random);
            Sessions.Add(sessionId);
            return sessionId;
        }
        

        public static bool CheckSessionToken(string sessionId)
        {
            return (Sessions.Contains(sessionId));
        }
    }
}