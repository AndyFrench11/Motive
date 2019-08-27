using System;
namespace backend_api.Models
{
    public class LoginPerson
    {
        public string email { get; set; }

        public string password { get; set; }

        public LoginPerson()
        {
        }

        public override string ToString()
        {
            return email;
        }
    }
}
