using System;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Web.Http;
using backend_api.Crypto;
using backend_api.Database;
using backend_api.Database.PersonRepository;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    public class SignUpController : Controller
    {
        private readonly IPersonRepository _personRepository;
        
        public SignUpController()
        {
            _personRepository = new PersonRepository();
        }
        
        // Contains the format of a Sign Up JSON object
        // POST api/signup
        [Microsoft.AspNetCore.Mvc.HttpPost]
        public ActionResult Post([Microsoft.AspNetCore.Mvc.FromBody] Person personToSignUp)
        {
            // TODO sanitise incoming person body
            // TODO hash password from client (protects against sniffin)
            
            // Check if account already exists
            RepositoryReturn<Person> userExistsResult = _personRepository.GetByEmail(personToSignUp.email);
            
            if (userExistsResult.IsError)
            {
                return StatusCode(500, userExistsResult.ErrorException.Message);
            }

            if (userExistsResult.ReturnValue != null)
            {
                // Account already exists
                return StatusCode(409);
            }
            
            // Create Crypto instances
            RSAEngine rsaEngine = new RSAEngine();
            AESEngine aesEngine = new AESEngine();
            
            // Generate a <pub, priv> RSA key pair (4096 bits)
            Tuple<RSAParameters, RSAParameters> keyPair = rsaEngine.GenerateKeyPair();
            string plainTextPassword = personToSignUp.password;
            
            // Set the password to be securely salted and hashed
            personToSignUp.password = GetSaltAndHashedPassword(personToSignUp.password);
            
            // Set the public key in the clear
            personToSignUp.publicKey = rsaEngine.ConvertKeyToString(keyPair.Item1);

            // Set the private key to be encrypted by the user's password (not salted and hashed)
            string encryptedPrivateKey = Convert.ToBase64String(aesEngine.EncryptStringToBytes_Aes(
                rsaEngine.ConvertKeyToString(keyPair.Item2), 
                plainTextPassword));

            personToSignUp.encryptedPrivateKey = encryptedPrivateKey;

            RepositoryReturn<bool> result = _personRepository.Add(personToSignUp);
            if (result.IsError)
            {
                return StatusCode(500, result.ErrorException.Message);
            }

            return StatusCode(201);
        }
        
        private string GetSaltAndHashedPassword(string plaintextPassword)
        {
            // Random 64 bit salt
            byte[] salt = new byte[16];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(salt); // The salt is now filled with cryptographically strong random bytes.

            // Note this is a SLOW hashing algorithm, this is actually a benefit
            var pbkdf2 = new Rfc2898DeriveBytes(plaintextPassword, salt, 10000);

            byte[] hash = pbkdf2.GetBytes(20);
            
            // 20 bytes for hash, 16 for salt
            byte[] hashBytes = new byte[36];
            
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            return Convert.ToBase64String(hashBytes);
        }

        private string GetNewMediaKey()
        {
            byte[] mediaKey = new byte[16];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(mediaKey);

            return Convert.ToBase64String(mediaKey);
        }
    }

}