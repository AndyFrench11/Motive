using System;
namespace backend_api.Models
{
    public class Person
    {
        public string chosenPerson { get; set; }
        public Person(string chosenPerson)
        {
            this.chosenPerson = chosenPerson;
        }
    }
}
