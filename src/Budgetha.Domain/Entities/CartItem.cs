using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class CartItem : BaseEntity
{
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid? VariantId { get; set; }
    public ProductVariant? Variant { get; set; }

    public int Quantity { get; set; }
    public OrderItemType Type { get; set; } = OrderItemType.Purchase;
    public DateOnly? RentalStartDate { get; set; }
    public DateOnly? RentalEndDate { get; set; }

    public string? Color { get; set; }
    public string? Size { get; set; }
}
