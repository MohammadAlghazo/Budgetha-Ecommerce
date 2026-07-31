using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Cart;
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
    private readonly IInventoryLockService _inventoryLockService;
    private readonly ICheckoutPricingService _pricingService;

    public CreateOrderCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService,
        INotificationService notificationService,
        IEmailService emailService,
        IInventoryLockService inventoryLockService,
        ICheckoutPricingService pricingService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
        _emailService = emailService;
        _inventoryLockService = inventoryLockService;
        _pricingService = pricingService;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        if (!request.ShippingAddressId.HasValue)
            throw new ValidationException(new[] { "A shipping address is required." });

        var shippingAddress = await _context.Addresses
            .SingleOrDefaultAsync(a => a.Id == request.ShippingAddressId.Value && a.UserId == userId, cancellationToken);
        if (shippingAddress == null)
            throw new UnauthorizedAccessException("The shipping address does not belong to the current user.");

        var isPayPal = request.PaymentMethod.Equals("CreditCard", StringComparison.OrdinalIgnoreCase) ||
                       request.PaymentMethod.Equals("PayPal", StringComparison.OrdinalIgnoreCase);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart == null || !cart.Items.Any())
            throw new InvalidOperationException("Cart is empty.");

        await using var inventoryTransaction = await _inventoryLockService.BeginTransactionAsync(
            cart.Items.Select(item => item.VariantId ?? item.ProductId), cancellationToken);

        cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .ThenInclude(p => p.Variants)
            .FirstAsync(c => c.Id == cart.Id, cancellationToken);

        var quote = await _pricingService.CalculateAsync(
            userId, shippingAddress.Country, shippingAddress.State, request.PromoCode, cancellationToken);

        // 2. Validate Stock and Calculate Total
        var orderItems = new List<OrderItem>();
        var pendingRentals = new Dictionary<Guid, List<InventoryRules.RentalReservation>>();

        foreach (var cartItem in cart.Items.OrderBy(item => item.Type == OrderItemType.Rental ? 1 : 0))
        {
            if (!cartItem.Product.IsActive || cartItem.Product.ApprovalStatus != ApprovalStatus.Approved)
                throw new InvalidOperationException($"Product {cartItem.Product.Name} is no longer available.");

            var variant = InventoryRules.ValidateVariant(
                cartItem.Product, cartItem.VariantId, cartItem.Color, cartItem.Size);
            var stock = variant?.StockQuantity ?? cartItem.Product.StockQuantity;

            if (cartItem.Type == OrderItemType.Rental)
            {
                if (!cartItem.Product.IsAvailableForRent)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} is not available for rent.");
                CartRules.ValidateRentalDates(cartItem.RentalStartDate, cartItem.RentalEndDate);
                var inventoryId = variant?.Id ?? cartItem.ProductId;
                if (!pendingRentals.TryGetValue(inventoryId, out var pending))
                {
                    pending = [];
                    pendingRentals[inventoryId] = pending;
                }
                var totalRented = await InventoryRules.GetMaximumReservedQuantityAsync(
                    _context, cartItem.ProductId, variant?.Id, cartItem.RentalStartDate!.Value,
                    cartItem.RentalEndDate!.Value, cancellationToken, pending);

                if (stock - totalRented < cartItem.Quantity)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} does not have enough stock available for the selected dates.");
                pending.Add(new InventoryRules.RentalReservation(
                    cartItem.RentalStartDate.Value, cartItem.RentalEndDate.Value, cartItem.Quantity));
            }
            else 
            {
                if (stock < cartItem.Quantity)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} does not have enough stock available.");
                if (variant != null)
                    variant.StockQuantity -= cartItem.Quantity;
                else
                    cartItem.Product.StockQuantity -= cartItem.Quantity;
            }

            // Calculate Price (Assuming basic price for purchase, ignoring rental logic complexity for now)
            decimal itemPrice = variant?.Price ?? cartItem.Product.Price;
            if (cartItem.Type == OrderItemType.Rental && cartItem.RentalStartDate.HasValue && cartItem.RentalEndDate.HasValue)
            {
                var days = CartRules.GetChargedDays(cartItem.RentalStartDate.Value, cartItem.RentalEndDate.Value);
                itemPrice = (variant?.RentalPricePerDay ?? cartItem.Product.RentalPricePerDay ?? itemPrice) * days;
            }

            var quoteLine = quote.Lines.Single(line => line.CartItemId == cartItem.Id);
            if (quoteLine.UnitPrice != itemPrice || quoteLine.Quantity != cartItem.Quantity)
                throw new InvalidOperationException("The cart price changed while the order was being created. Please review your cart and try again.");

            orderItems.Add(new OrderItem
            {
                ProductId = cartItem.ProductId,
                VariantId = variant?.Id,
                Quantity = cartItem.Quantity,
                UnitPrice = itemPrice,
                DiscountAmount = quoteLine.DiscountAmount,
                Type = cartItem.Type,
                RentalStartDate = cartItem.RentalStartDate,
                RentalEndDate = cartItem.RentalEndDate,
                Color = variant?.Color,
                Size = variant?.Size
            });
        }

        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);

        // 3. Create Order
        var order = new Order
        {
            UserId = userId,
            Status = OrderStatus.Pending,
            Subtotal = quote.Subtotal,
            DiscountAmount = quote.DiscountAmount,
            ShippingAmount = quote.ShippingAmount,
            TaxAmount = quote.TaxAmount,
            TotalAmount = quote.TotalAmount,
            Currency = quote.Currency,
            PromoCode = quote.PromoCode,
            PromoScope = quote.PromoScope,
            PromoSellerId = quote.PromoSellerId,
            Notes = request.Notes,
            ShippingAddressId = request.ShippingAddressId,
            ShippingFullName = shippingAddress.FullName,
            ShippingLine1 = shippingAddress.Line1,
            ShippingLine2 = shippingAddress.Line2,
            ShippingCity = shippingAddress.City,
            ShippingState = shippingAddress.State,
            ShippingPostalCode = shippingAddress.PostalCode,
            ShippingCountry = shippingAddress.Country,
            ShippingPhone = shippingAddress.Phone,
            ContactEmail = user?.Email,
            ContactPhone = shippingAddress.Phone,
            Items = orderItems,
            ReservationExpiresAt = isPayPal ? DateTimeOffset.UtcNow.AddMinutes(30) : null
        };

        // 4. Create Payment if not COD
        if (isPayPal)
        {
            order.Payment = new Payment
            {
                Amount = quote.TotalAmount,
                Currency = quote.Currency,
                Status = PaymentStatus.Pending,
                Provider = PaymentProvider.PayPal
            };
        }
        else
        {
            order.Payment = new Payment
            {
                Amount = quote.TotalAmount,
                Currency = quote.Currency,
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
            await inventoryTransaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException("One or more products in your cart were just sold out or updated. Please try again.");
        }

        // 6. Send Notifications & Emails
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
