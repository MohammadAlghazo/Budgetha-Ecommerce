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
        CancellationToken cancellationToken,
        string? eventScope = null,
        string? eventDetail = null);

    Task QueueDeliveryReportResolutionAsync(
        Order order,
        IEnumerable<string> sellerIds,
        bool dismissed,
        string note,
        CancellationToken cancellationToken);
}
