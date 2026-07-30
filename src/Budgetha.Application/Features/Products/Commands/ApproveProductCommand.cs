using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Commands;

public record ApproveProductCommand(Guid ProductId, ApprovalStatus Status) : IRequest<bool>;

public class ApproveProductCommandHandler : IRequestHandler<ApproveProductCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ApproveProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ApproveProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product == null) return false;

        product.ApprovalStatus = request.Status;
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
