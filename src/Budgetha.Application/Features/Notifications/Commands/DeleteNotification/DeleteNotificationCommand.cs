using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Notifications.Commands.DeleteNotification;

public record DeleteNotificationCommand(Guid Id) : IRequest<bool>;

public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteNotificationCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) return false;

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.Id && n.UserId == userId, cancellationToken);

        if (notification == null) return false;

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
