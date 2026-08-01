using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class OutboxDelivery : BaseEntity
{
    public OutboxDeliveryType Type { get; set; }
    public OutboxDeliveryStatus Status { get; set; } = OutboxDeliveryStatus.Pending;
    public string Recipient { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public Guid? NotificationId { get; set; }
    public Notification? Notification { get; set; }
    public int Attempts { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? NextAttemptAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? CompletedAt { get; set; }
    public string? LastError { get; set; }
    public string IdempotencyKey { get; set; } = string.Empty;
}
