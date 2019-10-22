using System;
using System.Collections.Generic;
using backend_api.Features.Comments.Models;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class ProjectUpdate : BaseEntity
    {
        public string content { get; set; }
        public bool highlight { get; set; }
        public Guid taskGuid { get; set; }
        public ProjectTask relatedTask { get; set; }
        public Person relatedPerson { get; set; }
        public Project relatedProject { get; set; }
        public List<Comment> comments { get; set; }
        //public List<Tag> relatedTags { get; set; }
        public string dateTimeCreated { get; set; }
        
        public string photoGuid { get; set; }
        
        public string videoGuid { get; set; }

        public ProjectUpdate()
        {
            
        }
        
        public ProjectUpdate(IReadOnlyDictionary<string, object> props)
        {
            this.content = props["content"].ToString();
            this.highlight = Boolean.Parse(props["highlight"].ToString());
            this.dateTimeCreated = (new LocalDateTime(DateTime.Parse(props["dateTimeCreated"].ToString()))).ToString();
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}