using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Commands;

public record DeleteUnattachedProductImageCommand(string PublicId) : IRequest<bool>;

public class DeleteUnattachedProductImageCommandHandler
    : IRequestHandler<DeleteUnattachedProductImageCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IImageService _imageService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteUnattachedProductImageCommandHandler(
        IApplicationDbContext context,
        IImageService imageService,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _imageService = imageService;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(
        DeleteUnattachedProductImageCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.PublicId)) return false;

        var userId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId)) throw new UnauthorizedAccessException();

        var pending = await _context.PendingImageUploads
            .SingleOrDefaultAsync(upload => upload.PublicId == request.PublicId && upload.UserId == userId, cancellationToken);
        if (pending == null) return false;

        var isAttached = await _context.ProductImages
            .AnyAsync(image => image.PublicId == request.PublicId, cancellationToken)
            || await _context.Products
                .AnyAsync(product => product.ThumbnailPublicId == request.PublicId, cancellationToken);

        if (isAttached || !await _imageService.DeleteImageAsync(request.PublicId)) return false;

        _context.PendingImageUploads.Remove(pending);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
