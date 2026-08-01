using Budgetha.Application.Features.Notifications.Queries.GetNotifications;

namespace Budgetha.Application.Common.Interfaces;

public interface IRealtimeNotificationPublisher
{
    Task PublishAsync(
        string userId,
        NotificationDto notification,
        CancellationToken cancellationToken = default);
}
