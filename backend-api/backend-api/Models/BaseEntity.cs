using System;
using Neo4j.Driver.V1;

namespace backend_api.Models
{
    public abstract class BaseEntity 
    {
        #region Constructors

        protected BaseEntity()
        {
            Guid = Guid.NewGuid();
        }

        #endregion

        #region Public Properties

        public Guid Guid { get; set; }

        #endregion
    }
}