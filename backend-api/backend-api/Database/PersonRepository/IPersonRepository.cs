using System;
using System.Collections.Generic;

namespace backend_api.Database.PersonRepository
{
    public interface IPersonRepository
    {
        RepositoryReturn<IEnumerable<Models.Person>> GetAll();

        RepositoryReturn<Models.Person> GetByGuid(Guid personGuid);
        
        RepositoryReturn<Models.Person> GetByEmail(string personEmail);

        RepositoryReturn<bool> Add(Models.Person personToAdd);

        RepositoryReturn<bool> Edit(Models.Person personToOverwrite);

        RepositoryReturn<bool> Delete(Models.Person personToDelete);
    }
}