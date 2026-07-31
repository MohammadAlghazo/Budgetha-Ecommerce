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

    public CancelOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null) throw new NotFoundException(nameof(Order), request.OrderId);

        if (order.Status == OrderStatus.Cancelled || order.Status == OrderStatus.Delivered)
            return false;

        order.Status = OrderStatus.Cancelled;

        // Restock
        foreach (var item in order.Items)
        {
            var product = await _context.Products.FindAsync(new object[] { item.ProductId }, cancellationToken);
            if (product != null)
            {
                product.StockQuantity += item.Quantity;
                _context.Products.Update(product);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
