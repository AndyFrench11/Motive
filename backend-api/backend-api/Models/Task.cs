using System;
namespace backend_api.Models
{
    public class ProjectTask
    {
        public string name { get; set; }
        public bool completed { get; set; }
        public string guid { get; set; }
        public ProjectTask()
        {
        }
    }
}
