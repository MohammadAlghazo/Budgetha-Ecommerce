using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Announcements.Commands;

public record CreateAnnouncementCommand(
    string Message,
    string? Subtitle,
    string? BadgeText,
    string? PromoCode,
    int? DiscountPercent,
    string? LinkUrl,
    bool IsActive,
    DateTime? StartDate,
    DateTime? EndDate) : IRequest<Guid>;

public class CreateAnnouncementCommandHandler : IRequestHandler<CreateAnnouncementCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public CreateAnnouncementCommandHandler(IApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<Guid> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        var announcement = new Announcement
        {
            Message = request.Message,
            Subtitle = request.Subtitle,
            BadgeText = request.BadgeText,
            PromoCode = request.PromoCode,
            DiscountPercent = request.DiscountPercent,
            LinkUrl = request.LinkUrl,
            IsActive = request.IsActive,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync(cancellationToken);

        if (request.IsActive)
        {
            var users = await _context.Users
                .Select(u => u.Email)
                .ToListAsync(cancellationToken);

            foreach (var email in users)
            {
                if (!string.IsNullOrEmpty(email))
                {
                    await _emailService.QueueEmailAsync(
                        email,
                        "New Announcement",
                        $"<h3>{request.Message}</h3><p>{request.Subtitle}</p>",
                        $"announcement-{announcement.Id}",
                        cancellationToken);
                }
            }
            await _context.SaveChangesAsync(cancellationToken);
        }

        return announcement.Id;
    }
}
