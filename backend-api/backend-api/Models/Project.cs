using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class Project : BaseEntity
    {
        public string name { get; set; }
        public string description { get; set; }
        public List<ProjectTask> taskList { get; set; }
        public List<Tag> tagList { get; set; }
        //public Person owner { get; set; }
        public int imageIndex { get; set; }

        public Project()
        {
        }
        
        public Project(IReadOnlyDictionary<string, object> props)
        {
            this.name = props["name"].ToString();
            this.description = props["description"].ToString();
            this.imageIndex = Int32.Parse(props["imageIndex"].ToString());
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}
