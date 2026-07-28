namespace Budgetha.Domain.Common;

/// <summary>
/// Base type for all persistent entities. Carries the primary key and a
/// collection of domain events raised during the entity's lifetime.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    private readonly List<BaseEvent> _domainEvents = new();

    /// <summary>Domain events queued for dispatch after the entity is persisted.</summary>
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent) => _domainEvents.Add(domainEvent);

    public void RemoveDomainEvent(BaseEvent domainEvent) => _domainEvents.Remove(domainEvent);

    public void ClearDomainEvents() => _domainEvents.Clear();
}
