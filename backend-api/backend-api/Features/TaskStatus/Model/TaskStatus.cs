using Newtonsoft.Json;

namespace backend_api.Features.TaskStatus.Model
{
    public class TaskStatus
    {
        [JsonProperty(PropertyName = "status")]
        public int StatusValue { get; set; }

        public string getStatus()
        {
            switch (StatusValue)
            {
                case ((int)StatusType.ToDo):
                    return "To do";
                case ((int)StatusType.Doing):
                    return "Doing";
                case ((int)StatusType.Done):
                    return "Done";
                case ((int)StatusType.None):
                    return "";
                default:
                    return null;
            }
        }
    }
}