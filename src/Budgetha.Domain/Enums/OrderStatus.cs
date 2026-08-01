namespace Budgetha.Domain.Enums;

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Refunded,
    Failed,
    PartiallyFulfilled
}
