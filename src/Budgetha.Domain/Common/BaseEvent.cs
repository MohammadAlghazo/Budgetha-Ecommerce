using MediatR;

namespace Budgetha.Domain.Common;

public abstract class BaseEvent : INotification
{
    public DateTimeOffset OccurredOn { get; } = DateTimeOffset.UtcNow;
}
