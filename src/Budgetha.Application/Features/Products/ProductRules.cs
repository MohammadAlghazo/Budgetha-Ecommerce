using System.Text.RegularExpressions;

namespace Budgetha.Application.Features.Products;

internal static class ProductRules
{
    internal static void Validate(decimal price, int stockQuantity, decimal? originalPrice, bool isAvailableForRent, decimal? rentalPricePerDay)
    {
        if (price <= 0)
            throw new InvalidOperationException("Product price must be positive.");

        if (stockQuantity < 0)
            throw new InvalidOperationException("Product stock cannot be negative.");

        if (originalPrice.HasValue && originalPrice.Value <= 0)
            throw new InvalidOperationException("Original price must be positive when provided.");

        if (rentalPricePerDay.HasValue && rentalPricePerDay.Value <= 0)
            throw new InvalidOperationException("Rental price must be positive when provided.");

        if (isAvailableForRent && !rentalPricePerDay.HasValue)
            throw new InvalidOperationException("A rental price is required for rentable products.");
    }

    internal static string GenerateSlug(string name)
    {
        var slug = Regex.Replace(name.Trim().ToLowerInvariant(), @"[^a-z0-9\p{IsArabic}\s-]", "");
        slug = Regex.Replace(slug, @"\s+", " ").Trim();
        slug = slug[..Math.Min(slug.Length, 45)].Trim();
        slug = Regex.Replace(slug, @"\s", "-");

        if (string.IsNullOrWhiteSpace(slug))
            throw new InvalidOperationException("Product name must produce a non-empty slug.");

        return slug;
    }
}
