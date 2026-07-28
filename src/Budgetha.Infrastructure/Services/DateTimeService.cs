using Budgetha.Application.Common.Interfaces;

namespace Budgetha.Infrastructure.Services;

public class DateTimeService : IDateTimeService
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
