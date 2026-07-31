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

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateOrder([FromBody] Budgetha.Application.Features.Orders.Commands.CreateOrderCommand command)
    {
        var orderId = await _mediator.Send(command);
        return Ok(orderId);
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

    [HttpPost("{id:guid}/create-paypal-order")]
    public async Task<ActionResult<string>> CreatePayPalOrder(Guid id)
    {
        var paypalOrderId = await _mediator.Send(new Budgetha.Application.Features.Orders.Commands.CreatePayPalOrderCommand(id));
        return Ok(new { id = paypalOrderId });
    }

    [HttpPost("{id:guid}/capture-paypal-order")]
    public async Task<ActionResult> CapturePayPalOrder(Guid id, [FromBody] CapturePayPalOrderRequest request)
    {
        var success = await _mediator.Send(new Budgetha.Application.Features.Orders.Commands.CapturePayPalOrderCommand(id, request.PayPalOrderId));
        if (!success)
            return BadRequest("Failed to capture PayPal order.");
            
        return Ok();
    }
}

public class CapturePayPalOrderRequest
{
    public string PayPalOrderId { get; set; } = string.Empty;
}
