namespace backend_api.Util
{
    public static class Errors
    {
        public const string InvalidGuid = "Invalid guid.";
        
        // Updates
        public const string UpdateNotFound = "Project Update not found.";

        // Comments
        public const string CommentEmpty = "Comment cannot be empty.";
        public const string CommentNotFound = "Comment not found.";
        
        // Channels
        public const string ChannelNameEmpty = "Discussion Channel name cannot be empty.";
        
        // Messages
        public const string MessageEmpty = "Message cannot be empty.";
        
        // Task
        public const string StatusInvalid = "Task status provided is invalid.";
        public const string PriorityInvalid = "Task priority provided is invalid.";
    }
}