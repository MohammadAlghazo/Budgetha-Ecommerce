using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class ProductSpec : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
