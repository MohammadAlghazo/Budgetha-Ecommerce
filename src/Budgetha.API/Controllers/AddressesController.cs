using Budgetha.Application.Features.Addresses.Commands;
using Budgetha.Application.Features.Addresses.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AddressesController : ControllerBase
{
    private readonly IMediator _mediator;

    public AddressesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<AddressDto>>> GetAddresses()
    {
        return await _mediator.Send(new GetAddressesQuery());
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateAddress([FromBody] CreateAddressCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAddress(Guid id, [FromBody] UpdateAddressCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }
        var success = await _mediator.Send(command);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAddress(Guid id)
    {
        var success = await _mediator.Send(new DeleteAddressCommand(id));
        if (!success) return NotFound();
        return NoContent();
    }
}
