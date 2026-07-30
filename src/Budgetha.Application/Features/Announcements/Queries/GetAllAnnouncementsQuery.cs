using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Announcements.Queries;

public record GetAllAnnouncementsQuery() : IRequest<List<AnnouncementDto>>;

public class GetAllAnnouncementsQueryHandler : IRequestHandler<GetAllAnnouncementsQuery, List<AnnouncementDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllAnnouncementsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AnnouncementDto>> Handle(GetAllAnnouncementsQuery request, CancellationToken cancellationToken)
    {
        var announcements = await _context.Announcements
            .OrderByDescending(a => a.Created)
            .Select(a => new AnnouncementDto(
                a.Id,
                a.Message,
                a.LinkUrl,
                a.IsActive,
                a.StartDate,
                a.EndDate,
                a.Created
            ))
            .ToListAsync(cancellationToken);

        return announcements;
    }
}
