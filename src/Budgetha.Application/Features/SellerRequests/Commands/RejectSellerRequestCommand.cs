using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Commands;

public record RejectSellerRequestCommand(Guid RequestId) : IRequest<bool>;

public class RejectSellerRequestCommandHandler : IRequestHandler<RejectSellerRequestCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RejectSellerRequestCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RejectSellerRequestCommand request, CancellationToken cancellationToken)
    {
        var sellerRequest = await _context.SellerRequests
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);
            
        if (sellerRequest == null || sellerRequest.Status != "Pending")
            return false;

        sellerRequest.Status = "Rejected";

        var verification = await _context.SellerVerifications
            .FirstOrDefaultAsync(v => v.UserId == sellerRequest.UserId && v.Status == Budgetha.Domain.Enums.VerificationStatus.Pending, cancellationToken);
            
        if (verification != null)
        {
            verification.Status = Budgetha.Domain.Enums.VerificationStatus.Rejected;
            verification.ReviewedBy = _currentUserService.UserId;
            verification.RejectionReason = "Seller request was rejected by admin.";
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
