using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Reviews.Commands;

public record UpdateReviewCommand(Guid ReviewId, int Rating, string? Comment) : IRequest;

public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateReviewCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        if (request.Rating is < 1 or > 5)
            throw new InvalidOperationException("Rating must be between 1 and 5.");

        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var review = await _context.Reviews
            .FirstOrDefaultAsync(r => r.Id == request.ReviewId, cancellationToken);

        if (review == null)
            throw new NotFoundException(nameof(Review), request.ReviewId);

        if (review.UserId != userId)
            throw new UnauthorizedAccessException("You can only update your own reviews.");

        var product = await _context.Products.FindAsync(new object[] { review.ProductId }, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), review.ProductId);
        var reviewCount = await _context.Reviews.CountAsync(r => r.ProductId == review.ProductId, cancellationToken);
        var totalRating = await _context.Reviews
            .Where(r => r.ProductId == review.ProductId)
            .SumAsync(r => r.Rating, cancellationToken);

        product.ReviewCount = reviewCount;
        product.AverageRating = reviewCount == 0
            ? 0
            : (decimal)(totalRating - review.Rating + request.Rating) / reviewCount;
        review.Rating = request.Rating;
        review.Comment = request.Comment;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
