using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class PendingImageUpload : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;
}
