using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class Project
    {
        public string name { get; set; }
        public string description { get; set; }
        public List<Task> taskList { get; set; }
        public List<Tag> tagList { get; set; }
        //public Person owner { get; set; }

//        t: "sdsadsa"
//milestoneInput: "G'day"
//projectNameInput: "Heelll"
//tagInput: "Willies"
//tags: Array(1)
//0: {tagName: "Willies"}
//    length: 1
//__proto__: Array(0)
//taskList: Array(2)
//0: {taskName: "G'day"}
//1: {taskName: "G'day"}
//length: 2
//__proto__: Array(0)
//__proto__: Object

        public Project()
        {
        }
    }
}
