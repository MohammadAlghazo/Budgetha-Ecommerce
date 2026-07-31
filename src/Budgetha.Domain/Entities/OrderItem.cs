using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid? VariantId { get; set; }
    public ProductVariant? Variant { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public OrderItemType Type { get; set; } = OrderItemType.Purchase;
    public DateOnly? RentalStartDate { get; set; }
    public DateOnly? RentalEndDate { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
}
