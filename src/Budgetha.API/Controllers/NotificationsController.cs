using Budgetha.Application.Features.Notifications.Commands.MarkNotificationAsRead;
using Budgetha.Application.Features.Notifications.Queries.GetNotifications;
using Budgetha.Application.Features.Notifications.Queries.GetUnreadNotificationCount;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] int limit = 20)
    {
        var result = await _mediator.Send(new GetNotificationsQuery(Math.Clamp(limit, 1, 100)));
        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await _mediator.Send(new GetUnreadNotificationCountQuery());
        return Ok(new { Count = count });
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var result = await _mediator.Send(new MarkNotificationAsReadCommand(id));
        if (!result)
            return NotFound(new { Message = "Notification not found or unauthorized." });

        return Ok(new { Message = "Notification marked as read." });
    }
}
