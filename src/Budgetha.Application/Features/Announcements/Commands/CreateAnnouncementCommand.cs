using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;

namespace Budgetha.Application.Features.Announcements.Commands;

public record CreateAnnouncementCommand(
    string Message, 
    string? LinkUrl, 
    bool IsActive, 
    DateTime? StartDate, 
    DateTime? EndDate) : IRequest<Guid>;

public class CreateAnnouncementCommandHandler : IRequestHandler<CreateAnnouncementCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateAnnouncementCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        var announcement = new Announcement
        {
            Message = request.Message,
            LinkUrl = request.LinkUrl,
            IsActive = request.IsActive,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync(cancellationToken);

        return announcement.Id;
    }
}
