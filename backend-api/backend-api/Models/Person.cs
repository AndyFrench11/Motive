using System;
using System.Collections.Generic;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class Person
    {
        public string guid { get; set; }
        
        public string firstName { get; set; }
        
        public string lastName { get; set; }
        
        public string email { get; set; }
        
        public string dateOfBirth { get; set; }
        
        public string dateJoined { get; set; }
        
        public string profileBio { get; set; }

        public Person(string firstName, string lastName, string email, string dateOfBirth, string profileBio)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.dateOfBirth = dateOfBirth;
            this.profileBio = profileBio;
            
            this.guid = Guid.NewGuid().ToString();
            this.dateJoined = DateTime.Today.ToString("dd/MM/yy");
        }

        public Person()
        {
        }

        public Person(string firstName, string lastName, string email, string dateOfBirth, string profileBio, string guid, string dateJoined)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.dateOfBirth = dateOfBirth;
            this.profileBio = profileBio;

            this.guid = guid;
            this.dateJoined = dateJoined;
        }

        //NEEDS TO BE A DYNAMIC FOR LATER VALUES
        public Person(IReadOnlyDictionary<string, object> props)
        {
            this.firstName = props["firstName"].ToString();
            this.lastName = props["lastName"].ToString();
            this.email = props["email"].ToString();
            this.dateOfBirth = props["dateOfBirth"].ToString();
            this.profileBio = props["profileBio"].ToString();
            this.guid = props["guid"].ToString();
            this.dateJoined = props["dateJoined"].ToString();
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
