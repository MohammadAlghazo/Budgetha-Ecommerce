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
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var review = await _context.Reviews
            .FirstOrDefaultAsync(r => r.Id == request.ReviewId, cancellationToken);

        if (review == null)
            throw new NotFoundException(nameof(Review), request.ReviewId);

        if (review.UserId != userId)
            throw new UnauthorizedAccessException("You can only update your own reviews.");

        review.Rating = request.Rating;
        review.Comment = request.Comment;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
