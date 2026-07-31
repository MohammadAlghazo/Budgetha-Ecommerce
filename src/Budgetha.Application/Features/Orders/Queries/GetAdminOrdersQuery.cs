using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Orders.Queries;

public record AdminOrderDto(
    Guid Id,
    string UserName,
    DateTime CreatedAt,
    int Status,
    decimal TotalAmount
);

public record GetAdminOrdersQuery : IRequest<List<AdminOrderDto>>;

public class GetAdminOrdersQueryHandler : IRequestHandler<GetAdminOrdersQuery, List<AdminOrderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;

    public GetAdminOrdersQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IIdentityService identityService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
    }

    public async Task<List<AdminOrderDto>> Handle(GetAdminOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var roles = await _identityService.GetRolesAsync(userId);
        
        IQueryable<Domain.Entities.Order> query = _context.Orders.Include(o => o.User).Include(o => o.Items).ThenInclude(i => i.Product);

        if (!roles.Contains("Admin") && !roles.Contains("SuperAdmin"))
        {
            // If just a seller, return only orders containing their products
            query = query.Where(o => o.Items.Any(i => i.Product.SellerId == userId));
        }

        var orders = await query
            .OrderByDescending(o => o.Created)
            .Select(o => new AdminOrderDto(
                o.Id,
                o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : "Unknown User",
                o.Created.DateTime,
                (int)o.Status,
                o.TotalAmount
            ))
            .ToListAsync(cancellationToken);

        return orders;
    }
}
