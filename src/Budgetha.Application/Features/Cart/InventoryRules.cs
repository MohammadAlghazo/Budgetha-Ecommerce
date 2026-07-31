using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart;

internal static class InventoryRules
{
    internal record RentalReservation(DateOnly StartDate, DateOnly EndDate, int Quantity);

    internal static ProductVariant? ValidateVariant(Product product, Guid? variantId, string? color, string? size)
    {
        if (product.Variants.Count == 0)
        {
            if (variantId.HasValue)
                throw new InvalidOperationException("The selected variant does not exist.");
            if (!string.IsNullOrWhiteSpace(color) || !string.IsNullOrWhiteSpace(size))
                throw new InvalidOperationException("Color and size require a product variant.");
            return null;
        }

        if (!variantId.HasValue)
            throw new InvalidOperationException("Select a product variant.");

        var variant = product.Variants.SingleOrDefault(v => v.Id == variantId.Value && v.IsActive)
            ?? throw new InvalidOperationException("The selected product variant is not active.");
        if ((!string.IsNullOrWhiteSpace(color) && !string.Equals(color, variant.Color, StringComparison.OrdinalIgnoreCase)) ||
            (!string.IsNullOrWhiteSpace(size) && !string.Equals(size, variant.Size, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException("Color and size must match the selected variant.");

        return variant;
    }

    internal static async Task<int> GetMaximumReservedQuantityAsync(
        IApplicationDbContext context,
        Guid productId,
        Guid? variantId,
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken,
        IReadOnlyCollection<RentalReservation>? additionalReservations = null)
    {
        var reservations = await context.OrderItems
            .Where(item => item.ProductId == productId &&
                           item.VariantId == variantId &&
                           item.Type == OrderItemType.Rental &&
                           item.Order.Status != OrderStatus.Cancelled &&
                           item.Order.Status != OrderStatus.Failed &&
                           (item.Order.ReservationExpiresAt == null || item.Order.ReservationExpiresAt > DateTimeOffset.UtcNow) &&
                           item.RentalStartDate < endDate &&
                           startDate < item.RentalEndDate)
            .Select(item => new { item.RentalStartDate, item.RentalEndDate, item.Quantity })
            .ToListAsync(cancellationToken);

        var events = reservations.Select(item => new RentalReservation(
                item.RentalStartDate!.Value, item.RentalEndDate!.Value, item.Quantity))
            .Concat(additionalReservations ?? [])
            .Where(item => item.StartDate < endDate && startDate < item.EndDate)
            .SelectMany(item => new[]
            {
                new { Date = item.StartDate < startDate ? startDate : item.StartDate, Delta = item.Quantity },
                new { Date = item.EndDate > endDate ? endDate : item.EndDate, Delta = -item.Quantity }
            })
            .GroupBy(entry => entry.Date)
            .OrderBy(group => group.Key)
            .Select(group => group.Sum(entry => entry.Delta));

        var current = 0;
        var maximum = 0;
        foreach (var delta in events)
        {
            current += delta;
            maximum = Math.Max(maximum, current);
        }

        return maximum;
    }

    internal static async Task<int> GetMaximumFutureReservedQuantityAsync(
        IApplicationDbContext context,
        Guid productId,
        Guid? variantId,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var reservations = await context.OrderItems
            .Where(item => item.ProductId == productId && item.VariantId == variantId &&
                           item.Type == OrderItemType.Rental && item.RentalEndDate > today &&
                           item.Order.Status != OrderStatus.Cancelled && item.Order.Status != OrderStatus.Failed &&
                           (item.Order.ReservationExpiresAt == null || item.Order.ReservationExpiresAt > DateTimeOffset.UtcNow))
            .Select(item => new { item.RentalStartDate, item.RentalEndDate, item.Quantity })
            .ToListAsync(cancellationToken);

        var current = 0;
        var maximum = 0;
        var events = reservations.SelectMany(item => new[]
            {
                new { Date = item.RentalStartDate!.Value < today ? today : item.RentalStartDate.Value, Delta = item.Quantity },
                new { Date = item.RentalEndDate!.Value, Delta = -item.Quantity }
            })
            .GroupBy(entry => entry.Date)
            .OrderBy(group => group.Key)
            .Select(group => group.Sum(entry => entry.Delta));

        foreach (var delta in events)
        {
            current += delta;
            maximum = Math.Max(maximum, current);
        }

        return maximum;
    }
}
