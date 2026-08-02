using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Announcements.Queries;

public record AnnouncementDto(
    Guid Id,
    string Message,
    string? Subtitle,
    string? BadgeText,
    string? PromoCode,
    int? DiscountPercent,
    string? LinkUrl,
    bool IsActive,
    DateTime? StartDate,
    DateTime? EndDate,
    DateTimeOffset Created
);

public record GetActiveAnnouncementQuery() : IRequest<AnnouncementDto?>;

public class GetActiveAnnouncementQueryHandler : IRequestHandler<GetActiveAnnouncementQuery, AnnouncementDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTimeService;

    public GetActiveAnnouncementQueryHandler(IApplicationDbContext context, IDateTimeService dateTimeService)
    {
        _context = context;
        _dateTimeService = dateTimeService;
    }

    public async Task<AnnouncementDto?> Handle(GetActiveAnnouncementQuery request, CancellationToken cancellationToken)
    {
        var now = _dateTimeService.UtcNow.UtcDateTime;

        var activeAnnouncement = await _context.Announcements
            .Where(a => a.IsActive &&
                       (!a.StartDate.HasValue || a.StartDate <= now) &&
                       (!a.EndDate.HasValue || a.EndDate >= now))
            .OrderByDescending(a => a.Created)
            .Select(a => new AnnouncementDto(
                a.Id,
                a.Message,
                a.Subtitle,
                a.BadgeText,
                a.PromoCode,
                a.DiscountPercent,
                a.LinkUrl,
                a.IsActive,
                a.StartDate,
                a.EndDate,
                a.Created
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return activeAnnouncement;
    }
}
