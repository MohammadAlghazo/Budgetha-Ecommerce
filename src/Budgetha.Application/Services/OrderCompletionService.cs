using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Services;

public sealed class OrderCompletionService : IOrderCompletionService
{
    private readonly IApplicationDbContext _context;
    private readonly IOrderCommunicationService _communications;

    public OrderCompletionService(IApplicationDbContext context, IOrderCommunicationService communications)
    {
        _context = context;
        _communications = communications;
    }

    public async Task CompletePayPalAsync(
        Order order,
        Payment payment,
        string captureId,
        string? webhookEventId,
        CancellationToken cancellationToken)
    {
        if (payment.Status == PaymentStatus.Completed)
            return;
        if (payment.Provider != PaymentProvider.PayPal || order.Status != OrderStatus.Pending)
            throw new InvalidOperationException("Only a pending PayPal order can be completed.");

        payment.Status = PaymentStatus.Completed;
        payment.ExternalCaptureId = captureId;
        if (!string.IsNullOrWhiteSpace(webhookEventId))
            payment.LastWebhookEventId = webhookEventId;
        order.Status = OrderStatus.Processing;
        order.ReservationExpiresAt = null;

        await RemoveUnchangedOrderItemsFromCartAsync(order, cancellationToken);
        var sellerIds = order.Items
            .Select(item => item.Product?.SellerId)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Cast<string>();
        await _communications.QueueSaleAsync(
            order,
            order.User?.FirstName ?? string.Empty,
            sellerIds,
            "PayPal",
            cancellationToken);
    }

    private async Task RemoveUnchangedOrderItemsFromCartAsync(Order order, CancellationToken cancellationToken)
    {
        var cartItems = await _context.CartItems
            .Where(item => item.Cart.UserId == order.UserId)
            .ToListAsync(cancellationToken);
        foreach (var orderItem in order.Items)
        {
            var cartItem = cartItems.FirstOrDefault(item =>
                item.ProductId == orderItem.ProductId && item.VariantId == orderItem.VariantId &&
                item.Quantity == orderItem.Quantity && item.Type == orderItem.Type &&
                item.RentalStartDate == orderItem.RentalStartDate && item.RentalEndDate == orderItem.RentalEndDate &&
                item.Color == orderItem.Color && item.Size == orderItem.Size);
            if (cartItem == null)
                continue;

            _context.CartItems.Remove(cartItem);
            cartItems.Remove(cartItem);
        }
    }
}
