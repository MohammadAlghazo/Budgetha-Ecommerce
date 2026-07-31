namespace Budgetha.Infrastructure.Services;

public sealed class CheckoutPricingOptions
{
    public const string SectionName = "CheckoutPricing";

    public string Currency { get; set; } = "USD";
    public decimal DefaultTaxRate { get; set; }
    public decimal DefaultFlatShippingAmount { get; set; }
    public decimal? DefaultFreeShippingThreshold { get; set; }
    public List<TaxRule> TaxRules { get; set; } = new();
    public List<ShippingRule> ShippingRules { get; set; } = new();
}

public sealed class TaxRule
{
    public string Country { get; set; } = string.Empty;
    public string? State { get; set; }
    public decimal Rate { get; set; }
}

public sealed class ShippingRule
{
    public string Country { get; set; } = string.Empty;
    public string? State { get; set; }
    public decimal FlatAmount { get; set; }
    public decimal? FreeShippingThreshold { get; set; }
}
