using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class Notification : BaseAuditableEntity
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // e.g. "Order", "System", "Sale"
    public bool IsRead { get; set; }
    public string? RelatedEntityId { get; set; } // e.g. OrderId or ProductId

    public virtual ApplicationUser? User { get; set; }
}
