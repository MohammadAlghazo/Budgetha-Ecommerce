namespace Budgetha.Application.Common.Interfaces;




public interface IDateTimeService
{
    DateTimeOffset UtcNow { get; }
}
