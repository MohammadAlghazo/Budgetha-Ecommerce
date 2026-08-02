using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class Announcement : BaseAuditableEntity
{
    public string Message { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? BadgeText { get; set; }
    public string? PromoCode { get; set; }
    public int? DiscountPercent { get; set; }
    public string? LinkUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
