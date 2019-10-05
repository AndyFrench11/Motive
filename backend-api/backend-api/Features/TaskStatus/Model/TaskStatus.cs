using System;
using Newtonsoft.Json;

namespace backend_api.Features.TaskStatus.Model
{
    public class TaskStatus
    {

        private const string ToDo = "To do";
        private const string Doing = "Doing";
        private const string Done = "Done";
        private const string None = "";
        
        [JsonProperty(PropertyName = "status")]
        public int StatusValue { get; set; }

        public TaskStatus()
        {
        }

        public TaskStatus(string status)
        {
            switch (status)
            {
                case ToDo:
                    StatusValue = (int) StatusType.ToDo;
                    break;
                case Doing:
                    StatusValue = (int) StatusType.Doing;
                    break;
                case Done:
                    StatusValue = (int) StatusType.Done;
                    break;
                case None:
                    StatusValue = (int) StatusType.None;
                    break;
                default:
                    StatusValue = (int) StatusType.None;
                    break;
            }
        }

        public string getStatus()
        {
            switch (StatusValue)
            {
                case ((int)StatusType.ToDo):
                    return ToDo;
                case ((int)StatusType.Doing):
                    return Doing;
                case ((int)StatusType.Done):
                    return Done;
                case ((int)StatusType.None):
                    return None;
                default:
                    return null;
            }
        }

        public int getValue()
        {
            return StatusValue;
        }
    }
}