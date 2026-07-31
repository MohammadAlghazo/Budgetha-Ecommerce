using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Commands;

public record CreatePayPalOrderCommand(Guid OrderId) : IRequest<string>;

public class CreatePayPalOrderCommandHandler : IRequestHandler<CreatePayPalOrderCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPaymentService _paymentService;

    public CreatePayPalOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IPaymentService paymentService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _paymentService = paymentService;
    }

    public async Task<string> Handle(CreatePayPalOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();

        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken);

        if (order == null) throw new NotFoundException(nameof(Order), request.OrderId);

        if (order.Payment == null || order.Payment.Status == Budgetha.Domain.Enums.PaymentStatus.Completed)
            throw new InvalidOperationException("Order cannot be paid with PayPal at this time.");

        var paypalOrderId = await _paymentService.CreatePayPalOrderAsync(order.TotalAmount);
        
        order.Payment.ExternalTransactionId = paypalOrderId;
        await _context.SaveChangesAsync(cancellationToken);

        return paypalOrderId;
    }
}
