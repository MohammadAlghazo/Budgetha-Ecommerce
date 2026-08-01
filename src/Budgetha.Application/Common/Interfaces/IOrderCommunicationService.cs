using Budgetha.Domain.Entities;

namespace Budgetha.Application.Common.Interfaces;

public interface IOrderCommunicationService
{
    Task QueueSaleAsync(
        Order order,
        string buyerFirstName,
        IEnumerable<string> sellerIds,
        string paymentMethod,
        CancellationToken cancellationToken);

    Task QueueStatusAsync(
        Order order,
        string eventName,
        IEnumerable<string> sellerIds,
        CancellationToken cancellationToken);
}
