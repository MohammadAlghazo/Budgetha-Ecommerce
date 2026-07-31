using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public record AddToCartCommand(Guid ProductId, int Quantity, OrderItemType Type, DateOnly? RentalStartDate, DateOnly? RentalEndDate, string? Color = null, string? Size = null) : IRequest;

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
        CartRules.ValidateQuantity(request.Quantity);

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
        if (product == null || !product.IsActive || product.ApprovalStatus != ApprovalStatus.Approved)
            throw new NotFoundException(nameof(Product), request.ProductId);

        // Check if item already exists in cart with same type, variants, and dates
        var existingItem = cart.Items.FirstOrDefault(i => 
            i.ProductId == request.ProductId && 
            i.Type == request.Type && 
            i.RentalStartDate == request.RentalStartDate && 
            i.RentalEndDate == request.RentalEndDate &&
            i.Color == request.Color &&
            i.Size == request.Size);

        if (existingItem != null)
        {
            var mergedQuantity = checked(existingItem.Quantity + request.Quantity);
            CartRules.ValidateQuantity(mergedQuantity);
            existingItem.Quantity = mergedQuantity;
        }
        else
        {
            var newItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Type = request.Type,
                RentalStartDate = request.RentalStartDate,
                RentalEndDate = request.RentalEndDate,
                Color = request.Color,
                Size = request.Size
            };
            cart.Items.Add(newItem);
        }

        var quantity = existingItem?.Quantity ?? request.Quantity;
        if (request.Type == OrderItemType.Purchase)
        {
            if (quantity > product.StockQuantity)
                throw new InvalidOperationException("Not enough stock available.");
        }
        else if (request.Type == OrderItemType.Rental)
        {
            if (!product.IsAvailableForRent)
                throw new InvalidOperationException("This product is not available for rent.");

            CartRules.ValidateRentalDates(request.RentalStartDate, request.RentalEndDate);

            var totalRented = await _context.OrderItems
                .Where(oi => oi.ProductId == request.ProductId &&
                             oi.Type == OrderItemType.Rental &&
                             oi.Order != null &&
                             oi.Order.Status != OrderStatus.Cancelled &&
                             oi.Order.Status != OrderStatus.Failed &&
                             oi.RentalStartDate <= request.RentalEndDate &&
                             oi.RentalEndDate >= request.RentalStartDate)
                .SumAsync(oi => oi.Quantity, cancellationToken);

            if (quantity > product.StockQuantity - totalRented)
                throw new InvalidOperationException("Not enough items available for the selected dates.");
        }
        else
        {
            throw new InvalidOperationException("Invalid cart item type.");
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
