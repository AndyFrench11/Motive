namespace backend_api.Util
{
    public static class Errors
    {
        public const string InvalidGuid = "Invalid guid.";
        
        // Projects
        public const string NotGroupMember = "You do not have access as you are not a project contributor.";
        
        // Tasks
        public const string TaskNotFound = "Task not found.";
        public const string StatusInvalid = "Task status provided is invalid.";
        public const string PriorityInvalid = "Task priority provided is invalid.";

        // Updates
        public const string UpdateNotFound = "Update not found.";

        // Comments
        public const string CommentEmpty = "Comment cannot be empty.";
        public const string CommentNotFound = "Comment not found.";
        public const string NotCommentAuthor = "You cannot modify this resource.";
        
        // Channels
        public const string ChannelNameEmpty = "Discussion Channel name cannot be empty.";
        public const string ChannelNotFound = "Discussion Channel not found.";
        
        // Messages
        public const string MessageEmpty = "Message cannot be empty.";
        public const string MessageNotFound = "Message not found.";
    }
}