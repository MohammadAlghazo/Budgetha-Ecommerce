namespace Budgetha.Application.Common.Interfaces;

/// <summary>
/// Abstraction over DateTimeOffset.UtcNow so application logic is fully testable.
/// </summary>
public interface IDateTimeService
{
    DateTimeOffset UtcNow { get; }
}
