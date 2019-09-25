using System;
using System.Collections.Generic;
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
        //public List<Tag> relatedTags { get; set; }
        public LocalDateTime dateTimeCreated { get; set; }

        public ProjectUpdate()
        {
            
        }
        
        public ProjectUpdate(IReadOnlyDictionary<string, object> props)
        {
            this.content = props["content"].ToString();
            this.highlight = Boolean.Parse(props["highlight"].ToString());
            this.dateTimeCreated = new LocalDateTime(DateTime.Parse(props["dateTimeCreated"].ToString()));
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}