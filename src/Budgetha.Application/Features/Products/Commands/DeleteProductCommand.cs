using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Commands;

public record DeleteProductCommand(Guid Id, string UserId, bool IsSuperAdmin) : IRequest<bool>;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IApplicationDbContext _context;
    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
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

        foreach (var publicId in publicIds)
            _context.PendingImageDeletions.Add(new PendingImageDeletion { PublicId = publicId });

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
