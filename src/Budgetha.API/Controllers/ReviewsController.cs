using Budgetha.Api.Hubs;
using Budgetha.Application.Features.Reviews.Commands;
using Budgetha.Application.Features.Reviews.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Budgetha.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IHubContext<ReviewHub> _hubContext;

    public ReviewsController(IMediator mediator, IHubContext<ReviewHub> hubContext)
    {
        _mediator = mediator;
        _hubContext = hubContext;
    }

    [HttpGet("{productId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<ReviewDto>>> GetReviews(Guid productId)
    {
        return await _mediator.Send(new GetProductReviewsQuery(productId));
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> AddReview(AddReviewCommand command)
    {
        var result = await _mediator.Send(command);
        await _hubContext.Clients.Group($"Product_{command.ProductId}").SendAsync("ReviewsUpdated");
        return result;
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateReview(Guid id, UpdateReviewCommand command)
    {
        if (id != command.ReviewId)
        {
            return BadRequest();
        }

        await _mediator.Send(command);

        // We don't have ProductId in UpdateReviewCommand, but we could add it.
        // For now, let's fetch it or just broadcast to all if needed?
        // Actually, we can just broadcast a generic event, or better, we can add ProductId to command.
        // Let's broadcast "ReviewUpdated" to all for simplicity in this demo, or we can fetch the review first.
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteReview(Guid id)
    {
        await _mediator.Send(new DeleteReviewCommand(id));

        return NoContent();
    }
}
