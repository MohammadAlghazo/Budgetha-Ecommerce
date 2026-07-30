using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class Announcement : BaseAuditableEntity
{
    public string Message { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
