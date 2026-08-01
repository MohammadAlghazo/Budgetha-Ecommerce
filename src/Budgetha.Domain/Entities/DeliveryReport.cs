using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class DeliveryReport : BaseAuditableEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid? FulfillmentId { get; set; }
    public OrderFulfillment? Fulfillment { get; set; }
    public string BuyerId { get; set; } = string.Empty;
    public ApplicationUser Buyer { get; set; } = null!;
    public bool WasReceived { get; set; }
    public string? Reason { get; set; }
    public DeliveryReportStatus Status { get; set; } = DeliveryReportStatus.Open;
    public string? AdminNote { get; set; }
    public string? ResolvedById { get; set; }
    public DateTimeOffset? ResolvedAt { get; set; }
}
