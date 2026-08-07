using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Common.Models;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Budgetha.Infrastructure.Services;

public sealed class CheckoutPricingService : ICheckoutPricingService
{
    private readonly IApplicationDbContext _context;
    private readonly CheckoutPricingOptions _options;

    public CheckoutPricingService(IApplicationDbContext context, IOptions<CheckoutPricingOptions> options)
    {
        _context = context;
        _options = options.Value;
    }

    public async Task<CheckoutQuote> CalculateAsync(
        string userId,
        string country,
        string state,
        string? promoCode,
        CancellationToken cancellationToken)
    {
        var cart = await _context.Carts.AsNoTracking()
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .Include(c => c.Items)
            .ThenInclude(i => i.Variant)
            .SingleOrDefaultAsync(c => c.UserId == userId, cancellationToken);
        if (cart == null || cart.Items.Count == 0)
            throw new ValidationException(new[] { "Cart is empty." });

        var lines = cart.Items.Select(item =>
        {
            var unitPrice = GetUnitPrice(item);
            return new MutableQuoteLine(item.Id, item.ProductId, item.Product.SellerId, item.Quantity,
                unitPrice, Round(unitPrice * item.Quantity));
        }).ToList();

        PromoCode? promo = null;
        if (!string.IsNullOrWhiteSpace(promoCode))
        {
            var normalizedCode = promoCode.Trim().ToUpperInvariant();
            promo = await _context.PromoCodes.AsNoTracking()
                .SingleOrDefaultAsync(p => p.Code.ToUpper() == normalizedCode && p.IsActive, cancellationToken);
            if (promo == null || promo.ExpiryDate.HasValue && promo.ExpiryDate.Value <= DateTime.UtcNow)
                throw new ValidationException(new[] { "Promo code is invalid or expired." });
                
            var userUsageCount = await _context.PromoCodeUsages
                .CountAsync(u => u.PromoCodeId == promo.Id && u.UserId == userId, cancellationToken);
            if (userUsageCount >= promo.MaxUsesPerUser)
                throw new ValidationException(new[] { "You have reached the maximum usage limit for this promo code." });

            ValidatePromo(promo);
            AllocateDiscount(promo, lines);
        }

        var subtotal = Round(lines.Sum(line => line.LineSubtotal));
        var discount = Round(lines.Sum(line => line.DiscountAmount));
        var discountedSubtotal = Math.Max(0, subtotal - discount);
        var shippingRule = FindBestRule(_options.ShippingRules, country, state);
        var flatShipping = shippingRule?.FlatAmount ?? _options.DefaultFlatShippingAmount;
        var freeThreshold = shippingRule?.FreeShippingThreshold ?? _options.DefaultFreeShippingThreshold;
        var shipping = freeThreshold.HasValue && discountedSubtotal >= freeThreshold.Value ? 0 : Round(flatShipping);
        var taxRule = FindBestRule(_options.TaxRules, country, state);
        var taxRate = taxRule?.Rate ?? _options.DefaultTaxRate;
        var tax = Round(discountedSubtotal * taxRate);
        var total = Round(discountedSubtotal + shipping + tax);

        return new CheckoutQuote(
            subtotal, discount, shipping, tax, total, NormalizeCurrency(_options.Currency),
            promo?.Code, promo?.Scope, promo?.SellerId,
            lines.Select(line => new CheckoutQuoteLine(
                line.CartItemId, line.ProductId, line.SellerId, line.Quantity, line.UnitPrice,
                line.LineSubtotal, line.DiscountAmount)).ToList());
    }

    private static decimal GetUnitPrice(CartItem item)
    {
        if (item.Type != OrderItemType.Rental)
            return Round(item.Variant?.Price ?? item.Product.Price);
        if (!item.RentalStartDate.HasValue || !item.RentalEndDate.HasValue)
            throw new ValidationException(new[] { $"Product {item.Product.Name} requires rental dates." });

        var days = item.RentalEndDate.Value.DayNumber - item.RentalStartDate.Value.DayNumber;
        var dailyPrice = item.Variant?.RentalPricePerDay ?? item.Product.RentalPricePerDay
            ?? item.Variant?.Price ?? item.Product.Price;
        return Round(dailyPrice * Math.Max(1, days));
    }

    private static void ValidatePromo(PromoCode promo)
    {
        if (promo.DiscountPercentage is < 0 or > 100)
            throw new ValidationException(new[] { "Promo discount percentage must be between 0 and 100." });
        if (promo.Scope.Equals("Seller", StringComparison.OrdinalIgnoreCase) && string.IsNullOrWhiteSpace(promo.SellerId))
            throw new ValidationException(new[] { "Seller promo code has no seller owner." });
        if (!promo.Scope.Equals("Seller", StringComparison.OrdinalIgnoreCase) &&
            !promo.Scope.Equals("Platform", StringComparison.OrdinalIgnoreCase))
            throw new ValidationException(new[] { "Promo code scope is invalid." });
    }

    private static void AllocateDiscount(PromoCode promo, List<MutableQuoteLine> lines)
    {
        var eligible = promo.Scope.Equals("Seller", StringComparison.OrdinalIgnoreCase)
            ? lines.Where(line => line.SellerId == promo.SellerId).ToList()
            : lines;
        var eligibleSubtotal = eligible.Sum(line => line.LineSubtotal);
        if (eligibleSubtotal <= 0)
            throw new ValidationException(new[] { "Promo code does not apply to any item in the cart." });

        var discount = Round(eligibleSubtotal * promo.DiscountPercentage / 100m);
        if (promo.MaxDiscountAmount.HasValue)
            discount = Math.Min(discount, Round(promo.MaxDiscountAmount.Value));
        discount = Math.Min(discount, eligibleSubtotal);

        var remaining = discount;
        for (var index = 0; index < eligible.Count; index++)
        {
            var line = eligible[index];
            line.DiscountAmount = index == eligible.Count - 1
                ? remaining
                : Math.Min(remaining, Round(discount * line.LineSubtotal / eligibleSubtotal));
            remaining -= line.DiscountAmount;
        }
    }

    private static T? FindBestRule<T>(IEnumerable<T> rules, string country, string state) where T : class
    {
        return rules
            .Select(rule => (Rule: rule, Country: GetCountry(rule), State: GetState(rule)))
            .Where(match => EqualsLocation(match.Country, country) &&
                            (string.IsNullOrWhiteSpace(match.State) || EqualsLocation(match.State, state)))
            .OrderByDescending(match => !string.IsNullOrWhiteSpace(match.State))
            .Select(match => match.Rule)
            .FirstOrDefault();
    }

    private static string GetCountry<T>(T rule) => rule switch
    {
        TaxRule tax => tax.Country,
        ShippingRule shipping => shipping.Country,
        _ => string.Empty
    };

    private static string? GetState<T>(T rule) => rule switch
    {
        TaxRule tax => tax.State,
        ShippingRule shipping => shipping.State,
        _ => null
    };

    private static bool EqualsLocation(string? left, string? right) =>
        string.Equals(left?.Trim(), right?.Trim(), StringComparison.OrdinalIgnoreCase);

    private static string NormalizeCurrency(string currency)
    {
        var normalized = currency.Trim().ToUpperInvariant();
        if (normalized.Length != 3)
            throw new InvalidOperationException("CheckoutPricing:Currency must be a three-letter currency code.");
        return normalized;
    }

    private static decimal Round(decimal amount) => Math.Round(amount, 2, MidpointRounding.AwayFromZero);

    private sealed class MutableQuoteLine(
        Guid cartItemId, Guid productId, string sellerId, int quantity, decimal unitPrice, decimal lineSubtotal)
    {
        public Guid CartItemId { get; } = cartItemId;
        public Guid ProductId { get; } = productId;
        public string SellerId { get; } = sellerId;
        public int Quantity { get; } = quantity;
        public decimal UnitPrice { get; } = unitPrice;
        public decimal LineSubtotal { get; } = lineSubtotal;
        public decimal DiscountAmount { get; set; }
    }
}
