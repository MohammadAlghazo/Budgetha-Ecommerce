using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
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
    List<string> ImageUrls,
    bool IsAvailableForRent,
    decimal? RentalPricePerDay,
    string UserId,
    string Brand,
    decimal? OriginalPrice,
    List<string>? Colors = null,
    List<string>? Sizes = null,
    Dictionary<string, string>? Specs = null,
    List<string>? Features = null
) : IRequest<bool>;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public UpdateProductCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Features)
            .Include(p => p.Specs)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (product == null) return false;

        // Verify ownership or Admin rights
        if (product.SellerId != request.UserId)
        {
            var roles = await _identityService.GetRolesAsync(request.UserId);
            if (!roles.Contains("Admin") && !roles.Contains("SuperAdmin"))
            {
                return false;
            }
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.CategoryId = request.CategoryId;
        
        product.Images.Clear();
        foreach (var url in request.ImageUrls ?? new List<string>())
        {
            product.Images.Add(new ProductImage { Url = url });
        }
        
        product.IsAvailableForRent = request.IsAvailableForRent;
        product.RentalPricePerDay = request.RentalPricePerDay;
        product.Brand = request.Brand;
        product.OriginalPrice = request.OriginalPrice;

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
        return true;
    }
}
