using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,SuperAdmin")]
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

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("recent-users")]
    public async Task<IActionResult> GetRecentUsers([FromQuery] int count = 5)
    {
        var users = await _adminService.GetRecentUsersAsync(count);
        return Ok(users);
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
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
            Status: null // null gets all products
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
}
