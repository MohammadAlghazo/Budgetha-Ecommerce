using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Commands;

public record ShipOrderCommand(Guid OrderId, string? Carrier, string? TrackingNumber) : IRequest;
public record RejectOrderCommand(Guid OrderId, string Reason) : IRequest;
public record ConfirmOrderReceivedCommand(Guid OrderId) : IRequest;
public record ReportOrderNotReceivedCommand(Guid OrderId, string Reason) : IRequest;

internal static class FulfillmentCommandHelpers
{
    public static async Task<(Order Order, OrderFulfillment Fulfillment, string UserId)> LoadAsync(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        Guid orderId,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        if (string.IsNullOrWhiteSpace(userId)) throw new UnauthorizedAccessException();

        var order = await context.Orders
            .Include(o => o.User)
            .Include(o => o.Payment)
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Items)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Items).ThenInclude(i => i.Product)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Items).ThenInclude(i => i.Variant)
            .SingleOrDefaultAsync(o => o.Id == orderId, cancellationToken)
            ?? throw new NotFoundException(nameof(Order), orderId);

        var fulfillment = order.Fulfillments.SingleOrDefault(f => f.SellerId == userId)
            ?? throw new ForbiddenAccessException();
        return (order, fulfillment, userId);
    }

    public static void RecalculateOrderStatus(Order order)
    {
        var active = order.Fulfillments.Where(f => f.Status != FulfillmentStatus.Rejected).ToList();
        if (active.Count == 0)
        {
            order.Status = OrderStatus.Failed;
            return;
        }
        if (active.All(f => f.Status == FulfillmentStatus.Delivered))
        {
            order.Status = OrderStatus.Delivered;
            return;
        }
        if (order.Fulfillments.Any(f => f.Status == FulfillmentStatus.Rejected))
        {
            order.Status = OrderStatus.PartiallyFulfilled;
            return;
        }
        if (active.All(f => f.Status == FulfillmentStatus.Shipped || f.Status == FulfillmentStatus.Delivered))
        {
            order.Status = OrderStatus.Shipped;
            return;
        }
        order.Status = OrderStatus.Processing;
    }
}

public sealed class ShipOrderCommandHandler : IRequestHandler<ShipOrderCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IOrderCommunicationService _communications;

    public ShipOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser, IOrderCommunicationService communications)
    { _context = context; _currentUser = currentUser; _communications = communications; }

    public async Task Handle(ShipOrderCommand request, CancellationToken cancellationToken)
    {
        var (order, fulfillment, _) = await FulfillmentCommandHelpers.LoadAsync(_context, _currentUser, request.OrderId, cancellationToken);
        if (order.Payment?.Provider == PaymentProvider.CashOnDelivery && order.Payment.Status != PaymentStatus.Pending)
            throw new InvalidOperationException("This cash-on-delivery order has already been collected or closed.");
        if (fulfillment.Status != FulfillmentStatus.Processing)
            throw new InvalidOperationException("Only processing fulfillments can be shipped.");

        fulfillment.Status = FulfillmentStatus.Shipped;
        fulfillment.Carrier = string.IsNullOrWhiteSpace(request.Carrier) ? null : request.Carrier.Trim();
        fulfillment.TrackingNumber = string.IsNullOrWhiteSpace(request.TrackingNumber) ? null : request.TrackingNumber.Trim();
        fulfillment.ShippedAt = DateTimeOffset.UtcNow;
        FulfillmentCommandHelpers.RecalculateOrderStatus(order);
        await _communications.QueueStatusAsync(order, "shipped", [fulfillment.SellerId], cancellationToken, fulfillment.Id.ToString());
        await _context.SaveChangesAsync(cancellationToken);
    }
}

public sealed class RejectOrderCommandHandler : IRequestHandler<RejectOrderCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IOrderCommunicationService _communications;

    public RejectOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser, IOrderCommunicationService communications)
    { _context = context; _currentUser = currentUser; _communications = communications; }

    public async Task Handle(RejectOrderCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Reason) || request.Reason.Trim().Length < 5)
            throw new ValidationException(new[] { "A rejection reason of at least 5 characters is required." });
        var (order, fulfillment, _) = await FulfillmentCommandHelpers.LoadAsync(_context, _currentUser, request.OrderId, cancellationToken);
        if (fulfillment.Status != FulfillmentStatus.Processing)
            throw new InvalidOperationException("Only processing fulfillments can be rejected.");
        if (order.Payment?.Status == PaymentStatus.Completed && order.Payment.Provider != PaymentProvider.Mock)
            throw new InvalidOperationException("A paid fulfillment requires an admin refund before rejection.");

        fulfillment.Status = FulfillmentStatus.Rejected;
        fulfillment.RejectionReason = request.Reason.Trim();
        fulfillment.RejectedAt = DateTimeOffset.UtcNow;
        if (fulfillment.StockReleasedAt == null)
        {
            foreach (var item in fulfillment.Items.Where(i => i.Type == OrderItemType.Purchase))
            {
                if (item.Variant != null) item.Variant.StockQuantity += item.Quantity;
                else if (item.Product != null) item.Product.StockQuantity += item.Quantity;
            }
            fulfillment.StockReleasedAt = DateTimeOffset.UtcNow;
        }
        var rejectedSubtotal = fulfillment.Items.Sum(item => item.UnitPrice * item.Quantity);
        var rejectedDiscount = fulfillment.Items.Sum(item => item.DiscountAmount);
        if (order.Fulfillments.Any(f => f.Status != FulfillmentStatus.Rejected))
        {
            order.Subtotal -= rejectedSubtotal;
            order.DiscountAmount -= rejectedDiscount;
            order.TotalAmount = order.Subtotal - order.DiscountAmount + order.ShippingAmount + order.TaxAmount;
            if (order.Payment != null && order.Payment.Provider is PaymentProvider.Mock or PaymentProvider.CashOnDelivery)
                order.Payment.Amount = order.TotalAmount;
        }
        FulfillmentCommandHelpers.RecalculateOrderStatus(order);
        if (order.Fulfillments.All(f => f.Status == FulfillmentStatus.Rejected) && order.Payment != null)
            order.Payment.Status = order.Payment.Provider == PaymentProvider.Mock ? PaymentStatus.Refunded : PaymentStatus.Failed;
        await _communications.QueueStatusAsync(order, "rejected", [fulfillment.SellerId], cancellationToken,
            fulfillment.Id.ToString(), fulfillment.RejectionReason);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

public sealed class ConfirmOrderReceivedCommandHandler : IRequestHandler<ConfirmOrderReceivedCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IOrderCommunicationService _communications;

    public ConfirmOrderReceivedCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser, IOrderCommunicationService communications)
    { _context = context; _currentUser = currentUser; _communications = communications; }

    public async Task Handle(ConfirmOrderReceivedCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();
        var order = await _context.Orders.Include(o => o.Payment).Include(o => o.Fulfillments)
            .SingleOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken)
            ?? throw new NotFoundException(nameof(Order), request.OrderId);
        var active = order.Fulfillments.Where(f => f.Status != FulfillmentStatus.Rejected).ToList();
        if (active.Count == 0 || !active.All(f => f.Status == FulfillmentStatus.Shipped || f.Status == FulfillmentStatus.Delivered))
            throw new InvalidOperationException("The order can only be confirmed after it has been shipped.");
        if (active.All(f => f.Status == FulfillmentStatus.Delivered))
            throw new InvalidOperationException("This order has already been confirmed as received.");
        foreach (var fulfillment in active)
        {
            fulfillment.Status = FulfillmentStatus.Delivered;
            fulfillment.DeliveredAt ??= DateTimeOffset.UtcNow;
        }
        if (order.Payment?.Provider == PaymentProvider.CashOnDelivery)
            order.Payment.Status = PaymentStatus.Completed;
        FulfillmentCommandHelpers.RecalculateOrderStatus(order);
        await _communications.QueueStatusAsync(order, "delivered", active.Select(f => f.SellerId), cancellationToken);
        await _communications.QueueStatusAsync(order, "received", active.Select(f => f.SellerId), cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

public sealed class ReportOrderNotReceivedCommandHandler : IRequestHandler<ReportOrderNotReceivedCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IOrderCommunicationService _communications;

    public ReportOrderNotReceivedCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser, IOrderCommunicationService communications)
    { _context = context; _currentUser = currentUser; _communications = communications; }

    public async Task Handle(ReportOrderNotReceivedCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Reason) || request.Reason.Trim().Length < 5)
            throw new ValidationException(new[] { "Please explain why the order was not received." });
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();
        var order = await _context.Orders.Include(o => o.Fulfillments)
            .SingleOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken)
            ?? throw new NotFoundException(nameof(Order), request.OrderId);
        if (!order.Fulfillments.Any(f => f.Status == FulfillmentStatus.Shipped || f.Status == FulfillmentStatus.Delivered))
            throw new InvalidOperationException("A delivery report can only be submitted after shipping.");
        var existing = await _context.DeliveryReports.AnyAsync(r => r.OrderId == order.Id && r.BuyerId == userId && r.Status == DeliveryReportStatus.Open, cancellationToken);
        if (existing) throw new InvalidOperationException("An open delivery report already exists for this order.");
        _context.DeliveryReports.Add(new DeliveryReport { OrderId = order.Id, BuyerId = userId, Reason = request.Reason.Trim(), WasReceived = false });
        await _communications.QueueStatusAsync(order, "not-received", order.Fulfillments.Select(f => f.SellerId), cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
