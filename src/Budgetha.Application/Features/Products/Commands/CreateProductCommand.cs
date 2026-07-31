using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Budgetha.Application.Features.Products.Commands;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    Guid CategoryId,
    List<string> ImageUrls,
    bool IsAvailableForRent,
    decimal? RentalPricePerDay,
    string SellerId,
    string Brand,
    decimal? OriginalPrice,
    List<string>? Colors = null,
    List<string>? Sizes = null,
    Dictionary<string, string>? Specs = null,
    List<string>? Features = null
) : IRequest<Guid>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new Exception($"Category with ID {request.CategoryId} not found.");
        }

        
        var slug = GenerateSlug(request.Name);
        var originalSlug = slug;
        var counter = 1;

        
        while (await _context.Products.AnyAsync(p => p.Slug == slug, cancellationToken))
        {
            slug = $"{originalSlug}-{counter}";
            counter++;
        }

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
            ThumbnailUrl = request.ImageUrls.FirstOrDefault(),
            IsAvailableForRent = request.IsAvailableForRent,
            RentalPricePerDay = request.RentalPricePerDay,
            Brand = string.IsNullOrWhiteSpace(request.Brand) ? "Generic" : request.Brand,
            OriginalPrice = request.OriginalPrice,
            SellerId = request.SellerId,
            Slug = slug,
            IsActive = true,
            ApprovalStatus = ApprovalStatus.Approved
        };

        if (request.ImageUrls != null && request.ImageUrls.Any())
        {
            int order = 0;
            foreach (var url in request.ImageUrls)
            {
                product.Images.Add(new ProductImage
                {
                    Url = url,
                    DisplayOrder = order++
                });
            }
        }

        if (request.Colors != null)
        {
            foreach (var color in request.Colors) product.Colors.Add(new ProductColor { Name = color });
        }
        if (request.Sizes != null)
        {
            foreach (var size in request.Sizes) product.Sizes.Add(new ProductSize { Name = size });
        }
        if (request.Features != null && request.Features.Any())
        {
            foreach (var feature in request.Features)
            {
                product.Features.Add(new ProductFeature { Description = feature });
            }
        }

        if (request.Specs != null && request.Specs.Any())
        {
            foreach (var spec in request.Specs)
            {
                product.Specs.Add(new ProductSpec { Label = spec.Key, Value = spec.Value });
            }
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        return product.Id;
    }

    private string GenerateSlug(string name)
    {
        string str = name.ToLower();
        
        // Allow Arabic characters using \p{IsArabic}
        str = Regex.Replace(str, @"[^a-z0-9\p{IsArabic}\s-]", "");
        
        str = Regex.Replace(str, @"\s+", " ").Trim();
        
        str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
        str = Regex.Replace(str, @"\s", "-"); 
        return str;
    }
}
