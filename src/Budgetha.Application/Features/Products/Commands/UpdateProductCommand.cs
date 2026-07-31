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
    decimal? OriginalPrice
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
        var product = await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
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

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
