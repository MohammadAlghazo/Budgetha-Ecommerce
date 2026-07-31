namespace Budgetha.Application.Features.Wishlist.Queries;

public record WishlistItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string? ProductImage,
    string Category,
    decimal Price,
    int Stock,
    bool InStock
);
