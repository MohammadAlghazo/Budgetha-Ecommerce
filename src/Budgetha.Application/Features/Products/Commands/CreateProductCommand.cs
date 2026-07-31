using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Commands;

public record ProductImageInput(string Url, string? PublicId);

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    Guid CategoryId,
    List<ProductImageInput> Images,
    bool IsAvailableForRent,
    decimal? RentalPricePerDay,
    string SellerId,
    string Brand,
    decimal? OriginalPrice,
    List<string>? Colors = null,
    List<string>? Sizes = null,
    Dictionary<string, string>? Specs = null,
    List<string>? Features = null,
    List<ProductVariantInput>? Variants = null
) : IRequest<Guid>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public CreateProductCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var images = request.Images ?? [];
        ProductRules.Validate(request.Price, request.StockQuantity, request.OriginalPrice, request.IsAvailableForRent, request.RentalPricePerDay, request.Variants);

        var requestedSkus = (request.Variants ?? []).Select(variant => variant.SKU.Trim()).ToList();
        if (requestedSkus.Count > 0 && await _context.ProductVariants
                .AnyAsync(variant => requestedSkus.Contains(variant.SKU), cancellationToken))
            throw new InvalidOperationException("A variant SKU is already in use.");

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new Exception($"Category with ID {request.CategoryId} not found.");
        }

        
        var slug = ProductRules.GenerateSlug(request.Name);
        var originalSlug = slug;
        var counter = 1;

        
        while (await _context.Products.AnyAsync(p => p.Slug == slug, cancellationToken))
        {
            slug = $"{originalSlug}-{counter}";
            counter++;
        }

        var roles = await _identityService.GetRolesAsync(request.SellerId);
        var isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
            ThumbnailUrl = images.FirstOrDefault()?.Url,
            ThumbnailPublicId = images.FirstOrDefault()?.PublicId,
            IsAvailableForRent = request.IsAvailableForRent,
            RentalPricePerDay = request.RentalPricePerDay,
            Brand = string.IsNullOrWhiteSpace(request.Brand) ? "Generic" : request.Brand,
            OriginalPrice = request.OriginalPrice,
            SellerId = request.SellerId,
            Slug = slug,
            IsActive = true,
            ApprovalStatus = isAdmin ? ApprovalStatus.Approved : ApprovalStatus.Pending
        };

        foreach (var variant in request.Variants ?? [])
        {
            product.Variants.Add(new ProductVariant
            {
                SKU = variant.SKU.Trim(),
                Color = Normalize(variant.Color),
                Size = Normalize(variant.Size),
                StockQuantity = variant.StockQuantity,
                Price = variant.Price,
                RentalPricePerDay = variant.RentalPricePerDay,
                IsActive = variant.IsActive
            });
        }

        if (images.Any())
        {
            int order = 0;
            foreach (var image in images)
            {
                product.Images.Add(new ProductImage
                {
                    Url = image.Url,
                    PublicId = image.PublicId,
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
        var attachedPublicIds = images
            .Where(image => !string.IsNullOrWhiteSpace(image.PublicId))
            .Select(image => image.PublicId!)
            .ToList();
        var pendingUploads = await _context.PendingImageUploads
            .Where(upload => upload.UserId == request.SellerId && attachedPublicIds.Contains(upload.PublicId))
            .ToListAsync(cancellationToken);
        _context.PendingImageUploads.RemoveRange(pendingUploads);
        await _context.SaveChangesAsync(cancellationToken);

        return product.Id;
    }

    private static string? Normalize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
