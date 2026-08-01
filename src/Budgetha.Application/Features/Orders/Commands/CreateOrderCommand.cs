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
    private readonly IOrderCommunicationService _communications;
    private readonly IInventoryLockService _inventoryLockService;
    private readonly ICheckoutPricingService _pricingService;

    public CreateOrderCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService,
        IOrderCommunicationService communications,
        IInventoryLockService inventoryLockService,
        ICheckoutPricingService pricingService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _communications = communications;
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
                var futureReserved = await InventoryRules.GetMaximumFutureReservedQuantityAsync(
                    _context, cartItem.ProductId, variant?.Id, cancellationToken);
                if (stock - cartItem.Quantity < futureReserved)
                    throw new InvalidOperationException($"Product {cartItem.Product.Name} has units reserved for upcoming rentals.");
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

        if (!isPayPal)
        {
            var sellerIds = cart.Items
                .Select(item => item.Product.SellerId)
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .Cast<string>();
            await _communications.QueueSaleAsync(
                order,
                user?.FirstName ?? string.Empty,
                sellerIds,
                "Cash on Delivery",
                cancellationToken);
        }

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            await inventoryTransaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException("One or more products in your cart were just sold out or updated. Please try again.");
        }

        return order.Id;
    }
}
