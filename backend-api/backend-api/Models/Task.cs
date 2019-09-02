using System;
namespace backend_api.Models
{
    public class ProjectTask : BaseEntity
    {
        public string name { get; set; }
        public bool completed { get; set; }
        public string guid { get; set; }
        public ProjectTask()
        {
        }
    }
}
