using Newtonsoft.Json;

namespace backend_api.Features.TaskPriority.Models
{
    public class TaskPriority
    {
        private const string Low = "Low";
        private const string Medium = "Medium";
        private const string High = "High";
        private const string None = "";
        
        [JsonProperty(PropertyName = "priority")]
        public int PriorityValue { get; set; }

        public TaskPriority()
        {
        }

        public TaskPriority(string priority)
        {
            switch (priority)
            {
                case Low:
                    PriorityValue = (int) PriorityTypes.Low;
                    break;
                case Medium:
                    PriorityValue = (int) PriorityTypes.Medium;
                    break;
                case High:
                    PriorityValue = (int) PriorityTypes.High;
                    break;
                case None:
                    PriorityValue = (int) PriorityTypes.None;
                    break;
                default:
                    PriorityValue = (int) PriorityTypes.None;
                    break;
            }
        }

        public string getPriority()
        {
            switch (PriorityValue)
            {
                case ((int)PriorityTypes.Low):
                    return Low;
                case ((int)PriorityTypes.Medium):
                    return Medium;
                case ((int)PriorityTypes.High):
                    return High;
                case ((int)PriorityTypes.None):
                    return None;
                default:
                    return null;
            }
        }

        public int getValue()
        {
            return PriorityValue;
        }
    }
}