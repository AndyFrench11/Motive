using System;
using System.IO;
using System.Security.Cryptography;

namespace backend_api.Crypto
{
    public class AESEngine
    {
        // Rfc2898DeriveBytes constants:
        public readonly int Iterations = 1042; // Recommendation is >= 1000.

        public void DecryptFile(string sourceFilename, string destinationFilename, string password, byte[] salt)
        {
            AesManaged aes = new AesManaged();
            aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
            aes.KeySize = aes.LegalKeySizes[0].MaxSize;

            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);
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
        
        // Encrypts a file with AES256 and returns the used salt
        public byte[] EncryptFile(string sourceFilename, string destinationFilename, string password)
        {
            // Random 32 bit salt
            byte[] salt = new byte[8];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(salt); // The salt is now filled with cryptographically strong random bytes.
            
            AesManaged aes = new AesManaged();
            aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
            aes.KeySize = aes.LegalKeySizes[0].MaxSize;
            
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password, salt, Iterations);
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

            return salt;
        }
    }
}