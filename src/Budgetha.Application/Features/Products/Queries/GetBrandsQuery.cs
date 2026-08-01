using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Products.Queries;

public record GetBrandsQuery() : IRequest<List<string>>;

public class GetBrandsQueryHandler : IRequestHandler<GetBrandsQuery, List<string>>
{
    private readonly IApplicationDbContext _context;

    public GetBrandsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> Handle(GetBrandsQuery request, CancellationToken cancellationToken)
    {
        var brands = await _context.Products
            .Where(p => p.IsActive && p.ApprovalStatus == ApprovalStatus.Approved && !string.IsNullOrEmpty(p.Brand))
            .Select(p => p.Brand)
            .Distinct()
            .OrderBy(b => b)
            .ToListAsync(cancellationToken);

        return brands;
    }
}
