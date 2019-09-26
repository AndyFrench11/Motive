using System.Security.Cryptography;

namespace backend_api.Crypto
{
    public static class CryptoHelpers
    {
        public static byte[] GetRandomBytes(int numberOfBytes)
        {
            // Random 32 bit salt
            byte[] randomArray = new byte[numberOfBytes];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(randomArray); // The salt is now filled with cryptographically strong random bytes.
            return randomArray;
        }
    }
}