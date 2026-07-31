using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public record SyncCartItemDto(
    Guid ProductId,
    int Quantity,
    string? Color,
    string? Size,
    OrderItemType Type = OrderItemType.Purchase,
    DateOnly? RentalStartDate = null,
    DateOnly? RentalEndDate = null);

public record SyncCartCommand(List<SyncCartItemDto> Items) : IRequest;

public class SyncCartCommandHandler : IRequestHandler<SyncCartCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public SyncCartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(SyncCartCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        if (request.Items == null)
            throw new InvalidOperationException("Cart items are required.");

        foreach (var item in request.Items)
            CartRules.ValidateQuantity(item.Quantity);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null)
        {
            cart = new Budgetha.Domain.Entities.Cart { UserId = userId };
            _context.Carts.Add(cart);
        }

        var syncedItems = request.Items
            .GroupBy(i => new { i.ProductId, i.Color, i.Size, i.Type, i.RentalStartDate, i.RentalEndDate })
            .Select(group => new SyncCartItemDto(
                group.Key.ProductId,
                group.Sum(i => i.Quantity),
                group.Key.Color,
                group.Key.Size,
                group.Key.Type,
                group.Key.RentalStartDate,
                group.Key.RentalEndDate))
            .ToList();

        foreach (var itemDto in syncedItems)
        {
            CartRules.ValidateQuantity(itemDto.Quantity);

            var product = await _context.Products.FindAsync(new object[] { itemDto.ProductId }, cancellationToken);
            if (product == null || !product.IsActive || product.ApprovalStatus != ApprovalStatus.Approved)
                throw new InvalidOperationException($"Product {itemDto.ProductId} is not available.");

            var existingItem = cart.Items.FirstOrDefault(i => 
                i.ProductId == itemDto.ProductId && 
                i.Color == itemDto.Color && 
                i.Size == itemDto.Size &&
                i.Type == itemDto.Type &&
                i.RentalStartDate == itemDto.RentalStartDate &&
                i.RentalEndDate == itemDto.RentalEndDate);

            // Taking the larger synchronized quantity converges on retries without reducing server state.
            var mergedQuantity = Math.Max(existingItem?.Quantity ?? 0, itemDto.Quantity);
            CartRules.ValidateQuantity(mergedQuantity);

            if (itemDto.Type == OrderItemType.Purchase)
            {
                if (mergedQuantity > product.StockQuantity)
                    throw new InvalidOperationException($"Not enough stock available for product {itemDto.ProductId}.");
            }
            else if (itemDto.Type == OrderItemType.Rental)
            {
                if (!product.IsAvailableForRent)
                    throw new InvalidOperationException($"Product {itemDto.ProductId} is not available for rent.");

                CartRules.ValidateRentalDates(itemDto.RentalStartDate, itemDto.RentalEndDate);

                var totalRented = await _context.OrderItems
                    .Where(oi => oi.ProductId == itemDto.ProductId &&
                                 oi.Type == OrderItemType.Rental &&
                                 oi.Order != null &&
                                 oi.Order.Status != OrderStatus.Cancelled &&
                                 oi.Order.Status != OrderStatus.Failed &&
                                 oi.RentalStartDate <= itemDto.RentalEndDate &&
                                 oi.RentalEndDate >= itemDto.RentalStartDate)
                    .SumAsync(oi => oi.Quantity, cancellationToken);

                if (mergedQuantity > product.StockQuantity - totalRented)
                    throw new InvalidOperationException($"Not enough rental stock available for product {itemDto.ProductId}.");
            }
            else
            {
                throw new InvalidOperationException("Invalid cart item type.");
            }

            if (existingItem != null)
            {
                existingItem.Quantity = mergedQuantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = mergedQuantity,
                    Color = itemDto.Color,
                    Size = itemDto.Size,
                    Type = itemDto.Type,
                    RentalStartDate = itemDto.RentalStartDate,
                    RentalEndDate = itemDto.RentalEndDate
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
