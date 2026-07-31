using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.SupportTickets.Queries;

public record TicketDto(Guid Id, string Subject, string Status, DateTime CreatedAt);

public record GetTicketsQuery : IRequest<List<TicketDto>>;

public class GetTicketsQueryHandler : IRequestHandler<GetTicketsQuery, List<TicketDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetTicketsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<TicketDto>> Handle(GetTicketsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        return await _context.SupportTickets
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Created)
            .Select(t => new TicketDto(t.Id, t.Subject, t.Status.ToString(), t.Created.DateTime))
            .ToListAsync(cancellationToken);
    }
}
