using System;

namespace Budgetha.Application.Features.Notifications.Queries.GetNotifications;

public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public string? RelatedEntityId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
