using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Categories.Queries;

public record GetCategoriesQuery() : IRequest<List<CategoryDto>>;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCategoriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Image = c.ImageUrl ?? "",
                ProductCount = c.Products.Count(p => p.IsActive && p.ApprovalStatus == ApprovalStatus.Approved)
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return categories;
    }
}
