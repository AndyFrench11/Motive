using System;
using System.Collections.Generic;

namespace backend_api.Models
{
    public class Tag
    {
        public string name { get; set; }
        public Tag()
        {
        }
        
        public Tag(IReadOnlyDictionary<string, object> props)
        {
            this.name = props["name"].ToString();
        }
    }
}
