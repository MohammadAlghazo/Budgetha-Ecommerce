using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class ProductSize : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
