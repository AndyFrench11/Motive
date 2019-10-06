using System;
using System.IO;
using System.Security.Cryptography;

namespace backend_api.Crypto
{
    public class AESEngine
    {
        // Rfc2898DeriveBytes constants:
        private readonly int Iterations = 1042; // Recommendation is >= 1000.

        private bool randomSalt = true;

        public void DecryptFile(string sourceFilename, string destinationFilename, string password, byte[] salt)
        {
            // Rebuild strongly hashed key
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);

            using (AesManaged aes = new AesManaged())
            {
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = key.GetBytes(aes.KeySize / 8);
                aes.IV = key.GetBytes(aes.BlockSize / 8);
                aes.Mode = CipherMode.CBC;
            
                ICryptoTransform transform = aes.CreateDecryptor(aes.Key, aes.IV);

                using (FileStream destination = new FileStream(destinationFilename, FileMode.CreateNew, FileAccess.Write, FileShare.None))
                {
                    try
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(destination, transform, CryptoStreamMode.Write))
                        {
                            using (FileStream source = new FileStream(sourceFilename, FileMode.Open, FileAccess.Read, FileShare.Read))
                            {
                                source.CopyTo(cryptoStream);
                            }
                        }
                    }
                    catch (CryptographicException exception)
                    {
                        throw new ApplicationException("Invalid AES decryption key, ensure password and salt are correct", exception);
                    }
                }
            }
        }
        
        // Encrypts a file with AES256 and returns the used salt
        public byte[] EncryptFile(string sourceFilename, string destinationFilename, string password)
        {
            byte[] salt;
            if (randomSalt)
            {
                // Random 32 bit salt
                salt = new byte[8];
                RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
                rng.GetBytes(salt); // The salt is now filled with cryptographically strong random bytes.
            }
            else
            {
                salt = new byte[] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
            }

            
            // Build strongly hashed key
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);

            using (AesManaged aes = new AesManaged())
            {
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = key.GetBytes(aes.KeySize / 8);
                aes.IV = key.GetBytes(aes.BlockSize / 8);
                aes.Mode = CipherMode.CBC;
                
                ICryptoTransform transform = aes.CreateEncryptor(aes.Key, aes.IV);

                using (FileStream destination = new FileStream(destinationFilename, FileMode.CreateNew, FileAccess.Write, FileShare.None))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(destination, transform, CryptoStreamMode.Write))
                    {
                        using (FileStream source = new FileStream(sourceFilename, FileMode.Open, FileAccess.Read, FileShare.Read))
                        {
                            source.CopyTo(cryptoStream);
                        }
                    }
                }
            }
            
            // Return used salt so the client can rebuild the used key IF they has the correct password
            return salt;
        }
        
        // Encrypts a file with AES256 and returns the used salt
        public byte[] EncryptStream(Stream sourceStream, string destinationFilename, string password)
        {
            byte[] salt;
            if (randomSalt)
            {
                // Random 32 bit salt
                salt = new byte[8];
                RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
                rng.GetBytes(salt); // The salt is now filled with cryptographically strong random bytes.
            }
            else
            {
                salt = new byte[] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
            }
            
            // Build strongly hashed key
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);

            using (AesManaged aes = new AesManaged())
            {
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = key.GetBytes(aes.KeySize / 8);
                aes.IV = key.GetBytes(aes.BlockSize / 8);
                aes.Mode = CipherMode.CBC;
                
                ICryptoTransform transform = aes.CreateEncryptor(aes.Key, aes.IV);

                using (FileStream destination = new FileStream(destinationFilename, FileMode.CreateNew, FileAccess.Write, FileShare.None))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(destination, transform, CryptoStreamMode.Write))
                    {
                        sourceStream.CopyTo(cryptoStream);
                    }
                }
            }
            
            // Return used salt so the client can rebuild the used key IF they has the correct password
            return salt;
        }
        
        public Stream DecryptFileToStream(string sourceFilename, string password, byte[] salt)
        {
            // Rebuild strongly hashed key
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);
            MemoryStream destination = new MemoryStream();
            
            using (AesManaged aes = new AesManaged())
            {
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = key.GetBytes(aes.KeySize / 8);
                aes.IV = key.GetBytes(aes.BlockSize / 8);
                aes.Mode = CipherMode.CBC;
            
                ICryptoTransform transform = aes.CreateDecryptor(aes.Key, aes.IV);

                try
                {
                    using (CryptoStream cryptoStream = new CryptoStream(destination, transform, CryptoStreamMode.Write, true))
                    {
                        using (FileStream source = new FileStream(sourceFilename, FileMode.Open, FileAccess.Read, FileShare.Read))
                        {
                            source.CopyTo(cryptoStream);
                        }
                    }
                }
                catch (CryptographicException exception)
                {
                    throw new ApplicationException("Invalid AES decryption key, ensure password and salt are correct", exception);
                }
            }
            destination.Seek(0, SeekOrigin.Begin);
            return destination;
        }
        
        public byte[] EncryptStringToBytes_Aes(string plainText, string password)
        {
            // Random 32 bit salt
            byte[] salt = new byte[8];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(salt); // The salt is now filled with cryptographically strong random bytes.
            
            // Build strongly hashed key
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);
            
            byte[] encrypted;
            
            using (AesManaged aes = new AesManaged())
            {
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = key.GetBytes(aes.KeySize / 8);
                aes.IV = key.GetBytes(aes.BlockSize / 8);
                aes.Mode = CipherMode.CBC;

                // Create an encryptor to perform the stream transform.
                ICryptoTransform transform = aes.CreateEncryptor(aes.Key, aes.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, transform, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }


            // Return the encrypted bytes from the memory stream, need to add the salt for decryption

            byte[] encryptedWithSalt = new byte[encrypted.Length + 8];
            
            Array.Copy(encrypted, 0, encryptedWithSalt, 0, encrypted.Length);
            Array.Copy(salt, 0, encryptedWithSalt, encrypted.Length, 8);
            
            return encryptedWithSalt;
        }

        public string DecryptStringFromBytes_Aes(byte[] cipherTextWithSalt, string password)
        {
            byte[] foundSalt = new byte[8];
            Array.Copy(cipherTextWithSalt, cipherTextWithSalt.Length - 8, foundSalt, 0, 8);

            // Get rid of the salt
            byte[] cipherText = new byte[cipherTextWithSalt.Length - 8];
            Array.Copy(cipherTextWithSalt, 0, cipherText, 0, cipherTextWithSalt.Length - 8);

            
            // Rebuild strongly hashed key
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, foundSalt, Iterations);

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;
            
            using (AesManaged aes = new AesManaged())
            {
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = key.GetBytes(aes.KeySize / 8);
                aes.IV = key.GetBytes(aes.BlockSize / 8);
                aes.Mode = CipherMode.CBC;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform transform = aes.CreateDecryptor(aes.Key, aes.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, transform, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }

            }
            return plaintext;
        }
    }
}