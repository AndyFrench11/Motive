using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class ProjectUpdate : BaseEntity
    {
        public string content { get; set; }
        public Guid taskGuid { get; set; }
        public ProjectTask relatedTask { get; set; }
        public Person relatedPerson { get; set; }
        //public List<Tag> relatedTags { get; set; }

        public ProjectUpdate()
        {
            
        }
        
        public ProjectUpdate(IReadOnlyDictionary<string, object> props)
        {
            this.content = props["content"].ToString();
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}