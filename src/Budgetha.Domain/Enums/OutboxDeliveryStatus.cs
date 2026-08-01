namespace Budgetha.Domain.Enums;

public enum OutboxDeliveryStatus
{
    Pending,
    Processing,
    Failed,
    Completed,
    DeadLettered
}
