using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Queries;

public record GetProductBySlugQuery(string Slug) : IRequest<ProductDto?>;

public class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDto?>
{
    private readonly IApplicationDbContext _context;

    public GetProductBySlugQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto?> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        var p = await _context.Products
            .Include(x => x.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == request.Slug, cancellationToken);

        if (p == null) return null;

        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Brand = "Generic",
            Category = p.Category?.Slug ?? "",
            Price = p.Price,
            OriginalPrice = p.Price * 1.2m,
            Rating = 4.5m,
            ReviewCount = 120,
            ShortDescription = p.Description.Length > 50 ? p.Description.Substring(0, 50) + "..." : p.Description,
            Description = p.Description,
            Stock = p.StockQuantity,
            IsNew = true,
            IsFeatured = true,
            ApprovalStatus = p.ApprovalStatus.ToString(),
            Images = p.ThumbnailUrl != null ? new List<string> { p.ThumbnailUrl } : new List<string>()
        };
    }
}
