using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class PromoCode : BaseEntity
{
    public string Code { get; set; } = null!;
    public decimal DiscountPercentage { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public string Scope { get; set; } = "Platform";
    public string? SellerId { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
}
