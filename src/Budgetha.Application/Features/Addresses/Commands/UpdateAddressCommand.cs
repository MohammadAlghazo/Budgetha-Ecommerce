using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Addresses.Commands;

public record UpdateAddressCommand(
    Guid Id,
    string FullName,
    string Line1,
    string? Line2,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault
) : IRequest<bool>;

public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateAddressCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            return false;

        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == request.Id && a.UserId == userId, cancellationToken);
        if (address == null) return false;

        if (request.IsDefault && !address.IsDefault)
        {
            var existingAddresses = await _context.Addresses.Where(a => a.UserId == userId && a.Id != request.Id).ToListAsync(cancellationToken);
            foreach (var addr in existingAddresses)
            {
                addr.IsDefault = false;
            }
        }

        address.FullName = request.FullName;
        address.Line1 = request.Line1;
        address.Line2 = request.Line2;
        address.City = request.City;
        address.State = request.State;
        address.PostalCode = request.PostalCode;
        address.Country = request.Country;
        address.IsDefault = request.IsDefault;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
