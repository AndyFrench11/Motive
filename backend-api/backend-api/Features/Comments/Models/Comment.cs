﻿using System;
using System.Collections.Generic;
using backend_api.Models;

namespace backend_api.Features.Comments.Models
{
    public class Comment : BaseEntity
    {
        public string Message { get; set; }
        public DateTime Authored { get; set; }
        
        public Person Author { get; set; }

        public Comment()
        {
            Authored = DateTime.Now;
        }

        public Comment(IReadOnlyDictionary<string, object> props)
        {
            this.Guid = Guid.Parse(props["guid"].ToString());
            this.Message = props["message"].ToString();
            this.Authored = Convert.ToDateTime(props["authored"].ToString());
        }
    }
}