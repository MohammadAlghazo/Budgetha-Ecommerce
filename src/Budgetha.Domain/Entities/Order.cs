using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class Order : BaseAuditableEntity
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? PromoCode { get; set; }
    public string? PromoScope { get; set; }
    public string? PromoSellerId { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset? ReservationExpiresAt { get; set; }

    public Guid? ShippingAddressId { get; set; }
    public Address? ShippingAddress { get; set; }

    // Fulfillment must not depend on a mutable saved address.
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingLine1 { get; set; } = string.Empty;
    public string? ShippingLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingState { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
    public string? ContactEmail { get; set; }
    public string ContactPhone { get; set; } = string.Empty;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public Payment? Payment { get; set; }

    [System.ComponentModel.DataAnnotations.ConcurrencyCheck]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
