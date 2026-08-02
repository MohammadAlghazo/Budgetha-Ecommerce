using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public class AddToCartCommand : IRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public OrderItemType Type { get; set; }
    public DateOnly? RentalStartDate { get; set; }
    public DateOnly? RentalEndDate { get; set; }
    public Guid? VariantId { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
}

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IInventoryLockService _inventoryLockService;

    public AddToCartCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IInventoryLockService inventoryLockService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _inventoryLockService = inventoryLockService;
    }

    public async Task Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        CartRules.ValidateQuantity(request.Quantity);

        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        if (!Guid.TryParse(userId, out var userLockId))
            throw new InvalidOperationException("The current user ID is invalid.");

        await using var cartTransaction = await _inventoryLockService.BeginTransactionAsync([userLockId], cancellationToken);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null)
        {
            cart = new Domain.Entities.Cart { UserId = userId };
            _context.Carts.Add(cart);
        }

        var product = await _context.Products
            .Include(p => p.Variants)
            .AsNoTracking()
            .SingleOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product == null || !product.IsActive || product.ApprovalStatus != ApprovalStatus.Approved)
            throw new NotFoundException(nameof(Product), request.ProductId);

        var variant = InventoryRules.ValidateVariant(product, request.VariantId, request.Color, request.Size);

        // Check if item already exists in cart with same type, variants, and dates
        var existingItem = cart.Items.FirstOrDefault(i => 
            i.ProductId == request.ProductId &&
            i.VariantId == request.VariantId &&
            i.Type == request.Type && 
            i.RentalStartDate == request.RentalStartDate && 
            i.RentalEndDate == request.RentalEndDate &&
            i.Color == (variant?.Color ?? request.Color) &&
            i.Size == (variant?.Size ?? request.Size));

        if (existingItem != null)
        {
            var mergedQuantity = checked(existingItem.Quantity + request.Quantity);
            CartRules.ValidateQuantity(mergedQuantity);

            if (request.Type == OrderItemType.Purchase)
            {
                if (mergedQuantity > (variant?.StockQuantity ?? product.StockQuantity))
                    throw new InvalidOperationException("Not enough stock available.");
            }
            else if (request.Type == OrderItemType.Rental)
            {
                var totalRented = await InventoryRules.GetMaximumReservedQuantityAsync(
                    _context, request.ProductId, variant?.Id, request.RentalStartDate!.Value,
                    request.RentalEndDate!.Value, cancellationToken);
                if (mergedQuantity > (variant?.StockQuantity ?? product.StockQuantity) - totalRented)
                    throw new InvalidOperationException("Not enough rental stock available.");
            }

            await _context.CartItems
                .Where(ci => ci.Id == existingItem.Id)
                .ExecuteUpdateAsync(s => s.SetProperty(ci => ci.Quantity, mergedQuantity), cancellationToken);
            await cartTransaction.CommitAsync(cancellationToken);
            return;
        }
        else
        {
            var newItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                VariantId = variant?.Id,
                Quantity = request.Quantity,
                Type = request.Type,
                RentalStartDate = request.RentalStartDate,
                RentalEndDate = request.RentalEndDate,
                Color = variant?.Color ?? request.Color,
                Size = variant?.Size ?? request.Size
            };
            _context.CartItems.Add(newItem);
        }

        var quantity = existingItem?.Quantity ?? request.Quantity;
        if (request.Type == OrderItemType.Purchase)
        {
            if (quantity > (variant?.StockQuantity ?? product.StockQuantity))
                throw new InvalidOperationException("Not enough stock available.");
        }
        else if (request.Type == OrderItemType.Rental)
        {
            if (!product.IsAvailableForRent)
                throw new InvalidOperationException("This product is not available for rent.");

            CartRules.ValidateRentalDates(request.RentalStartDate, request.RentalEndDate);

            var totalRented = await InventoryRules.GetMaximumReservedQuantityAsync(
                _context, request.ProductId, variant?.Id, request.RentalStartDate!.Value,
                request.RentalEndDate!.Value, cancellationToken);

            if (quantity > (variant?.StockQuantity ?? product.StockQuantity) - totalRented)
                throw new InvalidOperationException("Not enough items available for the selected dates.");
        }
        else
        {
            throw new InvalidOperationException("Invalid cart item type.");
        }

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            await cartTransaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateException ex)
        {
            var entityTypes = string.Join(", ", ex.Entries.Select(e => e.Entity.GetType().Name));
            throw new InvalidOperationException($"DB Error ({entityTypes}): {ex.InnerException?.Message ?? ex.Message}");
        }
    }
}
