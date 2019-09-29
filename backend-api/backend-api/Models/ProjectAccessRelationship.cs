using System;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class ProjectAccessRelationship
    {
        public AccessLevel AccessLevel { get; }
        public string EncryptedMediaKey { get; }

        public ProjectAccessRelationship(string accessLevel, string encryptedMediaKey)
        {
            Enum.TryParse(accessLevel, out AccessLevel foundLevel);
            this.AccessLevel = foundLevel;
            this.EncryptedMediaKey = encryptedMediaKey;
        }

        public ProjectAccessRelationship(IRelationship fetchedRelationship)
        {
            Enum.TryParse(fetchedRelationship.Type, out AccessLevel foundLevel);
            this.AccessLevel = foundLevel;
            this.EncryptedMediaKey = fetchedRelationship.Properties["encryptedKey"].ToString();
        }
    }
}