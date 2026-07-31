namespace Budgetha.Application.Features.Cart;

internal static class CartRules
{
    internal const int MaximumQuantity = 1000;

    internal static void ValidateQuantity(int quantity)
    {
        if (quantity <= 0 || quantity > MaximumQuantity)
            throw new InvalidOperationException($"Quantity must be between 1 and {MaximumQuantity}.");
    }

    internal static void ValidateRentalDates(DateOnly? startDate, DateOnly? endDate)
    {
        if (!startDate.HasValue || !endDate.HasValue)
            throw new InvalidOperationException("Rental dates are required.");

        if (startDate.Value < DateOnly.FromDateTime(DateTime.UtcNow))
            throw new InvalidOperationException("Rental start date cannot be in the past.");

        if (endDate.Value < startDate.Value)
            throw new InvalidOperationException("Rental end date must be on or after the start date.");
    }
}
