using System;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class Person
    {
        public string guid { get; set; }
        
        public string firstName { get; set; }
        
        public string lastName { get; set; }
        
        public string email { get; set; }

        public string password { get; set; }
        
        public string dateOfBirth { get; set; }
        
        public string dateJoined { get; set; }
        
        public string profileBio { get; set; }

        public Person(string firstName, string lastName, string email, string password, string dateOfBirth, string profileBio)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.password = password;
            this.dateOfBirth = dateOfBirth;
            this.profileBio = profileBio;
            
            this.guid = Guid.NewGuid().ToString();
            this.dateJoined = DateTime.Today.ToString("dd/MM/yy");
        }

        public Person()
        {
        }

//        public Person(Person parsedPerson)
//        {
//       
//            this.guid = Guid.NewGuid().ToString();
//            this.dateJoined = DateTime.Today.ToString("dd/MM/yy");
//            
//            this.firstName = parsedPerson.firstName;
//            this.lastName = parsedPerson.lastName;
//            this.email = parsedPerson.email;
//            this.dateOfBirth = parsedPerson.dateOfBirth;
//            this.profileBio = parsedPerson.profileBio;
//        }
    }
}
