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

    [HttpPost("quote")]
    public async Task<ActionResult<Budgetha.Application.Common.Models.CheckoutQuote>> GetQuote(
        [FromBody] GetCheckoutQuoteQuery query)
    {
        return Ok(await _mediator.Send(query));
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

    [HttpGet("mine")]
    public async Task<ActionResult<List<CustomerOrderDto>>> GetMyOrders()
    {
        return Ok(await _mediator.Send(new GetCustomerOrdersQuery()));
    }

    [HttpGet("mine/{id:guid}")]
    public async Task<ActionResult<CustomerOrderDto>> GetMyOrder(Guid id)
    {
        var result = await _mediator.Send(new GetCustomerOrderQuery(id));
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CustomerOrderDto>> GetOrder(Guid id)
    {
        var result = await _mediator.Send(new GetCustomerOrderQuery(id));
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("mine/by-number/{orderNumber}")]
    public async Task<ActionResult<CustomerOrderDto>> GetMyOrderByNumber(string orderNumber)
    {
        var result = await _mediator.Send(new GetCustomerOrderByNumberQuery(orderNumber));
        return result == null ? NotFound() : Ok(result);
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

    [HttpGet("all")]
    [Authorize(Roles = "Seller,Admin,SuperAdmin")]
    public async Task<ActionResult<List<Budgetha.Application.Features.Orders.Queries.AdminOrderDto>>> GetAllOrders()
    {
        var result = await _mediator.Send(new Budgetha.Application.Features.Orders.Queries.GetAdminOrdersQuery());
        return Ok(result);
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Seller,Admin,SuperAdmin")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var success = await _mediator.Send(new Budgetha.Application.Features.Orders.Commands.UpdateOrderStatusCommand(id, request.Status));
        if (!success) return BadRequest("Failed to update status.");
        return Ok();
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<ActionResult> Cancel(Guid id)
    {
        var success = await _mediator.Send(new Budgetha.Application.Features.Orders.Commands.CancelOrderCommand(id));
        if (!success) return BadRequest("Order cannot be cancelled.");
        return Ok();
    }
}

public class UpdateOrderStatusRequest
{
    public Budgetha.Domain.Enums.OrderStatus Status { get; set; }
}

public class CapturePayPalOrderRequest
{
    public string PayPalOrderId { get; set; } = string.Empty;
}
