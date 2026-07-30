using Budgetha.Application.Features.Announcements.Commands;
using Budgetha.Application.Features.Announcements.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using MediatR;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController : ControllerBase
{
    private readonly IMediator Mediator;

    public AnnouncementsController(IMediator mediator)
    {
        Mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<List<AnnouncementDto>>> GetAll()
    {
        return await Mediator.Send(new GetAllAnnouncementsQuery());
    }

    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<ActionResult<AnnouncementDto?>> GetActive()
    {
        return await Mediator.Send(new GetActiveAnnouncementQuery());
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<Guid>> Create(CreateAnnouncementCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult> Update(Guid id, UpdateAnnouncementCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new DeleteAnnouncementCommand(id));
        return NoContent();
    }
}
