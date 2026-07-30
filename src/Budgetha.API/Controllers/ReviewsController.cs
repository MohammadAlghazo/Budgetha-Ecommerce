using Budgetha.Application.Features.Reviews.Commands;
using Budgetha.Application.Features.Reviews.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReviewsController(IMediator mediator)
    {
        _mediator = mediator;
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
        return await _mediator.Send(command);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateReview(Guid id, UpdateReviewCommand command)
    {
        if (id != command.ReviewId)
        {
            return BadRequest();
        }

        await _mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteReview(Guid id)
    {
        await _mediator.Send(new DeleteReviewCommand(id));

        return NoContent();
    }
}
