using System;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class UpdateToMediaRelationship
    {
        public MediaType MediaType { get; }

        public UpdateToMediaRelationship(string mediaType)
        {
            Enum.TryParse(mediaType, out MediaType foundMediaType);
            this.MediaType = foundMediaType;
        }

        public UpdateToMediaRelationship(IRelationship fetchedRelationship)
        {
            Enum.TryParse(fetchedRelationship.Type, out MediaType foundMediaType);
            this.MediaType = foundMediaType;
        }
    }
}