using System;
using System.Collections.Generic;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class Project : BaseEntity
    {
        public string name { get; set; }
        public string description { get; set; }
        public List<ProjectTask> taskList { get; set; }
        public List<Tag> tagList { get; set; }
        public int imageIndex { get; set; }
        public LocalDateTime dateTimeCreated { get; set; }

        public Project()
        {
        }
        
        public Project(IReadOnlyDictionary<string, object> props)
        {
            this.name = props["name"].ToString();
            this.description = props["description"].ToString();
            this.imageIndex = Int32.Parse(props["imageIndex"].ToString());
            this.dateTimeCreated = new LocalDateTime(DateTime.Parse(props["dateTimeCreated"].ToString()));
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}
