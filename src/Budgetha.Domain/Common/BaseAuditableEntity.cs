namespace Budgetha.Domain.Common;

/// <summary>
/// Base type for entities that require audit tracking (who created/modified and when).
/// Audit fields are populated automatically by the persistence layer's SaveChanges interceptor.
/// </summary>
public abstract class BaseAuditableEntity : BaseEntity
{
    public DateTimeOffset Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTimeOffset LastModified { get; set; }

    public string? LastModifiedBy { get; set; }
}
