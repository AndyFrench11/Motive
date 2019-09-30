using Newtonsoft.Json;

namespace backend_api.Features.TaskStatus.Model
{
    public class TaskStatus
    {
        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }
    }
}