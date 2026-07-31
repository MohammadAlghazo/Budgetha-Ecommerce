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
    string PaymentMethod
) : IRequest<Guid>;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

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

            // Reduce Stock
            cartItem.Product.StockQuantity -= cartItem.Quantity;

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
                RentalEndDate = cartItem.RentalEndDate
            });
        }

        // 3. Create Order
        var order = new Order
        {
            UserId = userId,
            Status = OrderStatus.Pending,
            TotalAmount = totalAmount,
            Notes = request.Notes,
            ShippingAddressId = request.ShippingAddressId,
            Items = orderItems
        };

        // 4. Create Payment if not COD
        if (request.PaymentMethod.Equals("CreditCard", StringComparison.OrdinalIgnoreCase) || request.PaymentMethod.Equals("PayPal", StringComparison.OrdinalIgnoreCase))
        {
            order.Payment = new Payment
            {
                Amount = totalAmount,
                Status = PaymentStatus.Pending,
                Provider = PaymentProvider.PayPal,
                ExternalTransactionId = Guid.NewGuid().ToString() // Mock transaction ID
            };
        }
        else
        {
            order.Payment = new Payment
            {
                Amount = totalAmount,
                Status = PaymentStatus.Pending,
                Provider = PaymentProvider.CashOnDelivery
            };
        }

        _context.Orders.Add(order);

        // 5. Clear Cart
        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync(cancellationToken);

        return order.Id;
    }
}
