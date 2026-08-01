using Budgetha.Application.Features.Sellers.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SellersController : ControllerBase
{
    private readonly IMediator _mediator;

    public SellersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SellerProfileDto>> GetProfile(string id)
    {
        var profile = await _mediator.Send(new GetSellerProfileQuery(id));
        return profile is null ? NotFound() : Ok(profile);
    }
}
