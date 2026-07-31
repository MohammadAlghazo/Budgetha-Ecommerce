using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class Product : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal? RentalPricePerDay { get; set; }
    public int StockQuantity { get; set; }
    public string Brand { get; set; } = "Generic";
    public string? ThumbnailUrl { get; set; }
    public string? ThumbnailPublicId { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsAvailableForRent { get; set; }
    public bool IsFeatured { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Approved;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string SellerId { get; set; } = string.Empty;
    public ApplicationUser Seller { get; set; } = null!;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<ProductColor> Colors { get; set; } = new List<ProductColor>();
    public ICollection<ProductSize> Sizes { get; set; } = new List<ProductSize>();
    public ICollection<ProductSpec> Specs { get; set; } = new List<ProductSpec>();
    public ICollection<ProductFeature> Features { get; set; } = new List<ProductFeature>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();

    [System.ComponentModel.DataAnnotations.Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
