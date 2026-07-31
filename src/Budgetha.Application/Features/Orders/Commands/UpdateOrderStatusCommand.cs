using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Orders.Commands;

public record UpdateOrderStatusCommand(Guid OrderId, OrderStatus Status) : IRequest<bool>;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;

    public UpdateOrderStatusCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService,
        INotificationService notificationService,
        IEmailService emailService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
        _emailService = emailService;
    }

    public async Task<bool> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        // Ideally verify if user is admin/seller here. For simplicity, we just process it.

        var order = await _context.Orders
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
            throw new NotFoundException(nameof(Domain.Entities.Order), request.OrderId);

        order.Status = request.Status;
        await _context.SaveChangesAsync(cancellationToken);

        // Send notifications if status is Shipped
        if (request.Status == OrderStatus.Shipped)
        {
            if (order.User != null && !string.IsNullOrEmpty(order.User.Email))
            {
                var emailHtml = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>
                    <div style='background-color: #2563eb; color: white; padding: 20px; text-align: center;'>
                        <h2 style='margin: 0;'>Order Shipped</h2>
                    </div>
                    <div style='padding: 20px;'>
                        <p>Hi {order.User.FirstName},</p>
                        <p>Good news! Your order <strong>#{order.Id.ToString().Substring(0, 8).ToUpper()}</strong> has been shipped and is on its way to you.</p>
                        <p>Thank you for shopping with us.</p>
                    </div>
                    <div style='background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;'>
                        &copy; {DateTime.UtcNow.Year} Budgetha. All rights reserved.
                    </div>
                </div>";

                await _emailService.SendEmailAsync(order.User.Email, $"Order Shipped #{order.Id.ToString().Substring(0, 8).ToUpper()}", emailHtml);
                await _notificationService.SendNotificationAsync(order.UserId, "Order Shipped", $"Your order #{order.Id.ToString().Substring(0, 8).ToUpper()} has been shipped.", "Order", order.Id.ToString());
            }
        }

        return true;
    }
}
