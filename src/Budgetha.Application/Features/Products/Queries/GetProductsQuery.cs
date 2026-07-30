using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Queries;

public record GetProductsQuery(
    string? Search,
    List<string>? Categories,
    List<string>? Brands,
    decimal MinPrice,
    decimal MaxPrice,
    decimal MinRating,
    string? Sort,
    int Page,
    int PageSize,
    ApprovalStatus? Status = ApprovalStatus.Approved,
    string? SellerId = null) : IRequest<CatalogResultDto>;

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
        var query = _context.Products.Include(p => p.Category).AsNoTracking();

        if (request.Status.HasValue)
        {
            query = query.Where(p => p.ApprovalStatus == request.Status.Value);
        }

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

        query = query.Where(p => p.Price >= request.MinPrice && p.Price <= request.MaxPrice);

        // Sorting
        query = request.Sort switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "newest" => query.OrderByDescending(p => p.Created),
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
            Brand = "Generic", // Entity missing brand
            Category = p.Category?.Slug ?? "",
            Price = p.Price,
            OriginalPrice = p.Price * 1.2m, // mock
            Rating = 4.5m, // mock
            ReviewCount = 120, // mock
            ShortDescription = p.Description.Length > 50 ? p.Description.Substring(0, 50) + "..." : p.Description,
            Description = p.Description,
            Stock = p.StockQuantity,
            IsNew = true,
            IsFeatured = true,
            ApprovalStatus = p.ApprovalStatus.ToString(),
            Images = p.ThumbnailUrl != null ? new List<string> { p.ThumbnailUrl } : new List<string>()
        }).ToList();

        return new CatalogResultDto
        {
            Items = items,
            Total = total,
            TotalPages = totalPages
        };
    }
}
