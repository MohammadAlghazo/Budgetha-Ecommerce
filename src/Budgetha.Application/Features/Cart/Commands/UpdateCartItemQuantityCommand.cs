using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public record UpdateCartItemQuantityCommand(Guid ItemId, int Quantity) : IRequest;

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

            var availableStock = cartItem.Product.StockQuantity;
            if (cartItem.Type == OrderItemType.Rental)
            {
                if (!cartItem.Product.IsAvailableForRent)
                    throw new InvalidOperationException("This product is not available for rent.");

                CartRules.ValidateRentalDates(cartItem.RentalStartDate, cartItem.RentalEndDate);
                var totalRented = await _context.OrderItems
                    .Where(oi => oi.ProductId == cartItem.ProductId &&
                                 oi.Type == OrderItemType.Rental &&
                                 oi.Order != null &&
                                 oi.Order.Status != OrderStatus.Cancelled &&
                                 oi.Order.Status != OrderStatus.Failed &&
                                 oi.RentalStartDate <= cartItem.RentalEndDate &&
                                 oi.RentalEndDate >= cartItem.RentalStartDate)
                    .SumAsync(oi => oi.Quantity, cancellationToken);
                availableStock -= totalRented;
            }

            if (availableStock < request.Quantity)
                throw new InvalidOperationException("Not enough stock available.");
                
            cartItem.Quantity = request.Quantity;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
