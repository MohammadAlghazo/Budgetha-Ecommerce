using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Notifications.Commands.DeleteAllNotifications;

public record DeleteAllNotificationsCommand() : IRequest<bool>;

public class DeleteAllNotificationsCommandHandler : IRequestHandler<DeleteAllNotificationsCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteAllNotificationsCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteAllNotificationsCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) return false;

        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .ToListAsync(cancellationToken);

        if (!notifications.Any()) return true;

        _context.Notifications.RemoveRange(notifications);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
