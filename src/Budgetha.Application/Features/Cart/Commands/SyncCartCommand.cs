using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Cart.Commands;

public record SyncCartItemDto(Guid ProductId, int Quantity, string? Color, string? Size);

public record SyncCartCommand(List<SyncCartItemDto> Items) : IRequest;

public class SyncCartCommandHandler : IRequestHandler<SyncCartCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public SyncCartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(SyncCartCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) return;

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null)
        {
            cart = new Budgetha.Domain.Entities.Cart { UserId = userId };
            _context.Carts.Add(cart);
        }

        // Merge items instead of clearing
        foreach (var itemDto in request.Items)
        {
            var existingItem = cart.Items.FirstOrDefault(i => 
                i.ProductId == itemDto.ProductId && 
                i.Color == itemDto.Color && 
                i.Size == itemDto.Size);

            if (existingItem != null)
            {
                existingItem.Quantity += itemDto.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    Color = itemDto.Color,
                    Size = itemDto.Size
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
