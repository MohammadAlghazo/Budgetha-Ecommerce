using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Addresses.Commands;

public record DeleteAddressCommand(Guid Id) : IRequest<bool>;

public class DeleteAddressCommandHandler : IRequestHandler<DeleteAddressCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteAddressCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            return false;

        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == request.Id && a.UserId == userId, cancellationToken);
        if (address == null) return false;

        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
