using Budgetha.Application.Features.Orders.DTOs;
using Budgetha.Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("history")]
    [Authorize(Roles = "Seller,Admin,SuperAdmin")]
    public async Task<ActionResult<List<TransactionHistoryDto>>> GetHistory(
        [FromQuery] string type = "All",
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = new GetTransactionHistoryQuery
        {
            Type = type,
            StartDate = startDate,
            EndDate = endDate
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
