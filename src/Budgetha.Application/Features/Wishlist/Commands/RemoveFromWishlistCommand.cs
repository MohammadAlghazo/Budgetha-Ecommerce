using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Wishlist.Commands;

public record RemoveFromWishlistCommand(Guid ProductId) : IRequest;

public class RemoveFromWishlistCommandHandler : IRequestHandler<RemoveFromWishlistCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RemoveFromWishlistCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(RemoveFromWishlistCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var wishlistItem = await _context.Wishlists
            .FirstOrDefaultAsync(w => w.ProductId == request.ProductId && w.UserId == userId, cancellationToken);

        if (wishlistItem == null)
            throw new NotFoundException(nameof(Domain.Entities.Wishlist), request.ProductId);

        _context.Wishlists.Remove(wishlistItem);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
