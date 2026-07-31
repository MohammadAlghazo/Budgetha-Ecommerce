using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,SuperAdmin,Seller")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IMediator _mediator;

    public AdminController(IAdminService adminService, IMediator mediator)
    {
        _adminService = adminService;
        _mediator = mediator;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpGet("seller-stats")]
    public async Task<IActionResult> GetSellerStats()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var stats = await _adminService.GetSellerStatsAsync(userId);
        return Ok(stats);
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var result = await _adminService.GetAllUsersAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("recent-users")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetRecentUsers([FromQuery] int count = 5)
    {
        var users = await _adminService.GetRecentUsersAsync(count);
        return Ok(users);
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var isSuperAdminOrAdmin = User.IsInRole("Admin") || User.IsInRole("SuperAdmin");
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        var query = new GetProductsQuery(
            Search: null,
            Categories: null,
            Brands: null,
            MinPrice: 0,
            MaxPrice: int.MaxValue,
            MinRating: 0,
            Sort: "newest",
            Page: page,
            PageSize: pageSize,
            SellerId: isSuperAdminOrAdmin ? null : userId
        );

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpDelete("products/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var result = await _adminService.DeleteProductAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("users/{id}/profile")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetUserProfile(string id)
    {
        var profile = await _adminService.GetUserProfileAsync(id);
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [HttpPost("users/{id}/ban")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> BanUser(string id)
    {
        var actorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(actorId)) return Unauthorized();
        var success = await _adminService.BanUserAsync(actorId, User.IsInRole("SuperAdmin"), id);
        if (!success) return BadRequest("Could not ban user.");
        return Ok();
    }

    [HttpPost("users/{id}/unban")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> UnbanUser(string id)
    {
        var actorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(actorId)) return Unauthorized();
        var success = await _adminService.UnbanUserAsync(actorId, User.IsInRole("SuperAdmin"), id);
        if (!success) return BadRequest("Could not unban user.");
        return Ok();
    }

    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var actorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(actorId)) return Unauthorized();
        var success = await _adminService.DeleteUserAsync(actorId, User.IsInRole("SuperAdmin"), id);
        if (!success) return BadRequest("Could not delete user.");
        return Ok();
    }
}
