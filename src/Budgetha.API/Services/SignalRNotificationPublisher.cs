using Budgetha.API.Hubs;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Notifications.Queries.GetNotifications;
using Microsoft.AspNetCore.SignalR;

namespace Budgetha.API.Services;

public sealed class SignalRNotificationPublisher : IRealtimeNotificationPublisher
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationPublisher(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task PublishAsync(
        string userId,
        NotificationDto notification,
        CancellationToken cancellationToken = default) =>
        _hubContext.Clients.User(userId)
            .SendAsync("ReceiveNotification", notification, cancellationToken);
}
