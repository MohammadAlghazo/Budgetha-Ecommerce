using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
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
                true, 
                0, 
                r.UserId == currentUserId
            );
        }).ToList();

        return dtos;
    }
}
