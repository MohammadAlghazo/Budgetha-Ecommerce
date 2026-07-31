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
            .Include(x => x.Images)
            .Include(x => x.Reviews)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == request.Slug, cancellationToken);

        if (p == null) return null;

        var rating = p.Reviews.Any() ? Math.Round((decimal)p.Reviews.Average(r => r.Rating), 1) : 0m;
        var isNew = (DateTime.UtcNow - p.Created).TotalDays < 30;

        var imageUrls = new List<string>();
        if (!string.IsNullOrEmpty(p.ThumbnailUrl))
        {
            imageUrls.Add(p.ThumbnailUrl);
        }
        imageUrls.AddRange(p.Images.Select(i => i.Url));

        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Brand = p.Brand,
            Category = p.Category?.Slug ?? "",
            Price = p.Price,
            OriginalPrice = p.OriginalPrice,
            Rating = rating,
            ReviewCount = p.Reviews.Count,
            ShortDescription = p.Description.Length > 50 ? p.Description.Substring(0, 50) + "..." : p.Description,
            Description = p.Description,
            Stock = p.StockQuantity,
            IsNew = isNew,
            IsFeatured = p.IsFeatured,
            ApprovalStatus = p.ApprovalStatus.ToString(),
            Images = imageUrls.Distinct().ToList()
        };
    }
}
