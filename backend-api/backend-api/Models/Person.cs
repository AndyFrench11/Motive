using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http.Internal;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class Person : BaseEntity
    {
        public string firstName { get; set; }
        
        public string lastName { get; set; }
        
        public string email { get; set; }

        public string password { get; set; }
        
        public string dateOfBirth { get; set; }
        
        public LocalDateTime dateJoined { get; set; }
        
        public string profileBio { get; set; }
        
        // Creating a new person, generates a GUID
        public Person(string firstName, string lastName, string email, string password, string dateOfBirth, string profileBio)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.password = password;
            this.dateOfBirth = dateOfBirth;
            this.profileBio = profileBio;
            //this.dateJoined = DateTime.Today.ToString("dd/MM/yy");
        }

        public Person()
        {
        }

        // Parses an existing person, using existing GUID
        public Person(string firstName, string lastName, string email, string dateOfBirth, string password, string profileBio, string guid, LocalDateTime dateJoined)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.password = password;
            this.dateOfBirth = dateOfBirth;
            this.profileBio = profileBio;
            this.dateJoined = dateJoined;
            this.Guid = Guid.Parse(guid);
        }

        // Parses an existing person from an INode Properties Object, using existing GUID
        public Person(IReadOnlyDictionary<string, object> props)
        {
            this.firstName = props["firstName"].ToString();
            this.lastName = props["lastName"].ToString();
            this.email = props["email"].ToString();
            this.password = props["password"].ToString();
            this.dateOfBirth = props["dateOfBirth"].ToString();
            this.profileBio = props["profileBio"].ToString();
            this.dateJoined = new LocalDateTime(DateTime.Parse(props["dateJoined"].ToString()));
            this.Guid = Guid.Parse(props["guid"].ToString());
        }

        private Person(string firstName, string lastName, string email)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }
        

    }
}
