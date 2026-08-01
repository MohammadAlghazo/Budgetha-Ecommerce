using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public record SyncCartItemDto(
    Guid ProductId,
    Guid? VariantId,
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
            .GroupBy(i => new { i.ProductId, i.VariantId, i.Type, i.RentalStartDate, i.RentalEndDate })
            .Select(group => new SyncCartItemDto(
                group.Key.ProductId,
                group.Key.VariantId,
                group.Sum(i => i.Quantity),
                group.First().Color,
                group.First().Size,
                group.Key.Type,
                group.Key.RentalStartDate,
                group.Key.RentalEndDate))
            .ToList();

        foreach (var itemDto in syncedItems)
        {
            CartRules.ValidateQuantity(itemDto.Quantity);

            var product = await _context.Products
                .Include(p => p.Variants)
                .SingleOrDefaultAsync(p => p.Id == itemDto.ProductId, cancellationToken);
            if (product == null || !product.IsActive || product.ApprovalStatus != ApprovalStatus.Approved)
                continue;

            var variant = InventoryRules.ValidateVariant(product, itemDto.VariantId, itemDto.Color, itemDto.Size);

            var existingItem = cart.Items.FirstOrDefault(i => 
                i.ProductId == itemDto.ProductId && 
                i.VariantId == itemDto.VariantId &&
                i.Type == itemDto.Type &&
                i.RentalStartDate == itemDto.RentalStartDate &&
                i.RentalEndDate == itemDto.RentalEndDate);

            // Taking the larger synchronized quantity converges on retries without reducing server state.
            var mergedQuantity = Math.Max(existingItem?.Quantity ?? 0, itemDto.Quantity);
            CartRules.ValidateQuantity(mergedQuantity);

            if (itemDto.Type == OrderItemType.Purchase)
            {
                if (mergedQuantity > (variant?.StockQuantity ?? product.StockQuantity))
                    throw new InvalidOperationException($"Not enough stock available for product {itemDto.ProductId}.");
            }
            else if (itemDto.Type == OrderItemType.Rental)
            {
                if (!product.IsAvailableForRent)
                    throw new InvalidOperationException($"Product {itemDto.ProductId} is not available for rent.");

                CartRules.ValidateRentalDates(itemDto.RentalStartDate, itemDto.RentalEndDate);

                var totalRented = await InventoryRules.GetMaximumReservedQuantityAsync(
                    _context, itemDto.ProductId, variant?.Id, itemDto.RentalStartDate!.Value,
                    itemDto.RentalEndDate!.Value, cancellationToken);

                if (mergedQuantity > (variant?.StockQuantity ?? product.StockQuantity) - totalRented)
                    throw new InvalidOperationException($"Not enough rental stock available for product {itemDto.ProductId}.");
            }
            else
            {
                throw new InvalidOperationException("Invalid cart item type.");
            }

            if (existingItem != null)
            {
                existingItem.Quantity = mergedQuantity;
                existingItem.Color = variant?.Color;
                existingItem.Size = variant?.Size;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = itemDto.ProductId,
                    VariantId = variant?.Id,
                    Quantity = mergedQuantity,
                    Color = variant?.Color,
                    Size = variant?.Size,
                    Type = itemDto.Type,
                    RentalStartDate = itemDto.RentalStartDate,
                    RentalEndDate = itemDto.RentalEndDate
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
