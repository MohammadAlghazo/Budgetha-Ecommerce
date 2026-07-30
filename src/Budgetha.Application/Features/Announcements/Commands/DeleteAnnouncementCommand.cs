using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;

namespace Budgetha.Application.Features.Announcements.Commands;

public record DeleteAnnouncementCommand(Guid Id) : IRequest<Unit>;

public class DeleteAnnouncementCommandHandler : IRequestHandler<DeleteAnnouncementCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteAnnouncementCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
    {
        var announcement = await _context.Announcements.FindAsync(new object[] { request.Id }, cancellationToken);

        if (announcement == null)
        {
            throw new NotFoundException(nameof(Announcement), request.Id);
        }

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
