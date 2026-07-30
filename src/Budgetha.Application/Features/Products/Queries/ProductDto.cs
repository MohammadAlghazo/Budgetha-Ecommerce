namespace Budgetha.Application.Features.Products.Queries;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty; // Not in Entity? Wait, Entity has Name, Slug, Description...
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Features { get; set; } = new();
    public List<ProductSpecDto> Specs { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public List<ProductColorDto> Colors { get; set; } = new();
    public List<string> Sizes { get; set; } = new();
    public int Stock { get; set; }
    public bool IsNew { get; set; }
    public bool IsFeatured { get; set; }
    public string ApprovalStatus { get; set; } = string.Empty;
}

public class ProductSpecDto
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class ProductColorDto
{
    public string Name { get; set; } = string.Empty;
    public string Hex { get; set; } = string.Empty;
}
