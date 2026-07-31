using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Products.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Budgetha.Domain.Entities;
using System.Security.Claims;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,SuperAdmin,Seller")]
public class ImagesController : ControllerBase
{
    private readonly IImageService _imageService;
    private readonly IMediator _mediator;
    private readonly IApplicationDbContext _context;

    public ImagesController(IImageService imageService, IMediator mediator, IApplicationDbContext context)
    {
        _imageService = imageService;
        _mediator = mediator;
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file was uploaded.");
            
        // Max size 5MB
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("File size exceeds 5MB limit.");
            
        var allowedMimeTypes = new[] { "image/jpeg", "image/png", "image/webp", "application/pdf" };
        if (!allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            return BadRequest("Invalid file type.");

        using var stream = file.OpenReadStream();
        var result = await _imageService.UploadImageAsync(stream, file.FileName);

        if (result == null || string.IsNullOrEmpty(result.Url))
            return StatusCode(500, "Image upload failed.");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        _context.PendingImageUploads.Add(new PendingImageUpload
        {
            UserId = userId,
            PublicId = result.PublicId,
            Url = result.Url
        });
        await _context.SaveChangesAsync(HttpContext.RequestAborted);

        return Ok(new { url = result.Url, publicId = result.PublicId });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteUnattached([FromQuery] string publicId)
    {
        var deleted = await _mediator.Send(new DeleteUnattachedProductImageCommand(publicId));
        return deleted ? NoContent() : Conflict("The image is attached to a product or could not be deleted.");
    }
}
