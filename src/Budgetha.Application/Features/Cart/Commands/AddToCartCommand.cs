using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public record AddToCartCommand(Guid ProductId, int Quantity, OrderItemType Type, DateOnly? RentalStartDate, DateOnly? RentalEndDate) : IRequest;

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddToCartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null)
        {
            cart = new Domain.Entities.Cart { UserId = userId };
            _context.Carts.Add(cart);
        }

        var product = await _context.Products.FindAsync(new object[] { request.ProductId }, cancellationToken);
        if (product == null || !product.IsActive)
            throw new NotFoundException(nameof(Product), request.ProductId);

        if (product.StockQuantity < request.Quantity)
            throw new InvalidOperationException("Not enough stock available.");

        // Check if item already exists in cart with same type (and dates if rental)
        var existingItem = cart.Items.FirstOrDefault(i => 
            i.ProductId == request.ProductId && 
            i.Type == request.Type && 
            i.RentalStartDate == request.RentalStartDate && 
            i.RentalEndDate == request.RentalEndDate);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
            if (existingItem.Quantity > product.StockQuantity)
                throw new InvalidOperationException("Cannot add more than available stock.");
        }
        else
        {
            var newItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Type = request.Type,
                RentalStartDate = request.RentalStartDate,
                RentalEndDate = request.RentalEndDate
            };
            cart.Items.Add(newItem);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
