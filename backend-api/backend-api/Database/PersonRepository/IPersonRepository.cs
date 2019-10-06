using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Database.PersonRepository
{
    public interface IPersonRepository
    {
        RepositoryReturn<IEnumerable<Person>> GetAll();
        
        RepositoryReturn<IEnumerable<Person>> GetAllForProject(Guid projectGuid);

        RepositoryReturn<Person> GetByGuid(Guid personGuid);
        
        RepositoryReturn<Person> GetByEmail(string personEmail);

        RepositoryReturn<bool> Add(Person personToAdd);

        RepositoryReturn<bool> Edit(Person personToOverwrite);

        RepositoryReturn<bool> Delete(Guid personGuid);
    }
}