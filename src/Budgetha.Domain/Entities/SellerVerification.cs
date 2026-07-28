using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class SellerVerification : BaseAuditableEntity
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public string BusinessName { get; set; } = string.Empty;
    public string BusinessDescription { get; set; } = string.Empty;
    public string? DocumentUrl { get; set; }
    public VerificationStatus Status { get; set; } = VerificationStatus.Pending;
    public string? ReviewedBy { get; set; }
    public string? RejectionReason { get; set; }
}
