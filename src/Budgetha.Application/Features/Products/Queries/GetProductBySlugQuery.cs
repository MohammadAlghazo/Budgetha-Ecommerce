using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
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
            .Include(x => x.Variants)
            .Include(x => x.Seller)
            .Include(x => x.Colors)
            .Include(x => x.Sizes)
            .Include(x => x.Features)
            .Include(x => x.Specs)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == request.Slug &&
                                      x.IsActive &&
                                      x.ApprovalStatus == ApprovalStatus.Approved,
                cancellationToken);

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
            CategoryId = p.CategoryId,
            Price = p.Price,
            OriginalPrice = p.OriginalPrice,
            IsAvailableForRent = p.IsAvailableForRent,
            RentalPricePerDay = p.RentalPricePerDay,
            Rating = rating,
            ReviewCount = p.Reviews.Count,
            ShortDescription = p.Description.Length > 50 ? p.Description.Substring(0, 50) + "..." : p.Description,
            Description = p.Description,
            Stock = p.Variants.Any(v => v.IsActive)
                ? p.Variants.Where(v => v.IsActive).Sum(v => v.StockQuantity)
                : p.StockQuantity,
            IsNew = isNew,
            IsFeatured = p.IsFeatured,
            ApprovalStatus = p.ApprovalStatus.ToString(),
            SellerId = p.SellerId,
            SellerName = p.Seller != null
                ? (!string.IsNullOrWhiteSpace(p.Seller.FirstName) || !string.IsNullOrWhiteSpace(p.Seller.LastName)
                    ? $"{p.Seller.FirstName} {p.Seller.LastName}".Trim()
                    : p.Seller.UserName ?? "")
                : "",
            Images = imageUrls.Distinct().ToList(),
            ImageDetails = p.Images
                .OrderBy(image => image.DisplayOrder)
                .Select(image => new ProductImageDto { Url = image.Url })
                .ToList(),
            Colors = p.Variants.Where(v => v.IsActive && v.Color != null)
                .Select(v => v.Color!).Distinct()
                .Select(color => new ProductColorDto
                {
                    Name = color,
                    Hex = p.Colors.FirstOrDefault(c => c.Name == color)?.Hex ?? "#64748b"
                }).ToList(),
            Sizes = p.Variants.Where(v => v.IsActive && v.Size != null)
                .Select(v => v.Size!).Distinct().ToList(),
            Features = p.Features.Select(f => f.Description).ToList(),
            Specs = p.Specs.Select(s => new ProductSpecDto { Label = s.Label, Value = s.Value }).ToList(),
            Variants = p.Variants.Where(v => v.IsActive).Select(v => new ProductVariantDto
            {
                Id = v.Id,
                SKU = v.SKU,
                Color = v.Color,
                Size = v.Size,
                StockQuantity = v.StockQuantity,
                Price = v.Price,
                RentalPricePerDay = v.RentalPricePerDay,
                IsActive = v.IsActive
            }).ToList()
        };
    }
}
