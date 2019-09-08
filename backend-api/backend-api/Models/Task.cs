using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class ProjectTask : BaseEntity
    {
        public string name { get; set; }
        public bool completed { get; set; }
        

        public ProjectTask()
        {
            
        }
        
        public ProjectTask(IReadOnlyDictionary<string, object> props)
        {
            this.name = props["name"].ToString();
            this.completed = (bool)(props["completed"]);
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}
