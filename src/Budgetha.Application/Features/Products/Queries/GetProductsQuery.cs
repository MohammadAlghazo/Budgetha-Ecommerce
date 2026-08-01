using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Queries;

public class GetProductsQuery : IRequest<CatalogResultDto>
{
    public string? Search { get; set; }
    public List<string>? Categories { get; set; }
    public List<string>? Brands { get; set; }
    public decimal MinPrice { get; set; } = 0;
    public decimal MaxPrice { get; set; } = decimal.MaxValue;
    public decimal MinRating { get; set; } = 0;
    public string? Sort { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string? SellerId { get; set; }
    public bool IncludeUnapproved { get; set; } = false;
}

public class CatalogResultDto
{
    public List<ProductDto> Items { get; set; } = new();
    public int Total { get; set; }
    public int TotalPages { get; set; }
}

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, CatalogResultDto>
{
    private readonly IApplicationDbContext _context;

    public GetProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CatalogResultDto> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Seller)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Reviews)
            .AsNoTracking();

        query = query.Where(p => p.IsActive &&
            (request.IncludeUnapproved || p.ApprovalStatus == ApprovalStatus.Approved));

        if (!string.IsNullOrEmpty(request.SellerId))
        {
            query = query.Where(p => p.SellerId == request.SellerId);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(search) || p.Description.ToLower().Contains(search));
        }

        if (request.Categories?.Any() == true)
        {
            query = query.Where(p => request.Categories.Contains(p.Category.Slug));
        }

        if (request.Brands?.Any() == true)
        {
            query = query.Where(p => request.Brands.Contains(p.Brand));
        }

        if (request.MinRating > 0)
        {
            query = query.Where(p => p.AverageRating >= request.MinRating);
        }

        query = query.Where(p => p.Price >= request.MinPrice && p.Price <= request.MaxPrice);

        
        query = request.Sort switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "newest" => query.OrderByDescending(p => p.Created),
            "rating" => query.OrderByDescending(p => p.AverageRating).ThenByDescending(p => p.ReviewCount),
            _ => query.OrderBy(p => p.Id)
        };

        var total = await query.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)request.PageSize));
        var page = Math.Min(request.Page, totalPages);
        var start = (page - 1) * request.PageSize;

        var products = await query.Skip(start).Take(request.PageSize).ToListAsync(cancellationToken);

        var items = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Brand = string.IsNullOrWhiteSpace(p.Brand) ? "Generic" : p.Brand,
            Category = p.Category?.Slug ?? "",
            CategoryId = p.CategoryId,
            Price = p.Price,
            OriginalPrice = p.OriginalPrice, 
            IsAvailableForRent = p.IsAvailableForRent,
            RentalPricePerDay = p.RentalPricePerDay,
            Rating = p.AverageRating > 0 ? Math.Round(p.AverageRating, 1) : 0m, 
            ReviewCount = p.ReviewCount, 
            ShortDescription = p.Description.Length > 50 ? p.Description.Substring(0, 50) + "..." : p.Description,
            Description = p.Description,
            Stock = p.Variants.Any(v => v.IsActive)
                ? p.Variants.Where(v => v.IsActive).Sum(v => v.StockQuantity)
                : p.StockQuantity,
            IsNew = (DateTime.UtcNow - p.Created).TotalDays <= 30,
            IsFeatured = p.IsFeatured,
            ApprovalStatus = p.ApprovalStatus.ToString(),
            SellerId = p.SellerId,
            SellerName = p.Seller != null
                ? (!string.IsNullOrWhiteSpace(p.Seller.FirstName) || !string.IsNullOrWhiteSpace(p.Seller.LastName)
                    ? $"{p.Seller.FirstName} {p.Seller.LastName}".Trim()
                    : p.Seller.UserName ?? "")
                : "",
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
            }).ToList(),
            Images = (p.ThumbnailUrl != null ? new List<string> { p.ThumbnailUrl } : new List<string>())
                     .Concat(p.Images != null ? p.Images.Select(i => i.Url) : new List<string>())
                     .Distinct()
                     .ToList(),
            ImageDetails = p.Images!
                .OrderBy(image => image.DisplayOrder)
                .Select(image => new ProductImageDto { Url = image.Url })
                .ToList()
        }).ToList();

        return new CatalogResultDto
        {
            Items = items,
            Total = total,
            TotalPages = totalPages
        };
    }
}
