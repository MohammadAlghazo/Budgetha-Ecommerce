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
    private readonly ICurrentUserService _currentUserService;
    private readonly IPaymentService _paymentService;
    private readonly IOrderCompletionService _completionService;

    public CapturePayPalOrderCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IPaymentService paymentService,
        IOrderCompletionService completionService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _paymentService = paymentService;
        _completionService = completionService;
    }

    public async Task<bool> Handle(CapturePayPalOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException();

        var order = await _context.Orders
            .Include(o => o.Payment)
            .Include(o => o.Items)
            .ThenInclude(item => item.Product)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken);
        if (order == null)
            throw new NotFoundException(nameof(Order), request.OrderId);

        var payment = order.Payment ?? throw new InvalidOperationException("No payment record found.");
        if (payment.Provider != PaymentProvider.PayPal ||
            !string.Equals(payment.ExternalTransactionId, request.PayPalOrderId, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("The PayPal order does not match this payment.");
        }

        if (payment.Status == PaymentStatus.Completed)
            return !string.IsNullOrWhiteSpace(payment.ExternalCaptureId);
        if (payment.Status != PaymentStatus.Pending || order.Status != OrderStatus.Pending)
            throw new InvalidOperationException("Order cannot be captured in its current state.");
        if (order.ReservationExpiresAt <= DateTimeOffset.UtcNow)
            throw new InvalidOperationException("The stock reservation has expired.");

        payment.Status = PaymentStatus.Processing;
        await _context.SaveChangesAsync(cancellationToken);

        PayPalCaptureResult result;
        try
        {
            result = await _paymentService.CapturePayPalOrderAsync(
                request.PayPalOrderId,
                payment.Amount,
                payment.Currency,
                cancellationToken);
        }
        catch
        {
            throw new InvalidOperationException(
                "PayPal capture status is being reconciled. Do not retry or cancel this order until its status is updated.");
        }
        if (!result.IsValid || result.OrderId != payment.ExternalTransactionId || string.IsNullOrWhiteSpace(result.CaptureId))
        {
            throw new InvalidOperationException(
                "PayPal capture status is being reconciled. Do not retry or cancel this order until its status is updated.");
        }

        await _completionService.CompletePayPalAsync(
            order, payment, result.CaptureId, null, cancellationToken);

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            var completedByWebhook = await _context.Payments.AsNoTracking()
                .AnyAsync(candidate => candidate.Id == payment.Id && candidate.Status == PaymentStatus.Completed &&
                                       candidate.ExternalCaptureId == result.CaptureId, cancellationToken);
            if (completedByWebhook) return true;

            throw new InvalidOperationException("The order changed while payment was being captured. PayPal payment may require reconciliation.");
        }

        return true;
    }
}
