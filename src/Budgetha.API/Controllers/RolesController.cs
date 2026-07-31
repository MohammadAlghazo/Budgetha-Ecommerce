using Budgetha.API.Contracts.Auth;
using Budgetha.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin")]
public class RolesController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public RolesController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
    {
        if (IsSelfTarget(request.UserId))
            return BadRequest(new { Message = "SuperAdmin accounts cannot modify their own roles." });

        var result = await _identityService.AssignRoleAsync(request.UserId, request.Role);
        if (!result)
            return BadRequest(new { Message = "Failed to assign role. Check user ID and role name." });

        return Ok(new { Message = $"Role '{request.Role}' assigned successfully." });
    }

    [HttpPost("remove")]
    public async Task<IActionResult> RemoveRole([FromBody] AssignRoleRequest request)
    {
        if (IsSelfTarget(request.UserId))
            return BadRequest(new { Message = "SuperAdmin accounts cannot modify their own roles." });

        var result = await _identityService.RemoveRoleAsync(request.UserId, request.Role);
        if (!result)
            return BadRequest(new { Message = "Failed to remove role." });

        return Ok(new { Message = $"Role '{request.Role}' removed successfully." });
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserRoles(string userId)
    {
        var roles = await _identityService.GetRolesAsync(userId);
        return Ok(new { UserId = userId, Roles = roles });
    }

    private bool IsSelfTarget(string userId)
    {
        var actorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return string.Equals(actorId, userId, StringComparison.Ordinal);
    }
}
