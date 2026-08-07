using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public class SyncCartItemDto
{
    public Guid ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public int Quantity { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public OrderItemType Type { get; set; } = OrderItemType.Purchase;
    public DateOnly? RentalStartDate { get; set; }
    public DateOnly? RentalEndDate { get; set; }
}

public class SyncCartCommand : IRequest
{
    public List<SyncCartItemDto> Items { get; set; } = new();
}

public class SyncCartCommandHandler : IRequestHandler<SyncCartCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IInventoryLockService _inventoryLockService;

    public SyncCartCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IInventoryLockService inventoryLockService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _inventoryLockService = inventoryLockService;
    }

    public async Task Handle(SyncCartCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        if (!Guid.TryParse(userId, out var userLockId))
            throw new InvalidOperationException("The current user ID is invalid.");

        await using var cartTransaction = await _inventoryLockService.BeginTransactionAsync([userLockId], cancellationToken);

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
            .Select(group => new SyncCartItemDto
            {
                ProductId = group.Key.ProductId,
                VariantId = group.Key.VariantId,
                Quantity = group.Sum(i => i.Quantity),
                Color = group.First().Color,
                Size = group.First().Size,
                Type = group.Key.Type,
                RentalStartDate = group.Key.RentalStartDate,
                RentalEndDate = group.Key.RentalEndDate
            })
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
                var availableStock = variant?.StockQuantity ?? product.StockQuantity;
                if (mergedQuantity > availableStock)
                    mergedQuantity = availableStock;
            }
            else if (itemDto.Type == OrderItemType.Rental)
            {
                if (!product.IsAvailableForRent)
                    throw new InvalidOperationException($"Product {itemDto.ProductId} is not available for rent.");

                CartRules.ValidateRentalDates(itemDto.RentalStartDate, itemDto.RentalEndDate);

                var totalRented = await InventoryRules.GetMaximumReservedQuantityAsync(
                    _context, itemDto.ProductId, variant?.Id, itemDto.RentalStartDate!.Value,
                    itemDto.RentalEndDate!.Value, cancellationToken);

                var availableStock = (variant?.StockQuantity ?? product.StockQuantity) - totalRented;
                if (mergedQuantity > availableStock)
                    mergedQuantity = availableStock;
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
        await cartTransaction.CommitAsync(cancellationToken);
    }
}
