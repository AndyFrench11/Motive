using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend_api.Controllers
{
    public class ValidSessionRequiredAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.HttpContext.Request.Cookies.TryGetValue("sessionId", out var cookie))
            {
                // No cookie provided, boot out
                context.Result = new BadRequestObjectResult("No cookie provided");
            } 
            else if (!SessionsController.IsSessionLoggedIn(cookie))
            {
                // Invalid cookie
                context.Result = new BadRequestObjectResult("Invalid cookie");
            }
        }
    }
}