using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class PromoCodeUsage : BaseEntity
{
    public Guid PromoCodeId { get; set; }
    public PromoCode PromoCode { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public DateTime UsageDate { get; set; } = DateTime.UtcNow;
}
