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

    public DeleteUnattachedProductImageCommandHandler(
        IApplicationDbContext context,
        IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<bool> Handle(
        DeleteUnattachedProductImageCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.PublicId)) return false;

        var isAttached = await _context.ProductImages
            .AnyAsync(image => image.PublicId == request.PublicId, cancellationToken)
            || await _context.Products
                .AnyAsync(product => product.ThumbnailPublicId == request.PublicId, cancellationToken);

        return !isAttached && await _imageService.DeleteImageAsync(request.PublicId);
    }
}
