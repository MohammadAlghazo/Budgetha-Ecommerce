using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Orders.Commands;

public record UpdateOrderStatusCommand(Guid OrderId, OrderStatus Status) : IRequest<bool>;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;
    private readonly IOrderCommunicationService _communications;

    public UpdateOrderStatusCommandHandler(
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

    public async Task<bool> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .Include(o => o.Items)
            .ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
            throw new NotFoundException(nameof(Domain.Entities.Order), request.OrderId);

        var userId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException();

        var roles = await _identityService.GetRolesAsync(userId);
        var isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");
        if (!isAdmin && !order.Items.All(item => item.Product.SellerId == userId))
            throw new ForbiddenAccessException();

        var validTransition = (order.Status, request.Status) switch
        {
            (OrderStatus.Pending, OrderStatus.Processing) => true,
            (OrderStatus.Processing, OrderStatus.Shipped) => true,
            (OrderStatus.Shipped, OrderStatus.Delivered) => true,
            (OrderStatus.Pending, OrderStatus.Failed) => true,
            (OrderStatus.Processing, OrderStatus.Failed) => true,
            _ when order.Status == request.Status => true,
            _ => false
        };
        if (!validTransition)
            throw new InvalidOperationException($"Order status cannot transition from {order.Status} to {request.Status}.");

        var previousStatus = order.Status;
        if (previousStatus == request.Status)
            return true;

        order.Status = request.Status;
        if (previousStatus != OrderStatus.Failed && request.Status == OrderStatus.Failed)
        {
            foreach (var item in order.Items.Where(item => item.Type == OrderItemType.Purchase))
            {
                if (item.Variant != null)
                    item.Variant.StockQuantity += item.Quantity;
                else
                    item.Product.StockQuantity += item.Quantity;
            }
        }
        if (request.Status == OrderStatus.Shipped)
        {
            var sellerIds = order.Items.Select(item => item.Product.SellerId)
                .Where(id => !string.IsNullOrWhiteSpace(id)).Cast<string>();
            await _communications.QueueStatusAsync(order, "shipped", sellerIds, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
