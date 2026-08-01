using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Orders.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Queries;

public record GetCustomerOrdersQuery : IRequest<List<CustomerOrderDto>>;
public record GetCustomerOrderQuery(Guid OrderId) : IRequest<CustomerOrderDto?>;
public record GetCustomerOrderByNumberQuery(string OrderNumber) : IRequest<CustomerOrderDto?>;

public class GetCustomerOrdersQueryHandler : IRequestHandler<GetCustomerOrdersQuery, List<CustomerOrderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCustomerOrdersQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<CustomerOrderDto>> Handle(GetCustomerOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var orders = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Items).ThenInclude(i => i.Seller)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Seller)
            .Include(o => o.DeliveryReports)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.Created)
            .ToListAsync(cancellationToken);

        return orders.Select(ToDto).ToList();
    }

    public static CustomerOrderDto ToDto(Domain.Entities.Order order) => new()
    {
        Id = order.Id,
        OrderNumber = GetOrderNumber(order),
        Date = order.Created.DateTime,
        Status = order.Status.ToString(),
        Subtotal = order.Subtotal,
        DiscountAmount = order.DiscountAmount,
        ShippingAmount = order.ShippingAmount,
        TaxAmount = order.TaxAmount,
        TotalAmount = order.TotalAmount,
        Currency = order.Currency,
        PaymentProvider = order.Payment?.Provider.ToString(),
        PaymentStatus = order.Payment?.Status.ToString(),
        CanConfirmReceipt = order.Fulfillments.Any(f => f.Status != Domain.Enums.FulfillmentStatus.Rejected) &&
                            order.Fulfillments.Where(f => f.Status != Domain.Enums.FulfillmentStatus.Rejected)
                                .All(f => f.Status == Domain.Enums.FulfillmentStatus.Shipped) &&
                            !order.DeliveryReports.Any(r => r.Status == Domain.Enums.DeliveryReportStatus.Open),
        CanReportNotReceived = order.Fulfillments.Any(f => f.Status == Domain.Enums.FulfillmentStatus.Shipped) &&
                               !order.DeliveryReports.Any(r => r.Status == Domain.Enums.DeliveryReportStatus.Open),
        Fulfillments = order.Fulfillments.Select(f => new CustomerFulfillmentDto
        {
            Id = f.Id,
            SellerId = f.SellerId,
            SellerName = f.Seller == null ? "Seller" : $"{f.Seller.FirstName} {f.Seller.LastName}".Trim(),
            Amount = f.Amount,
            Status = f.Status.ToString(),
            Carrier = f.Carrier,
            TrackingNumber = f.TrackingNumber,
            ShippedAt = f.ShippedAt,
            DeliveredAt = f.DeliveredAt,
            RejectedAt = f.RejectedAt,
            RejectionReason = f.RejectionReason
        }).ToList(),
        DeliveryReports = order.DeliveryReports.Select(r => new CustomerDeliveryReportDto
        {
            Id = r.Id,
            FulfillmentId = r.FulfillmentId,
            Status = r.Status.ToString(),
            Reason = r.Reason,
            CreatedAt = r.Created,
            AdminNote = r.AdminNote
        }).ToList(),
        ShippingAddress = new CustomerShippingAddressDto
        {
            FullName = order.ShippingFullName,
            Phone = order.ShippingPhone,
            Line1 = order.ShippingLine1,
            Line2 = order.ShippingLine2,
            City = order.ShippingCity,
            State = order.ShippingState,
            PostalCode = order.ShippingPostalCode,
            Country = order.ShippingCountry
        },
        Items = order.Items.Select(item => new CustomerOrderItemDto
        {
            ProductId = item.ProductId,
            VariantId = item.VariantId,
            ProductName = item.Product.Name,
            ProductImage = item.Product.ThumbnailUrl ?? string.Empty,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            DiscountAmount = item.DiscountAmount,
            Type = item.Type.ToString(),
            RentalStartDate = item.RentalStartDate,
            RentalEndDate = item.RentalEndDate,
            Color = item.Color,
            Size = item.Size,
            FulfillmentId = item.FulfillmentId,
            SellerName = item.Seller == null ? "Seller" : $"{item.Seller.FirstName} {item.Seller.LastName}".Trim()
        }).ToList()
    };

    private static string GetOrderNumber(Domain.Entities.Order order) =>
        $"BGT-{order.Created.Year}-{order.Id.ToString()[..4].ToUpperInvariant()}";
}

public class GetCustomerOrderQueryHandler : IRequestHandler<GetCustomerOrderQuery, CustomerOrderDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCustomerOrderQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<CustomerOrderDto?> Handle(GetCustomerOrderQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Items).ThenInclude(i => i.Seller)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Seller)
            .Include(o => o.DeliveryReports)
            .SingleOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken);

        return order == null ? null : GetCustomerOrdersQueryHandler.ToDto(order);
    }
}

public class GetCustomerOrderByNumberQueryHandler : IRequestHandler<GetCustomerOrderByNumberQuery, CustomerOrderDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCustomerOrderByNumberQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<CustomerOrderDto?> Handle(GetCustomerOrderByNumberQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Items).ThenInclude(i => i.Seller)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Seller)
            .Include(o => o.DeliveryReports)
            .Where(o => o.UserId == userId)
            .ToListAsync(cancellationToken);

        var match = order.SingleOrDefault(o =>
            $"BGT-{o.Created.Year}-{o.Id.ToString()[..4].ToUpperInvariant()}".Equals(request.OrderNumber, StringComparison.OrdinalIgnoreCase));
        return match == null ? null : GetCustomerOrdersQueryHandler.ToDto(match);
    }
}
