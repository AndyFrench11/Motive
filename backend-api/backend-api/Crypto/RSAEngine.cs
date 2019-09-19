using System;
using System.Security.Cryptography;

namespace backend_api.Crypto
{
    public class RSAEngine
    {
        
        public Tuple<RSAParameters, RSAParameters> GenerateKeyPair() 
        {
            //lets take a new CSP with a new 2048 bit rsa key pair
            RSACryptoServiceProvider csp = new RSACryptoServiceProvider(4096);

            //how to get the private key
            RSAParameters privKey = csp.ExportParameters(true);
            RSAParameters pubKey = csp.ExportParameters(false);
            
            return new Tuple<RSAParameters, RSAParameters>(pubKey, privKey);
        }

        public string ConvertKeyToString(RSAParameters key) 
        {
            //we need some buffer
            var sw = new System.IO.StringWriter();
            //we need a serializer
            var xs = new System.Xml.Serialization.XmlSerializer(typeof(RSAParameters));
            //serialize the key into the stream
            xs.Serialize(sw, key);
            //get the string from the stream
            return sw.ToString();
        }

        public RSAParameters ConvertStringToKey(string stringKey)
        {
            //get a stream from the string
            var sr = new System.IO.StringReader(stringKey);
            //we need a deserializer
            var xs = new System.Xml.Serialization.XmlSerializer(typeof(RSAParameters));
            //get the object back from the stream
            return (RSAParameters) xs.Deserialize(sr);
        }

        public byte[] EncryptString(string data, RSAParameters publicKey)
        {
            //we have a public key ... let's get a new csp and load that key
            var csp = new RSACryptoServiceProvider();
            csp.ImportParameters(publicKey);

            //for encryption, always handle bytes...
            var bytesPlainTextData = System.Text.Encoding.Unicode.GetBytes(data);

            //apply pkcs#1.5 padding and encrypt our data 
            var bytesCypherText = csp.Encrypt(bytesPlainTextData, true);

            return bytesCypherText;
        }

        public string DecryptString(byte[] data, RSAParameters privateKey)
        {
            //we want to decrypt, therefore we need a csp and load our private key
            var csp = new RSACryptoServiceProvider();
            csp.ImportParameters(privateKey);

            //decrypt and strip pkcs#1.5 padding
            var bytesPlainTextData = csp.Decrypt(data, true);

            //get our original plainText back...
            var plainTextData = System.Text.Encoding.Unicode.GetString(bytesPlainTextData);

            return plainTextData;
        }
    }
}