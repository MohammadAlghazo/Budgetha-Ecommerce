using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Commands;

public record CreateOrderCommand(
    Guid? ShippingAddressId,
    string? Notes,
    string PaymentMethod,
    string? PromoCode
) : IRequest<Guid>;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;

    public CreateOrderCommandHandler(
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

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        if (request.ShippingAddressId.HasValue && !await _context.Addresses
                .AnyAsync(a => a.Id == request.ShippingAddressId.Value && a.UserId == userId, cancellationToken))
            throw new UnauthorizedAccessException("The shipping address does not belong to the current user.");

        var isPayPal = request.PaymentMethod.Equals("CreditCard", StringComparison.OrdinalIgnoreCase) ||
                       request.PaymentMethod.Equals("PayPal", StringComparison.OrdinalIgnoreCase);

        // 1. Get Cart
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null || !cart.Items.Any())
            throw new InvalidOperationException("Cart is empty.");

        // 2. Validate Stock and Calculate Total
        decimal totalAmount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var cartItem in cart.Items)
        {
            if (cartItem.Product.StockQuantity < cartItem.Quantity)
                throw new InvalidOperationException($"Not enough stock for product {cartItem.Product.Name}");

            if (cartItem.Type == OrderItemType.Rental)
            {
                if (!cartItem.RentalStartDate.HasValue || !cartItem.RentalEndDate.HasValue)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} requires rental dates.");

                var overlappingOrders = await _context.OrderItems
                    .Include(oi => oi.Order)
                    .Where(oi => oi.ProductId == cartItem.ProductId &&
                                 oi.Type == OrderItemType.Rental &&
                                 oi.Order != null && 
                                 oi.Order.Status != OrderStatus.Cancelled &&
                                 oi.Order.Status != OrderStatus.Failed &&
                                 oi.RentalStartDate <= cartItem.RentalEndDate &&
                                 oi.RentalEndDate >= cartItem.RentalStartDate)
                    .ToListAsync(cancellationToken);

                var totalRented = overlappingOrders.Sum(oi => oi.Quantity);
                
                if (cartItem.Product.StockQuantity - totalRented < cartItem.Quantity)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} does not have enough stock available for the selected dates.");
            }
            else 
            {
                if (cartItem.Product.StockQuantity < cartItem.Quantity)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} does not have enough stock available.");
                // Reduce Stock only for purchase, since rental stock returns after date
                cartItem.Product.StockQuantity -= cartItem.Quantity;
            }

            // Calculate Price (Assuming basic price for purchase, ignoring rental logic complexity for now)
            decimal itemPrice = cartItem.Product.Price;
            if (cartItem.Type == OrderItemType.Rental && cartItem.RentalStartDate.HasValue && cartItem.RentalEndDate.HasValue)
            {
                var days = cartItem.RentalEndDate.Value.DayNumber - cartItem.RentalStartDate.Value.DayNumber;
                itemPrice = (cartItem.Product.RentalPricePerDay ?? cartItem.Product.Price) * Math.Max(1, days);
            }

            totalAmount += itemPrice * cartItem.Quantity;

            orderItems.Add(new OrderItem
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                UnitPrice = itemPrice,
                Type = cartItem.Type,
                RentalStartDate = cartItem.RentalStartDate,
                RentalEndDate = cartItem.RentalEndDate,
                Color = cartItem.Color,
                Size = cartItem.Size
            });
        }

        // Apply Promo Code if exists
        if (!string.IsNullOrWhiteSpace(request.PromoCode))
        {
            var promo = await _context.PromoCodes
                .FirstOrDefaultAsync(p => p.Code.ToLower() == request.PromoCode.ToLower() && p.IsActive, cancellationToken);
            
            if (promo != null && (!promo.ExpiryDate.HasValue || promo.ExpiryDate.Value > DateTime.UtcNow))
            {
                var discountAmount = totalAmount * (promo.DiscountPercentage / 100);
                if (promo.MaxDiscountAmount.HasValue && discountAmount > promo.MaxDiscountAmount.Value)
                {
                    discountAmount = promo.MaxDiscountAmount.Value;
                }
                totalAmount -= discountAmount;
                if (totalAmount < 0) totalAmount = 0;
            }
        }

        // 3. Create Order
        var order = new Order
        {
            UserId = userId,
            Status = OrderStatus.Pending,
            TotalAmount = totalAmount,
            Notes = request.Notes,
            ShippingAddressId = request.ShippingAddressId,
            Items = orderItems,
            ReservationExpiresAt = isPayPal ? DateTimeOffset.UtcNow.AddMinutes(30) : null
        };

        // 4. Create Payment if not COD
        if (isPayPal)
        {
            order.Payment = new Payment
            {
                Amount = totalAmount,
                Currency = "USD",
                Status = PaymentStatus.Pending,
                Provider = PaymentProvider.PayPal
            };
        }
        else
        {
            order.Payment = new Payment
            {
                Amount = totalAmount,
                Currency = "USD",
                Status = PaymentStatus.Pending,
                Provider = PaymentProvider.CashOnDelivery
            };
        }

        _context.Orders.Add(order);

        // Keep PayPal carts intact until capture so an abandoned checkout loses neither stock nor cart.
        if (!isPayPal)
            _context.CartItems.RemoveRange(cart.Items);

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException("One or more products in your cart were just sold out or updated. Please try again.");
        }

        // 6. Send Notifications & Emails
        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            var invoiceHtml = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>
                <div style='background-color: #0f172a; color: white; padding: 20px; text-align: center;'>
                    <h2 style='margin: 0;'>Order Confirmation</h2>
                    <p style='margin: 5px 0 0 0; color: #94a3b8;'>Thank you for shopping at Budgetha!</p>
                </div>
                <div style='padding: 20px;'>
                    <p>Hi {user.FirstName},</p>
                    <p>We've received your order <strong>#{order.Id.ToString().Substring(0, 8).ToUpper()}</strong>. We will notify you once it's shipped.</p>
                    <h3 style='border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;'>Order Summary</h3>
                    <table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>
                        <tbody>
                            <tr>
                                <td style='padding: 8px 0; color: #475569;'>Total Amount:</td>
                                <td style='padding: 8px 0; text-align: right; font-weight: bold;'>${order.TotalAmount:F2}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px 0; color: #475569;'>Payment Method:</td>
                                <td style='padding: 8px 0; text-align: right;'>{request.PaymentMethod}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style='background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;'>
                    &copy; {DateTime.UtcNow.Year} Budgetha. All rights reserved.
                </div>
            </div>";

            try
            {
                await _emailService.SendEmailAsync(user.Email, $"Order Confirmation #{order.Id.ToString().Substring(0, 8).ToUpper()}", invoiceHtml);
                await _notificationService.SendNotificationAsync(userId, "Order Placed Successfully", $"Your order #{order.Id.ToString().Substring(0, 8).ToUpper()} has been received.", "Order", order.Id.ToString());
            }
            catch
            {
                // The order is committed; delivery failures must not turn success into an API error.
            }
        }

        // Notify sellers
        var sellerIds = cart.Items.Where(i => i.Product.SellerId != null).Select(i => i.Product.SellerId).Distinct().ToList();
        foreach (var sellerId in sellerIds)
        {
            if (sellerId != null)
            {
                try
                {
                    await _notificationService.SendNotificationAsync(sellerId, "New Sale!", "One or more of your products have been sold.", "Sale", order.Id.ToString());
                }
                catch
                {
                    // Notifications are post-commit best effort.
                }
            }
        }

        return order.Id;
    }
}
