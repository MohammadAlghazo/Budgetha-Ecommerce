using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Products.Queries;

public record PriceBoundsDto(decimal MinPrice, decimal MaxPrice);

public record GetPriceBoundsQuery(Guid? CategoryId = null, string? SearchTerm = null) : IRequest<PriceBoundsDto>;

public class GetPriceBoundsQueryHandler : IRequestHandler<GetPriceBoundsQuery, PriceBoundsDto>
{
    private readonly IApplicationDbContext _context;

    public GetPriceBoundsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PriceBoundsDto> Handle(GetPriceBoundsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products.Where(p => p.ApprovalStatus == ApprovalStatus.Approved);

        if (request.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchTerm) || 
                                     p.Description.ToLower().Contains(searchTerm) || 
                                     (p.Brand != null && p.Brand.ToLower().Contains(searchTerm)));
        }

        if (!await query.AnyAsync(cancellationToken))
            return new PriceBoundsDto(0, 1000);

        var minPrice = await query.MinAsync(p => p.Price, cancellationToken);
        var maxPrice = await query.MaxAsync(p => p.Price, cancellationToken);

        return new PriceBoundsDto(minPrice, maxPrice);
    }
}
