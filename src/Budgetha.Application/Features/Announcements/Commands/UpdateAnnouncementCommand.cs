using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;

namespace Budgetha.Application.Features.Announcements.Commands;

public record UpdateAnnouncementCommand(
    Guid Id,
    string Message,
    string? Subtitle,
    string? BadgeText,
    string? PromoCode,
    int? DiscountPercent,
    string? LinkUrl,
    bool IsActive,
    DateTime? StartDate,
    DateTime? EndDate) : IRequest<Unit>;

public class UpdateAnnouncementCommandHandler : IRequestHandler<UpdateAnnouncementCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateAnnouncementCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        var announcement = await _context.Announcements.FindAsync(new object[] { request.Id }, cancellationToken);

        if (announcement == null)
        {
            throw new NotFoundException(nameof(Announcement), request.Id);
        }

        announcement.Message = request.Message;
        announcement.Subtitle = request.Subtitle;
        announcement.BadgeText = request.BadgeText;
        announcement.PromoCode = request.PromoCode;
        announcement.DiscountPercent = request.DiscountPercent;
        announcement.LinkUrl = request.LinkUrl;
        announcement.IsActive = request.IsActive;
        announcement.StartDate = request.StartDate;
        announcement.EndDate = request.EndDate;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
