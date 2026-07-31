namespace Budgetha.Application.Common.Models;

public sealed record CheckoutQuote(
    decimal Subtotal,
    decimal DiscountAmount,
    decimal ShippingAmount,
    decimal TaxAmount,
    decimal TotalAmount,
    string Currency,
    string? PromoCode,
    string? PromoScope,
    string? PromoSellerId,
    IReadOnlyList<CheckoutQuoteLine> Lines);

public sealed record CheckoutQuoteLine(
    Guid CartItemId,
    Guid ProductId,
    string SellerId,
    int Quantity,
    decimal UnitPrice,
    decimal LineSubtotal,
    decimal DiscountAmount);
