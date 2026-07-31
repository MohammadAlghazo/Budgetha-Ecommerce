using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Products.Commands;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    Guid CategoryId,
    List<ProductImageInput> Images,
    bool IsAvailableForRent,
    decimal? RentalPricePerDay,
    string UserId,
    string Brand,
    decimal? OriginalPrice,
    List<string>? Colors = null,
    List<string>? Sizes = null,
    Dictionary<string, string>? Specs = null,
    List<string>? Features = null,
    List<ProductVariantInput>? Variants = null
) : IRequest<bool>;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly IImageService _imageService;

    public UpdateProductCommandHandler(
        IApplicationDbContext context,
        IIdentityService identityService,
        IImageService imageService)
    {
        _context = context;
        _identityService = identityService;
        _imageService = imageService;
    }

    public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        ProductRules.Validate(request.Price, request.StockQuantity, request.OriginalPrice, request.IsAvailableForRent, request.RentalPricePerDay, request.Variants);

        var requestedSkus = (request.Variants ?? []).Select(variant => variant.SKU.Trim()).ToList();
        if (requestedSkus.Count > 0 && await _context.ProductVariants
                .AnyAsync(variant => variant.ProductId != request.Id && requestedSkus.Contains(variant.SKU), cancellationToken))
            throw new InvalidOperationException("A variant SKU is already in use.");

        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Features)
            .Include(p => p.Specs)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (product == null) return false;

        var roles = await _identityService.GetRolesAsync(request.UserId);
        var isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");

        if (product.SellerId != request.UserId && !isAdmin)
        {
            return false;
        }

        var slug = ProductRules.GenerateSlug(request.Name);
        var originalSlug = slug;
        var counter = 1;
        while (await _context.Products.AnyAsync(p => p.Id != product.Id && p.Slug == slug, cancellationToken))
            slug = $"{originalSlug}-{counter++}";

        var oldPublicIds = product.Images
            .Select(image => image.PublicId)
            .Append(product.ThumbnailPublicId)
            .Where(publicId => !string.IsNullOrWhiteSpace(publicId))
            .Select(publicId => publicId!)
            .Distinct()
            .ToList();
        var retainedPublicIds = request.Images
            .Select(image => image.PublicId)
            .Where(publicId => !string.IsNullOrWhiteSpace(publicId))
            .Select(publicId => publicId!)
            .ToHashSet();

        product.Name = request.Name;
        product.Slug = slug;
        product.Description = request.Description;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.CategoryId = request.CategoryId;
        product.ThumbnailUrl = request.Images.FirstOrDefault()?.Url;
        product.ThumbnailPublicId = request.Images.FirstOrDefault()?.PublicId;
        
        product.Images.Clear();
        var displayOrder = 0;
        foreach (var image in request.Images)
        {
            product.Images.Add(new ProductImage
            {
                Url = image.Url,
                PublicId = image.PublicId,
                DisplayOrder = displayOrder++
            });
        }
        
        product.IsAvailableForRent = request.IsAvailableForRent;
        product.RentalPricePerDay = request.RentalPricePerDay;
        product.Brand = request.Brand;
        product.OriginalPrice = request.OriginalPrice;
        product.ApprovalStatus = isAdmin ? ApprovalStatus.Approved : ApprovalStatus.Pending;

        if (request.Variants != null)
        {
            var requestedIds = request.Variants.Where(v => v.Id.HasValue).Select(v => v.Id!.Value).ToHashSet();
            foreach (var existing in product.Variants.Where(v => !requestedIds.Contains(v.Id)))
                existing.IsActive = false;

            foreach (var input in request.Variants)
            {
                var variant = input.Id.HasValue
                    ? product.Variants.SingleOrDefault(v => v.Id == input.Id.Value)
                    : null;
                if (input.Id.HasValue && variant == null)
                    throw new InvalidOperationException("A variant does not belong to this product.");

                if (variant == null)
                {
                    variant = new ProductVariant();
                    product.Variants.Add(variant);
                }

                variant.SKU = input.SKU.Trim();
                variant.Color = Normalize(input.Color);
                variant.Size = Normalize(input.Size);
                variant.StockQuantity = input.StockQuantity;
                variant.Price = input.Price;
                variant.RentalPricePerDay = input.RentalPricePerDay;
                variant.IsActive = input.IsActive;
            }
        }

        if (request.Colors != null)
        {
            product.Colors.Clear();
            foreach (var color in request.Colors) product.Colors.Add(new ProductColor { Name = color });
        }
        if (request.Sizes != null)
        {
            product.Sizes.Clear();
            foreach (var size in request.Sizes) product.Sizes.Add(new ProductSize { Name = size });
        }
        if (request.Features != null)
        {
            product.Features.Clear();
            foreach (var feature in request.Features) product.Features.Add(new ProductFeature { Description = feature });
        }
        if (request.Specs != null)
        {
            product.Specs.Clear();
            foreach (var spec in request.Specs) product.Specs.Add(new ProductSpec { Label = spec.Key, Value = spec.Value });
        }

        await _context.SaveChangesAsync(cancellationToken);

        foreach (var publicId in oldPublicIds.Where(publicId => !retainedPublicIds.Contains(publicId)))
        {
            try
            {
                await _imageService.DeleteImageAsync(publicId);
            }
            catch
            {
                // The database is authoritative; failed Cloudinary cleanup can be retried later.
            }
        }

        return true;
    }

    private static string? Normalize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
