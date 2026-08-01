using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;

namespace Budgetha.Application.Services;

public sealed class OrderCommunicationService : IOrderCommunicationService
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public OrderCommunicationService(IApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task QueueSaleAsync(
        Order order,
        string buyerFirstName,
        IEnumerable<string> sellerIds,
        string paymentMethod,
        CancellationToken cancellationToken)
    {
        var number = ShortOrderNumber(order.Id);
        var eventKey = $"order:{order.Id}:sale-completed";

        QueueNotification(
            order.UserId,
            "Order Placed Successfully",
            $"Your order #{number} has been received.",
            "Order",
            order.Id,
            $"{eventKey}:buyer-notification");

        var buyerEmail = order.ContactEmail ?? order.User?.Email;
        if (!string.IsNullOrWhiteSpace(buyerEmail))
        {
            var safeName = WebUtility.HtmlEncode(buyerFirstName);
            var safeMethod = WebUtility.HtmlEncode(paymentMethod);
            var total = order.TotalAmount.ToString("F2", CultureInfo.InvariantCulture);
            var body = $"<h2>Order Confirmation</h2><p>Hi {safeName},</p>" +
                       $"<p>We've received your order <strong>#{number}</strong>. We will notify you once it's shipped.</p>" +
                       $"<p>Total: {total} {WebUtility.HtmlEncode(order.Currency)}<br>Payment method: {safeMethod}</p>";
            await _emailService.QueueEmailAsync(
                buyerEmail,
                $"Order Confirmation #{number}",
                body,
                $"{eventKey}:buyer-email",
                cancellationToken);
        }

        foreach (var sellerId in sellerIds.Where(id => !string.IsNullOrWhiteSpace(id)).Distinct())
        {
            QueueNotification(
                sellerId,
                "New Sale!",
                "One or more of your products have been sold.",
                "Sale",
                order.Id,
                $"{eventKey}:seller:{StableId(sellerId)}");
        }
    }

    public async Task QueueStatusAsync(
        Order order,
        string eventName,
        IEnumerable<string> sellerIds,
        CancellationToken cancellationToken)
    {
        var normalizedEvent = eventName.Trim().ToLowerInvariant();
        var number = ShortOrderNumber(order.Id);
        var eventKey = $"order:{order.Id}:{normalizedEvent}";
        var (title, message) = normalizedEvent switch
        {
            "shipped" => ("Order Shipped", $"Your order #{number} has been shipped."),
            "cancelled" => ("Order Cancelled", $"Your order #{number} has been cancelled."),
            "expired" => ("Order Expired", $"Your unpaid order #{number} expired and its stock reservation was released."),
            _ => throw new ArgumentOutOfRangeException(nameof(eventName), eventName, "Unsupported order communication event.")
        };

        QueueNotification(order.UserId, title, message, "Order", order.Id, $"{eventKey}:buyer-notification");

        var buyerEmail = order.ContactEmail ?? order.User?.Email;
        if (!string.IsNullOrWhiteSpace(buyerEmail))
        {
            await _emailService.QueueEmailAsync(
                buyerEmail,
                $"{title} #{number}",
                $"<h2>{title}</h2><p>{message}</p>",
                $"{eventKey}:buyer-email",
                cancellationToken);
        }

        foreach (var sellerId in sellerIds.Where(id => !string.IsNullOrWhiteSpace(id)).Distinct())
        {
            QueueNotification(
                sellerId,
                title,
                $"Order #{number} has been {normalizedEvent}.",
                "Order",
                order.Id,
                $"{eventKey}:seller:{StableId(sellerId)}");
        }
    }

    private void QueueNotification(
        string userId,
        string title,
        string message,
        string type,
        Guid orderId,
        string idempotencyKey)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            RelatedEntityId = orderId.ToString(),
            IdempotencyKey = idempotencyKey
        };
        _context.Notifications.Add(notification);
        _context.OutboxDeliveries.Add(new OutboxDelivery
        {
            Type = OutboxDeliveryType.RealtimeNotification,
            Recipient = userId,
            Notification = notification,
            IdempotencyKey = $"{idempotencyKey}:realtime"
        });
    }

    private static string ShortOrderNumber(Guid id) => id.ToString()[..8].ToUpperInvariant();

    private static string StableId(string value) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));
}
