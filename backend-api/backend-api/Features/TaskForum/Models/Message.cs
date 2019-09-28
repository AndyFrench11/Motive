using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Features.TaskForum.Models
{
    public class Message : BaseEntity
    {
        public string Text { get; set; }
        
        public DateTime Sent { get; set; }
        
        public Person Author { get; set; }

        public Message()
        {
            Sent = DateTime.Now;
        }

        public Message(IReadOnlyDictionary<string, object> props)
        {
            this.Guid = Guid.Parse(props["guid"].ToString());
            this.Text = props["text"].ToString();
            this.Sent = Convert.ToDateTime(props["sent"].ToString());
        }
    }
}