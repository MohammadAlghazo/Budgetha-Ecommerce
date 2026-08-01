using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class OrderFulfillment : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public string SellerId { get; set; } = string.Empty;
    public ApplicationUser Seller { get; set; } = null!;

    public decimal Amount { get; set; }
    public FulfillmentStatus Status { get; set; } = FulfillmentStatus.Processing;
    public string? Carrier { get; set; }
    public string? TrackingNumber { get; set; }
    public DateTimeOffset? ShippedAt { get; set; }
    public DateTimeOffset? DeliveredAt { get; set; }
    public DateTimeOffset? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTimeOffset? StockReleasedAt { get; set; }

    [System.ComponentModel.DataAnnotations.ConcurrencyCheck]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<DeliveryReport> DeliveryReports { get; set; } = new List<DeliveryReport>();
}
