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
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
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
        TotalAmount = order.TotalAmount,
        PaymentProvider = order.Payment?.Provider.ToString(),
        PaymentStatus = order.Payment?.Status.ToString(),
        ShippingAddress = order.ShippingAddress == null ? null : new CustomerShippingAddressDto
        {
            FullName = order.ShippingAddress.FullName,
            Line1 = order.ShippingAddress.Line1,
            Line2 = order.ShippingAddress.Line2,
            City = order.ShippingAddress.City,
            State = order.ShippingAddress.State,
            PostalCode = order.ShippingAddress.PostalCode,
            Country = order.ShippingAddress.Country
        },
        Items = order.Items.Select(item => new CustomerOrderItemDto
        {
            ProductId = item.ProductId,
            VariantId = item.VariantId,
            ProductName = item.Product.Name,
            ProductImage = item.Product.ThumbnailUrl ?? string.Empty,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Type = item.Type.ToString(),
            RentalStartDate = item.RentalStartDate,
            RentalEndDate = item.RentalEndDate,
            Color = item.Color,
            Size = item.Size
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
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
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
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
            .Where(o => o.UserId == userId)
            .ToListAsync(cancellationToken);

        var match = order.SingleOrDefault(o =>
            $"BGT-{o.Created.Year}-{o.Id.ToString()[..4].ToUpperInvariant()}".Equals(request.OrderNumber, StringComparison.OrdinalIgnoreCase));
        return match == null ? null : GetCustomerOrdersQueryHandler.ToDto(match);
    }
}
