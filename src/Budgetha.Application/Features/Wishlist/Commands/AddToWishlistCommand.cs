using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Wishlist.Commands;

public record AddToWishlistCommand(Guid ProductId) : IRequest;

public class AddToWishlistCommandHandler : IRequestHandler<AddToWishlistCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddToWishlistCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(AddToWishlistCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var product = await _context.Products.FindAsync(new object[] { request.ProductId }, cancellationToken);
        if (product == null || !product.IsActive)
            throw new NotFoundException(nameof(Product), request.ProductId);

        var exists = await _context.Wishlists.AnyAsync(w => w.UserId == userId && w.ProductId == request.ProductId, cancellationToken);
        
        if (!exists)
        {
            var wishlist = new Domain.Entities.Wishlist
            {
                UserId = userId,
                ProductId = request.ProductId
            };
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
