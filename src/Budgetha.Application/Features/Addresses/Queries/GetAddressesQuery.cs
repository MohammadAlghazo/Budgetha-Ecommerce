using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Addresses.Queries;

public record GetAddressesQuery : IRequest<List<AddressDto>>;

public class GetAddressesQueryHandler : IRequestHandler<GetAddressesQuery, List<AddressDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetAddressesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<AddressDto>> Handle(GetAddressesQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var addresses = await _context.Addresses
            .Where(a => a.UserId == userId)
            .Select(a => new AddressDto(
                a.Id,
                a.FullName,
                a.Phone,
                a.Line1,
                a.Line2,
                a.City,
                a.State,
                a.PostalCode,
                a.Country,
                a.IsDefault
            ))
            .ToListAsync(cancellationToken);

        return addresses;
    }
}
