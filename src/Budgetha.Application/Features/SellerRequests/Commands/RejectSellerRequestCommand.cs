using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Commands;

public record RejectSellerRequestCommand(Guid RequestId) : IRequest<bool>;

public class RejectSellerRequestCommandHandler : IRequestHandler<RejectSellerRequestCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RejectSellerRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RejectSellerRequestCommand request, CancellationToken cancellationToken)
    {
        var sellerRequest = await _context.SellerRequests
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);
            
        if (sellerRequest == null || sellerRequest.Status != "Pending")
            return false;

        sellerRequest.Status = "Rejected";

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
