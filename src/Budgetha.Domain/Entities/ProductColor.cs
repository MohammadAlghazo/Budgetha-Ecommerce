using Budgetha.Domain.Common;

namespace Budgetha.Domain.Entities;

public class ProductColor : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Hex { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
