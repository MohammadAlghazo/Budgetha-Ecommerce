using Budgetha.Application.Features.SellerRequests.Commands;
using Budgetha.Application.Features.SellerRequests.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SellerRequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SellerRequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> SubmitRequest([FromBody] SubmitSellerRequestCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetRequests([FromQuery] string? status)
    {
        var result = await _mediator.Send(new GetSellerRequestsQuery { Status = status });
        return Ok(result);
    }

    [HttpGet("mine")]
    [Authorize]
    public async Task<IActionResult> GetMyRequest([FromServices] Budgetha.Application.Common.Interfaces.IApplicationDbContext context)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var request = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(
            context.SellerRequests
                .Where(candidate => candidate.UserId == userId)
                .OrderByDescending(candidate => candidate.Created));
        return Ok(request is null ? null : new { request.Id, request.Status, request.Created });
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> ApproveRequest(Guid id)
    {
        var result = await _mediator.Send(new ApproveSellerRequestCommand(id));
        if (!result) return BadRequest("Could not approve request.");
        return Ok();
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> RejectRequest(Guid id)
    {
        var result = await _mediator.Send(new RejectSellerRequestCommand(id));
        if (!result) return BadRequest("Could not reject request.");
        return Ok();
    }
}
