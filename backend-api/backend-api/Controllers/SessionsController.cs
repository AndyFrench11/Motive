using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using backend_api.Crypto;
using backend_api.Models;

namespace backend_api.Controllers
{
    public class SessionsController
    {
        private static readonly Dictionary<string, Session> LoggedInSessions;
        private static readonly Timer sessionGcTimer;

        static SessionsController()
        {
            LoggedInSessions = new Dictionary<string, Session>();

            var startTimeSpan = TimeSpan.Zero;
            var periodTimeSpan = TimeSpan.FromMinutes(1);

            sessionGcTimer = new Timer((e) =>
            {
                ClearOldSessions();   
            }, null, startTimeSpan, periodTimeSpan);
        }

        private static void ClearOldSessions()
        {
            Console.WriteLine("Clearing inactive sessions...");
            int numOfClosedSessions = 0;
            foreach(KeyValuePair<string, Session> sessionEntry in LoggedInSessions.ToList())
            {
                if (sessionEntry.Value.expiry < DateTime.Now)
                {
                    // Session has expired -> remove its entry
                    CloseSession(sessionEntry.Key);
                    numOfClosedSessions++;
                }
            }
            Console.WriteLine($"Closed {numOfClosedSessions} sessions.");
        }
        
        public static string CreateSession(Guid userGuid, Session newSession)
        {
            string newSessionId = GenerateNewSessionId();
            
            LoggedInSessions[newSessionId] = newSession;
            return newSessionId;
        }

        public static bool CloseSession(string sessionId)
        {
            if (!LoggedInSessions.TryGetValue(sessionId, out Session loggedInSession))
            {
                return false;
            }

            LoggedInSessions.Remove(sessionId);
            return true;
        }

        public static Session GetLoggedInSession(string sessionId)
        {
            if (LoggedInSessions.TryGetValue(sessionId, out Session loggedInSession))
            {
                loggedInSession.expiry.AddMinutes(5);
                return loggedInSession;
            }

            return null;
        }

        public static bool IsSessionLoggedIn(string sessionId)
        {
            if (LoggedInSessions.TryGetValue(sessionId, out Session loggedInSession))
            {
                return true;
            }

            return false;
        }
        
        private static string GenerateNewSessionId()
        {
            // Random 256 bit session ID
            byte[] newSessionId = CryptoHelpers.GetRandomBytes(32);
            return Convert.ToBase64String(newSessionId); 
        }
    }
}