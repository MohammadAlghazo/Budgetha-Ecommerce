using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Commands;

public record CapturePayPalOrderCommand(Guid OrderId, string PayPalOrderId) : IRequest<bool>;

public class CapturePayPalOrderCommandHandler : IRequestHandler<CapturePayPalOrderCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentService _paymentService;

    public CapturePayPalOrderCommandHandler(IApplicationDbContext context, IPaymentService paymentService)
    {
        _context = context;
        _paymentService = paymentService;
    }

    public async Task<bool> Handle(CapturePayPalOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null) throw new NotFoundException(nameof(Order), request.OrderId);
        
        if (order.Payment == null) throw new InvalidOperationException("No payment record found.");

        var success = await _paymentService.CapturePayPalOrderAsync(request.PayPalOrderId);

        if (success)
        {
            order.Payment.Status = PaymentStatus.Completed;
            
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        order.Payment.Status = PaymentStatus.Failed;
        await _context.SaveChangesAsync(cancellationToken);
        return false;
    }
}
