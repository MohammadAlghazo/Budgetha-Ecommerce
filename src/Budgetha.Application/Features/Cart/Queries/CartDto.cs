using Budgetha.Domain.Enums;

namespace Budgetha.Application.Features.Cart.Queries;

public record CartItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string? ProductImage,
    string Category,
    decimal Price,
    int Quantity,
    int Stock,
    OrderItemType Type,
    DateOnly? RentalStartDate,
    DateOnly? RentalEndDate,
    string? Color,
    string? Size
);

public record CartDto(
    Guid Id,
    List<CartItemDto> Items
);
