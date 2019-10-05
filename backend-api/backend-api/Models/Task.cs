using System;
using System.Collections.Generic;
using backend_api.Features.TaskStatus.Model;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public class ProjectTask : BaseEntity
    {
        public string name { get; set; }
        public bool completed { get; set; }
        public int orderIndex { get; set; }
        public LocalDateTime dateTimeCreated { get; set; }
        public LocalDateTime dateTimeCompleted { get; set; }
        public int Status { get; set; }


        public ProjectTask()
        {
        }

        public ProjectTask(IReadOnlyDictionary<string, object> props)
        {
            this.name = props["name"].ToString();
            this.completed = (bool) (props["completed"]);
            this.orderIndex = Int32.Parse(props["orderIndex"].ToString());
            this.dateTimeCreated = new LocalDateTime(DateTime.Parse(props["dateTimeCreated"].ToString()));
            if (props.ContainsKey("dateTimeCompleted").Equals(true))
            {
                this.dateTimeCompleted = new LocalDateTime(DateTime.Parse(props["dateTimeCompleted"].ToString()));
            }
            this.Guid = Guid.Parse(props["guid"].ToString());
            if (props.ContainsKey("status").Equals(true))
            {
                var status = new TaskStatus(props["status"].ToString());
                this.Status = status.getValue();
            }
        }
    }
}
