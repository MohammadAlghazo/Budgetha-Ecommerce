using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.SupportTickets.Commands;

public record ReplyToTicketCommand(Guid TicketId, string Message) : IRequest<bool>;

public class ReplyToTicketCommandHandler : IRequestHandler<ReplyToTicketCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;

    public ReplyToTicketCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IIdentityService identityService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
    }

    public async Task<bool> Handle(ReplyToTicketCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var ticket = await _context.SupportTickets
            .FirstOrDefaultAsync(t => t.Id == request.TicketId, cancellationToken);

        if (ticket == null) return false;

        var roles = await _identityService.GetRolesAsync(userId);
        if (ticket.UserId != userId && !roles.Contains("Admin") && !roles.Contains("SuperAdmin"))
            return false;

        var message = new TicketMessage
        {
            SenderId = userId,
            Body = request.Message
        };

        ticket.Messages.Add(message);
        
        // Only update status if it was closed, maybe reopen it
        if (ticket.Status == Budgetha.Domain.Enums.TicketStatus.Closed)
        {
            ticket.Status = Budgetha.Domain.Enums.TicketStatus.Open;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
