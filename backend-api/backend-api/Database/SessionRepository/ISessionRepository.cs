using System;
using backend_api.Models;

namespace backend_api.Database.SessionRepository
{
    public interface ISessionRepository
    {
        RepositoryReturn<Person> GetUserOnSession(string sessionId);

        RepositoryReturn<bool> Add(Session sessionToAdd, Guid personUsingSessionGuid);

        RepositoryReturn<bool> Edit(Session sessionToOverwrite);

        RepositoryReturn<bool> Delete(string sessionId);
    }
}