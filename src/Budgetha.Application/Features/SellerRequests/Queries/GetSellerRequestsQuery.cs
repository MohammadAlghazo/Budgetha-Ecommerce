using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.SellerRequests.Queries;

public class SellerRequestDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public DateTimeOffset Created { get; set; }
}

public class GetSellerRequestsQuery : IRequest<List<SellerRequestDto>>
{
    public string? Status { get; set; }
}

public class GetSellerRequestsQueryHandler : IRequestHandler<GetSellerRequestsQuery, List<SellerRequestDto>>
{
    private readonly IApplicationDbContext _context;

    public GetSellerRequestsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SellerRequestDto>> Handle(GetSellerRequestsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.SellerRequests.AsQueryable();

        if (!string.IsNullOrEmpty(request.Status))
        {
            query = query.Where(r => r.Status == request.Status);
        }

        var result = await query
            .OrderByDescending(r => r.Created)
            .Join(_context.Users, 
                  r => r.UserId, 
                  u => u.Id, 
                  (r, u) => new SellerRequestDto
                  {
                      Id = r.Id,
                      UserId = r.UserId,
                      Email = u.Email ?? "Unknown",
                      FullName = u.FirstName + " " + u.LastName,
                      Status = r.Status,
                      Reason = r.Reason,
                      Created = r.Created
                  })
            .ToListAsync(cancellationToken);

        return result;
    }
}
