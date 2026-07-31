using System.Text.RegularExpressions;

namespace Budgetha.Application.Features.Products;

internal static class ProductRules
{
    internal static void Validate(decimal price, int stockQuantity, decimal? originalPrice, bool isAvailableForRent,
        decimal? rentalPricePerDay, IReadOnlyCollection<ProductVariantInput>? variants)
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
        {
            if (variants == null || variants.Count == 0 || variants.Any(v => v.IsActive && !v.RentalPricePerDay.HasValue))
                throw new InvalidOperationException("A rental price is required for every rentable variant or the product.");
        }

        if (variants == null) return;

        var skus = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var combinations = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var variant in variants)
        {
            if (string.IsNullOrWhiteSpace(variant.SKU))
                throw new InvalidOperationException("Variant SKU is required.");
            if (!skus.Add(variant.SKU.Trim()))
                throw new InvalidOperationException($"Duplicate variant SKU '{variant.SKU}'.");
            if (variant.StockQuantity < 0)
                throw new InvalidOperationException("Variant stock cannot be negative.");
            if (variant.Price.HasValue && variant.Price <= 0)
                throw new InvalidOperationException("Variant price must be positive when provided.");
            if (variant.RentalPricePerDay.HasValue && variant.RentalPricePerDay <= 0)
                throw new InvalidOperationException("Variant rental price must be positive when provided.");

            var combination = $"{variant.Color?.Trim().ToUpperInvariant()}\u001f{variant.Size?.Trim().ToUpperInvariant()}";
            if (variant.IsActive && !combinations.Add(combination))
                throw new InvalidOperationException("Variant color and size combinations must be unique.");
        }
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

public record ProductVariantInput(
    Guid? Id,
    string SKU,
    string? Color,
    string? Size,
    int StockQuantity,
    decimal? Price,
    decimal? RentalPricePerDay,
    bool IsActive = true);
