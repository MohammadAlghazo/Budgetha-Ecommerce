using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class ProductFeature : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
