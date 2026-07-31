using Budgetha.Application.Features.SupportTickets.Commands;
using Budgetha.Application.Features.SupportTickets.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SupportTicketsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SupportTicketsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateTicket([FromBody] CreateTicketRequest request)
    {
        var ticketId = await _mediator.Send(new CreateTicketCommand(request.Subject, request.Message));
        return Ok(new { id = ticketId });
    }

    [HttpGet]
    public async Task<ActionResult<List<TicketDto>>> GetTickets()
    {
        var tickets = await _mediator.Send(new GetTicketsQuery());
        return Ok(tickets);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TicketDetailDto>> GetTicket(Guid id)
    {
        var ticket = await _mediator.Send(new GetTicketQuery(id));
        if (ticket == null) return NotFound();
        return Ok(ticket);
    }

    [HttpPost("{id:guid}/reply")]
    public async Task<ActionResult> ReplyToTicket(Guid id, [FromBody] ReplyToTicketRequest request)
    {
        var success = await _mediator.Send(new ReplyToTicketCommand(id, request.Message));
        if (!success) return NotFound();
        return Ok();
    }
}

public class CreateTicketRequest
{
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class ReplyToTicketRequest
{
    public string Message { get; set; } = string.Empty;
}
