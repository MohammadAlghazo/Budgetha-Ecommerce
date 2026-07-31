using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Commands;

public record DeleteProductCommand(Guid Id, string UserId, bool IsSuperAdmin) : IRequest<bool>;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IImageService _imageService;

    public DeleteProductCommandHandler(IApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (product == null) return false;

        // Verify ownership (only the seller who created it, or SuperAdmin can delete)
        if (product.SellerId != request.UserId && !request.IsSuperAdmin) return false;

        var hasOrderHistory = await _context.OrderItems
            .AnyAsync(item => item.ProductId == request.Id, cancellationToken);

        var cartItems = await _context.CartItems
            .Where(item => item.ProductId == request.Id)
            .ToListAsync(cancellationToken);
        var wishlistItems = await _context.Wishlists
            .Where(item => item.ProductId == request.Id)
            .ToListAsync(cancellationToken);
        _context.CartItems.RemoveRange(cartItems);
        _context.Wishlists.RemoveRange(wishlistItems);

        List<string> publicIds = new();
        if (hasOrderHistory)
        {
            product.IsActive = false;
            product.StockQuantity = 0;
        }
        else
        {
            publicIds = product.Images
                .Select(image => image.PublicId)
                .Append(product.ThumbnailPublicId)
                .Where(publicId => !string.IsNullOrWhiteSpace(publicId))
                .Select(publicId => publicId!)
                .Distinct()
                .ToList();
            _context.Products.Remove(product);
        }

        await _context.SaveChangesAsync(cancellationToken);

        foreach (var publicId in publicIds)
        {
            try
            {
                await _imageService.DeleteImageAsync(publicId);
            }
            catch
            {
                // A cleanup failure must not invalidate the completed database transition.
            }
        }

        return true;
    }
}
