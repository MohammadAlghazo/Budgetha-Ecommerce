using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Reviews.Queries;

public record ReviewDto(
    Guid Id,
    string Author,
    string Initials,
    int Rating,
    string Date,
    string? Title,
    string? Comment,
    bool Verified,
    int Helpful,
    bool IsAuthor
);

public record GetProductReviewsQuery(Guid ProductId) : IRequest<List<ReviewDto>>;
public record GetReviewEligibilityQuery(Guid ProductId) : IRequest<ReviewEligibilityDto>;
public record ReviewEligibilityDto(bool CanReview, bool HasReviewed);

public class GetProductReviewsQueryHandler : IRequestHandler<GetProductReviewsQuery, List<ReviewDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetProductReviewsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<ReviewDto>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == request.ProductId)
            .OrderByDescending(r => r.Created)
            .ToListAsync(cancellationToken);
        var verifiedUserIds = await _context.OrderItems
            .Where(item => item.ProductId == request.ProductId && item.Order.Status == OrderStatus.Delivered)
            .Select(item => item.Order.UserId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var dtos = reviews.Select(r =>
        {
            var authorName = $"{r.User.FirstName} {r.User.LastName}".Trim();
            var initials = (r.User.FirstName?.FirstOrDefault().ToString() + r.User.LastName?.FirstOrDefault().ToString()).Trim().ToUpper();
            if (string.IsNullOrEmpty(initials)) initials = "U";
            
            return new ReviewDto(
                r.Id,
                authorName,
                initials,
                r.Rating,
                r.Created.ToString("MMMM d, yyyy"),
                r.Rating >= 4 ? "Great Product!" : r.Rating == 3 ? "It's okay" : "Not satisfied", 
                r.Comment,
                verifiedUserIds.Contains(r.UserId),
                0, 
                r.UserId == currentUserId
            );
        }).ToList();

        return dtos;
    }
}

public class GetReviewEligibilityQueryHandler : IRequestHandler<GetReviewEligibilityQuery, ReviewEligibilityDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetReviewEligibilityQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<ReviewEligibilityDto> Handle(GetReviewEligibilityQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId)) return new ReviewEligibilityDto(false, false);

        var hasReviewed = await _context.Reviews.AnyAsync(review =>
            review.ProductId == request.ProductId && review.UserId == userId, cancellationToken);
        var hasDeliveredOrder = await _context.OrderItems.AnyAsync(item =>
            item.ProductId == request.ProductId &&
            item.Order.UserId == userId &&
            item.Order.Status == Budgetha.Domain.Enums.OrderStatus.Delivered,
            cancellationToken);

        return new ReviewEligibilityDto(hasDeliveredOrder && !hasReviewed, hasReviewed);
    }
}
