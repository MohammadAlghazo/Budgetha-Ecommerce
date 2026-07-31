using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Queries;

public record GetCartQuery : IRequest<CartDto>;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCartQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .Include(c => c.Items)
            .ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null)
        {
            // Create cart for user if not exists
            cart = new Domain.Entities.Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var items = cart.Items.Select(i => new CartItemDto(
            i.Id,
            i.ProductId,
            i.VariantId,
            i.Product.Name,
            i.Product.Images.FirstOrDefault() != null ? i.Product.Images.FirstOrDefault()!.Url : null,
            i.Product.Category != null ? i.Product.Category.Name : string.Empty,
            GetItemPrice(i),
            i.Quantity,
            i.Variant?.StockQuantity ?? i.Product.StockQuantity,
            i.Type,
            i.RentalStartDate,
            i.RentalEndDate,
            i.Color,
            i.Size
        )).ToList();

        return new CartDto(cart.Id, items);
    }

    private static decimal GetItemPrice(Domain.Entities.CartItem item)
    {
        var price = item.Variant?.Price ?? item.Product.Price;
        if (item.Type == Domain.Enums.OrderItemType.Rental &&
            item.RentalStartDate.HasValue && item.RentalEndDate.HasValue)
        {
            var days = item.RentalEndDate.Value.DayNumber - item.RentalStartDate.Value.DayNumber;
            price = (item.Variant?.RentalPricePerDay ?? item.Product.RentalPricePerDay ?? price) * days;
        }

        return price;
    }
}
