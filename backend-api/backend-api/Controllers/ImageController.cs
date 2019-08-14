using System;
using System.IO;
using System.Threading.Tasks;
using backend_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_api.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {

        // POST api/image        
        [HttpPost]
        public async Task<IActionResult> Upload(FileUploadViewModel uploadedFile) {
            Console.WriteLine(uploadedFile.File);
            var file = uploadedFile.File;

            if (file == null || file.Length <= 0) return BadRequest();

            // TODO make point directory to a production storage location
            var path = Path.Combine("/home/buzz/code/Motive/backend-api/backend-api/testImageDirectory");
            
            using (var fs = new FileStream(Path.Combine(path, file.FileName), FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            uploadedFile.Source = $"/uploadFiles/{file.FileName}";
            uploadedFile.Extension = Path.GetExtension(file.FileName).Substring(1);
            return Ok();
        }
    }
}