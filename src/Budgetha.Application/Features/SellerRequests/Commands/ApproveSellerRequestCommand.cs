using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Commands;

public record ApproveSellerRequestCommand(Guid RequestId) : IRequest<bool>;

public class ApproveSellerRequestCommandHandler : IRequestHandler<ApproveSellerRequestCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public ApproveSellerRequestCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<bool> Handle(ApproveSellerRequestCommand request, CancellationToken cancellationToken)
    {
        var sellerRequest = await _context.SellerRequests
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);
            
        if (sellerRequest == null || sellerRequest.Status != "Pending")
            return false;

        sellerRequest.Status = "Approved";
        
        await _identityService.AssignRoleAsync(sellerRequest.UserId, "Seller");

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
