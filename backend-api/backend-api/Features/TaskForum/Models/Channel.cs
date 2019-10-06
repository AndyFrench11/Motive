using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Features.TaskForum.Models
{
    public class Channel : BaseEntity
    {
        public string Name { get; set; }
        
        public DateTime Created { get; set; }

        public Channel()
        {
            Created = DateTime.Now;
        }

        public Channel(IReadOnlyDictionary<string, object> props)
        {
            this.Guid = Guid.Parse(props["guid"].ToString());
            this.Name = props["name"].ToString();
            this.Created = Convert.ToDateTime(props["created"].ToString());
        }
        
    }
}