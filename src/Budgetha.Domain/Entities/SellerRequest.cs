using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class SellerRequest : BaseAuditableEntity
{
    public string UserId { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; 
    public string? Reason { get; set; }
}
