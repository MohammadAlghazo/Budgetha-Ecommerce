using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Wishlist.Queries;

public record GetWishlistQuery : IRequest<List<WishlistItemDto>>;

public class GetWishlistQueryHandler : IRequestHandler<GetWishlistQuery, List<WishlistItemDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetWishlistQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<WishlistItemDto>> Handle(GetWishlistQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var wishlistItems = await _context.Wishlists
            .Include(w => w.Product)
            .Where(w => w.UserId == userId)
            .Select(w => new WishlistItemDto(
                w.Id,
                w.ProductId,
                w.Product.Name,
                w.Product.Images.FirstOrDefault() != null ? w.Product.Images.FirstOrDefault()!.Url : null,
                w.Product.Category != null ? w.Product.Category.Name : string.Empty,
                w.Product.Price,
                w.Product.StockQuantity,
                w.Product.StockQuantity > 0
            ))
            .ToListAsync(cancellationToken);

        return wishlistItems;
    }
}
