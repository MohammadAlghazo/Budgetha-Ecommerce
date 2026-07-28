using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class Review : BaseAuditableEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
}
