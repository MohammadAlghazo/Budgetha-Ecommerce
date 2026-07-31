using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class PendingImageDeletion : BaseEntity
{
    public string PublicId { get; set; } = string.Empty;
    public DateTimeOffset QueuedAt { get; set; } = DateTimeOffset.UtcNow;
    public int Attempts { get; set; }
    public DateTimeOffset? LastAttemptAt { get; set; }
}
