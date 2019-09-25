﻿using System;
using System.Collections.Generic;

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
        public List<Comment> comments { get; set; }

        public ProjectUpdate()
        {
            
        }
        
        public ProjectUpdate(IReadOnlyDictionary<string, object> props)
        {
            this.content = props["content"].ToString();
            this.highlight = Boolean.Parse(props["highlight"].ToString());
            this.Guid = Guid.Parse(props["guid"].ToString());
        }
    }
}