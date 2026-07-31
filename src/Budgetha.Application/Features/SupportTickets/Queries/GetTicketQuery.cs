using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.SupportTickets.Queries;

public record TicketMessageDto(Guid Id, string Body, string SenderId, DateTimeOffset SentAt, string SenderName);

public record TicketDetailDto(Guid Id, string Subject, string Status, DateTime CreatedAt, List<TicketMessageDto> Messages);

public record GetTicketQuery(Guid TicketId) : IRequest<TicketDetailDto?>;

public class GetTicketQueryHandler : IRequestHandler<GetTicketQuery, TicketDetailDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;

    public GetTicketQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IIdentityService identityService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
    }

    public async Task<TicketDetailDto?> Handle(GetTicketQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var roles = await _identityService.GetRolesAsync(userId);
        var isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");

        var ticket = await _context.SupportTickets
            .Include(t => t.Messages)
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == request.TicketId, cancellationToken);

        if (ticket == null) return null;
        if (!isAdmin && ticket.UserId != userId) return null; // Only admin or owner can view

        var messages = ticket.Messages
            .OrderBy(m => m.SentAt)
            .Select(m => new TicketMessageDto(
                m.Id,
                m.Body,
                m.SenderId,
                m.SentAt,
                m.SenderId == ticket.UserId ? (ticket.User != null ? $"{ticket.User.FirstName} {ticket.User.LastName}" : "User") : "Support Team"
            )).ToList();

        return new TicketDetailDto(ticket.Id, ticket.Subject, ticket.Status.ToString(), ticket.Created.DateTime, messages);
    }
}
