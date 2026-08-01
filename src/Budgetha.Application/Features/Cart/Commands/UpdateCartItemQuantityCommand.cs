using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public class UpdateCartItemQuantityCommand : IRequest
{
    public Guid ItemId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateCartItemQuantityCommandHandler : IRequestHandler<UpdateCartItemQuantityCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCartItemQuantityCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(UpdateCartItemQuantityCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .Include(i => i.Product)
            .ThenInclude(p => p.Variants)
            .FirstOrDefaultAsync(i => i.Id == request.ItemId && i.Cart.UserId == userId, cancellationToken);

        if (cartItem == null)
            throw new NotFoundException(nameof(CartItem), request.ItemId);

        if (request.Quantity <= 0)
        {
            _context.CartItems.Remove(cartItem);
        }
        else
        {
            CartRules.ValidateQuantity(request.Quantity);

            var variant = InventoryRules.ValidateVariant(cartItem.Product, cartItem.VariantId, cartItem.Color, cartItem.Size);
            var availableStock = variant?.StockQuantity ?? cartItem.Product.StockQuantity;
            if (cartItem.Type == OrderItemType.Rental)
            {
                if (!cartItem.Product.IsAvailableForRent)
                    throw new InvalidOperationException("This product is not available for rent.");

                CartRules.ValidateRentalDates(cartItem.RentalStartDate, cartItem.RentalEndDate);
                var totalRented = await InventoryRules.GetMaximumReservedQuantityAsync(
                    _context, cartItem.ProductId, variant?.Id, cartItem.RentalStartDate!.Value,
                    cartItem.RentalEndDate!.Value, cancellationToken);
                availableStock -= totalRented;
            }

            if (availableStock < request.Quantity)
                throw new InvalidOperationException("Not enough stock available.");
                
            cartItem.Quantity = request.Quantity;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
