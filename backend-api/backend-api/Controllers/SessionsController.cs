using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using backend_api.Crypto;
using backend_api.Models;

namespace backend_api.Controllers
{
    public class SessionsController
    {
        private static readonly Dictionary<string, Session> LoggedInSessions;

        static SessionsController()
        {
            LoggedInSessions = new Dictionary<string, Session>();
        }
        
        public static string CreateSession(Guid userGuid, Session newSession)
        {
            string newSessionId = GenerateNewSessionId();
            
            LoggedInSessions[newSessionId] = newSession;
            return newSessionId;
        }

        public static bool CloseSession(string sessionId)
        {
            if (LoggedInSessions[sessionId] == null)
            {
                return false;
            }

            LoggedInSessions.Remove(sessionId);
            return true;
        }

        public static Session GetLoggedInSession(string sessionId)
        {
            return LoggedInSessions[sessionId];
        }
        
        private static string GenerateNewSessionId()
        {
            // Random 256 bit session ID
            byte[] newSessionId = CryptoHelpers.GetRandomBytes(32);
            return Convert.ToBase64String(newSessionId); 
        }
    }
}