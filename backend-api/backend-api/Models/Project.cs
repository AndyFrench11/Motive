using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class Project
    {
        public string name { get; set; }
        public string description { get; set; }
        public List<ProjectTask> taskList { get; set; }
        public List<Tag> tagList { get; set; }
        //public Person owner { get; set; }
        public string guid { get; set; }

        public Project()
        {
        }
    }
}
