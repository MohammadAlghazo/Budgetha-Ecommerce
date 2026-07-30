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
        await _context.SaveChangesAsync(cancellationToken);

        return review.Id;
    }
}
