using Budgetha.Domain.Entities;

namespace Budgetha.Application.Common.Interfaces;

public interface IOrderCompletionService
{
    Task CompletePayPalAsync(
        Order order,
        Payment payment,
        string captureId,
        string? webhookEventId,
        CancellationToken cancellationToken);
}
