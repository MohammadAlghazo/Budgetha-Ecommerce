using Budgetha.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Budgetha.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string SKU { get; set; } = string.Empty;
    public string? Color { get; set; }
    public string? Size { get; set; }
    public int StockQuantity { get; set; }
    public decimal? Price { get; set; }
    public decimal? RentalPricePerDay { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [ConcurrencyCheck]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
