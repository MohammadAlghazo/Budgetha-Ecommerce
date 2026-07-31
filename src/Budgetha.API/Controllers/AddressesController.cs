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
}
