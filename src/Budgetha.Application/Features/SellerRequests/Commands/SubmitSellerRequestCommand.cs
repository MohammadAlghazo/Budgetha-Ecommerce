using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Commands;

public record SubmitSellerRequestCommand : IRequest<Guid>
{
    public string Reason { get; init; } = string.Empty;
    public string BusinessName { get; init; } = string.Empty;
    public string BusinessDescription { get; init; } = string.Empty;
    public string? DocumentUrl { get; init; }
}

public class SubmitSellerRequestCommandHandler : IRequestHandler<SubmitSellerRequestCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public SubmitSellerRequestCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(SubmitSellerRequestCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        
        var existing = await _context.SellerRequests
            .FirstOrDefaultAsync(r => r.UserId == userId && r.Status == "Pending", cancellationToken);
            
        if (existing != null)
            return existing.Id;

        var sellerRequest = new SellerRequest
        {
            UserId = userId,
            Status = "Pending",
            Reason = request.Reason
        };
        _context.SellerRequests.Add(sellerRequest);

        var verification = await _context.SellerVerifications
            .SingleOrDefaultAsync(candidate => candidate.UserId == userId, cancellationToken);
        if (verification?.Status == Budgetha.Domain.Enums.VerificationStatus.Approved)
            throw new InvalidOperationException("This account is already an approved seller.");

        if (verification is null)
        {
            verification = new SellerVerification { UserId = userId };
            _context.SellerVerifications.Add(verification);
        }

        var documentUrl = string.IsNullOrWhiteSpace(request.DocumentUrl) ? null : request.DocumentUrl.Trim();
        if (documentUrl is not null && !string.Equals(documentUrl, verification.DocumentUrl, StringComparison.Ordinal))
        {
            var pendingDocument = await _context.PendingImageUploads.SingleOrDefaultAsync(upload =>
                upload.UserId == userId && upload.Url == documentUrl, cancellationToken);
            if (pendingDocument is null)
                throw new UnauthorizedAccessException("The verification document was not uploaded by the current user.");
            _context.PendingImageUploads.Remove(pendingDocument);
        }

        verification.BusinessName = string.IsNullOrWhiteSpace(request.BusinessName) ? "Unknown" : request.BusinessName.Trim();
        verification.BusinessDescription = request.BusinessDescription?.Trim() ?? string.Empty;
        verification.DocumentUrl = documentUrl;
        verification.Status = Budgetha.Domain.Enums.VerificationStatus.Pending;
        verification.ReviewedBy = null;
        verification.RejectionReason = null;

        await _context.SaveChangesAsync(cancellationToken);

        return sellerRequest.Id;
    }
}
