using Budgetha.Application.Features.Cart.Commands;
using Budgetha.Application.Features.Cart.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        return await _mediator.Send(new GetCartQuery());
    }

    [HttpPost("items")]
    public async Task<ActionResult> AddItem([FromBody] AddToCartCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

    [HttpPut("items/{itemId}")]
    public async Task<ActionResult> UpdateItemQuantity(Guid itemId, [FromBody] UpdateCartItemQuantityCommand command)
    {
        if (itemId != command.ItemId) return BadRequest();
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("items/{itemId}")]
    public async Task<ActionResult> RemoveItem(Guid itemId)
    {
        await _mediator.Send(new RemoveFromCartCommand(itemId));
        return NoContent();
    }

    [HttpDelete]
    public async Task<ActionResult> ClearCart()
    {
        await _mediator.Send(new ClearCartCommand());
        return NoContent();
    }
}
