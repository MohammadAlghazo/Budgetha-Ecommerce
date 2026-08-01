using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Commands;

public record CancelOrderCommand(Guid OrderId) : IRequest<bool>;

public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;
    private readonly IOrderCommunicationService _communications;

    public CancelOrderCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IIdentityService identityService,
        IOrderCommunicationService communications)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
        _communications = communications;
    }

    public async Task<bool> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.Payment)
            .Include(o => o.User)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .Include(o => o.Items)
            .ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null) throw new NotFoundException(nameof(Order), request.OrderId);

        var userId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException();

        var roles = await _identityService.GetRolesAsync(userId);
        var isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");
        if (!isAdmin && order.UserId != userId)
            throw new ForbiddenAccessException();

        if (order.Status == OrderStatus.Cancelled || order.Status == OrderStatus.Delivered ||
            order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Refunded ||
            order.Status == OrderStatus.Failed)
            return false;

        if (order.Payment?.Status is PaymentStatus.Completed or PaymentStatus.Processing)
            throw new InvalidOperationException("A paid order cannot be cancelled until a refund has been processed.");

        order.Status = OrderStatus.Cancelled;
        if (order.Payment != null)
            order.Payment.Status = PaymentStatus.Failed;

        // Purchase stock was reserved at order creation; rental stock was never decremented.
        foreach (var item in order.Items)
        {
            if (item.Type == OrderItemType.Purchase)
            {
                if (item.Variant != null)
                    item.Variant.StockQuantity += item.Quantity;
                else if (item.Product != null)
                    item.Product.StockQuantity += item.Quantity;
            }
        }

        var sellerIds = order.Items.Select(item => item.Product.SellerId)
            .Where(id => !string.IsNullOrWhiteSpace(id)).Cast<string>();
        await _communications.QueueStatusAsync(order, "cancelled", sellerIds, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
