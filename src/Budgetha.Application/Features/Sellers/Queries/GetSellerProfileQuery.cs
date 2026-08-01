using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Sellers.Queries;

public record GetSellerProfileQuery(string SellerId) : IRequest<SellerProfileDto?>;

public sealed class SellerProfileDto
{
    public string Id { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
    public string? BusinessName { get; init; }
    public string? BusinessDescription { get; init; }
    public DateTimeOffset MemberSince { get; init; }
    public int ActiveProductCount { get; init; }
    public int ReviewCount { get; init; }
    public decimal AverageRating { get; init; }
}

public sealed class GetSellerProfileQueryHandler : IRequestHandler<GetSellerProfileQuery, SellerProfileDto?>
{
    private readonly IApplicationDbContext _context;

    public GetSellerProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SellerProfileDto?> Handle(GetSellerProfileQuery request, CancellationToken cancellationToken)
    {
        var seller = await _context.Users
            .AsNoTracking()
            .Where(user => user.Id == request.SellerId &&
                           user.Products.Any(product => product.IsActive && product.ApprovalStatus == ApprovalStatus.Approved))
            .Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.UserName,
                user.AvatarUrl,
                user.Created,
                Verification = user.SellerVerification,
                Products = user.Products.Where(product => product.IsActive && product.ApprovalStatus == ApprovalStatus.Approved)
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (seller is null) return null;

        var reviewRatings = await _context.Reviews
            .AsNoTracking()
            .Where(review => review.Product.SellerId == seller.Id &&
                             review.Product.IsActive &&
                             review.Product.ApprovalStatus == ApprovalStatus.Approved)
            .Select(review => review.Rating)
            .ToListAsync(cancellationToken);

        var displayName = $"{seller.FirstName} {seller.LastName}".Trim();
        if (string.IsNullOrWhiteSpace(displayName))
            displayName = seller.UserName ?? "Seller";

        return new SellerProfileDto
        {
            Id = seller.Id,
            DisplayName = displayName,
            AvatarUrl = seller.AvatarUrl,
            BusinessName = seller.Verification?.Status == VerificationStatus.Approved
                ? seller.Verification.BusinessName
                : null,
            BusinessDescription = seller.Verification?.Status == VerificationStatus.Approved
                ? seller.Verification.BusinessDescription
                : null,
            MemberSince = seller.Created,
            ActiveProductCount = seller.Products.Count(),
            ReviewCount = reviewRatings.Count,
            AverageRating = reviewRatings.Count == 0 ? 0 : Math.Round((decimal)reviewRatings.Average(), 1)
        };
    }
}
