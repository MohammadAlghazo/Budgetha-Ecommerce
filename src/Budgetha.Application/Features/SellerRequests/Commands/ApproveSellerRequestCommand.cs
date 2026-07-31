using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Commands;

public record ApproveSellerRequestCommand(Guid RequestId) : IRequest<bool>;

public class ApproveSellerRequestCommandHandler : IRequestHandler<ApproveSellerRequestCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUserService;

    public ApproveSellerRequestCommandHandler(IApplicationDbContext context, IIdentityService identityService, ICurrentUserService currentUserService)
    {
        _context = context;
        _identityService = identityService;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ApproveSellerRequestCommand request, CancellationToken cancellationToken)
    {
        var sellerRequest = await _context.SellerRequests
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);
            
        if (sellerRequest == null || sellerRequest.Status != "Pending")
            return false;

        sellerRequest.Status = "Approved";
        
        var verification = await _context.SellerVerifications
            .FirstOrDefaultAsync(v => v.UserId == sellerRequest.UserId && v.Status == Budgetha.Domain.Enums.VerificationStatus.Pending, cancellationToken);
            
        if (verification != null)
        {
            verification.Status = Budgetha.Domain.Enums.VerificationStatus.Approved;
            verification.ReviewedBy = _currentUserService.UserId;
        }
        
        await _identityService.AssignRoleAsync(sellerRequest.UserId, "Seller");

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
