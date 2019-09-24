using System.Collections.Generic;

namespace backend_api.Models
{
    public class Comment : BaseEntity
    {
        public string Message { get; }

        public Comment()
        {
        }

        public Comment(IReadOnlyDictionary<string, object> props)
        {
            this.Message = props["message"].ToString();
        }
    }
}