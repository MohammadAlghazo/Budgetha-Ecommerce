using Budgetha.Application.Features.Wishlist.Commands;
using Budgetha.Application.Features.Wishlist.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WishlistsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WishlistsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<WishlistItemDto>>> GetWishlist()
    {
        return await _mediator.Send(new GetWishlistQuery());
    }

    [HttpPost]
    public async Task<ActionResult> AddItem([FromBody] AddToWishlistCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{productId}")]
    public async Task<ActionResult> RemoveItem(Guid productId)
    {
        await _mediator.Send(new RemoveFromWishlistCommand(productId));
        return NoContent();
    }
}
