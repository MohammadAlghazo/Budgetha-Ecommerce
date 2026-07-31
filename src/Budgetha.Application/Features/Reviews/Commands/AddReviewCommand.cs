using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Reviews.Commands;

public record AddReviewCommand(Guid ProductId, int Rating, string? Comment) : IRequest<Guid>;

public class AddReviewCommandHandler : IRequestHandler<AddReviewCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddReviewCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(AddReviewCommand request, CancellationToken cancellationToken)
    {
        if (request.Rating is < 1 or > 5)
            throw new InvalidOperationException("Rating must be between 1 and 5.");

        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var product = await _context.Products.FindAsync(new object[] { request.ProductId }, cancellationToken);
        if (product == null)
            throw new NotFoundException(nameof(Product), request.ProductId);

        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.ProductId == request.ProductId && r.UserId == userId, cancellationToken);

        if (existingReview != null)
            throw new InvalidOperationException("You have already reviewed this product.");

        var review = new Review
        {
            ProductId = request.ProductId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _context.Reviews.Add(review);
        
        var currentReviewCount = await _context.Reviews.CountAsync(r => r.ProductId == product.Id, cancellationToken);
        var currentTotalRating = await _context.Reviews.Where(r => r.ProductId == product.Id).SumAsync(r => r.Rating, cancellationToken);
        
        product.ReviewCount = currentReviewCount + 1;
        product.AverageRating = (decimal)(currentTotalRating + request.Rating) / product.ReviewCount;
        
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);

        return review.Id;
    }
}
