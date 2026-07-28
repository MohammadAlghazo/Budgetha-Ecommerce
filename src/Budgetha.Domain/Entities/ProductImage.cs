using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class ProductImage : BaseEntity
{
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
