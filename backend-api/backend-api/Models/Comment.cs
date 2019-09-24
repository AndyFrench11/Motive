using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class Comment : BaseEntity
    {
        public string Message { get; set; }
        public DateTime Authored { get; set; }

        public Comment()
        {
            Authored = DateTime.Now;
        }

        public Comment(IReadOnlyDictionary<string, object> props)
        {
            this.Guid = Guid.Parse(props["guid"].ToString());
            this.Message = props["message"].ToString();
            this.Authored = Convert.ToDateTime(props["authored"].ToString());
        }
    }
}