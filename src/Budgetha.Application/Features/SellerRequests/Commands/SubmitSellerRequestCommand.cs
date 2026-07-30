using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Commands;

public record SubmitSellerRequestCommand : IRequest<Guid>
{
    public string Reason { get; init; } = string.Empty;
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
        await _context.SaveChangesAsync(cancellationToken);

        return sellerRequest.Id;
    }
}
