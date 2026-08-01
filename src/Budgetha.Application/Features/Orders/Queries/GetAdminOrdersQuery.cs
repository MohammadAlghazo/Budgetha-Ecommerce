using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Orders.Queries;

public class AdminOrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string PaymentProvider { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public List<AdminFulfillmentDto> Fulfillments { get; set; } = new();
    public List<AdminDeliveryReportDto> DeliveryReports { get; set; } = new();
}

public class AdminFulfillmentDto
{
    public Guid Id { get; set; }
    public string SellerId { get; set; } = string.Empty;
    public string SellerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Carrier { get; set; }
    public string? TrackingNumber { get; set; }
    public DateTimeOffset? ShippedAt { get; set; }
    public DateTimeOffset? DeliveredAt { get; set; }
    public string? RejectionReason { get; set; }
    public bool CanShip { get; set; }
    public bool CanReject { get; set; }
    public List<AdminFulfillmentItemDto> Items { get; set; } = new();
}

public class AdminFulfillmentItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class AdminDeliveryReportDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? AdminNote { get; set; }
}

public record GetAdminOrdersQuery : IRequest<List<AdminOrderDto>>;

public class GetAdminOrdersQueryHandler : IRequestHandler<GetAdminOrdersQuery, List<AdminOrderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;

    public GetAdminOrdersQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IIdentityService identityService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
    }

    public async Task<List<AdminOrderDto>> Handle(GetAdminOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        var roles = await _identityService.GetRolesAsync(userId);
        
        IQueryable<Domain.Entities.Order> query = _context.Orders
            .Include(o => o.User)
            .Include(o => o.Payment)
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Items).ThenInclude(i => i.Seller)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Seller)
            .Include(o => o.Fulfillments).ThenInclude(f => f.Items).ThenInclude(i => i.Product)
            .Include(o => o.DeliveryReports);

        if (!roles.Contains("Admin") && !roles.Contains("SuperAdmin"))
        {
            // If just a seller, return only orders containing their products
            query = query.Where(o => o.Fulfillments.Any(f => f.SellerId == userId));
        }

        var orders = await query
            .OrderByDescending(o => o.Created)
            .ToListAsync(cancellationToken);

        var isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");
        return orders.Select(o => new AdminOrderDto
        {
            Id = o.Id,
            OrderNumber = $"BGT-{o.Created.Year}-{o.Id.ToString()[..4].ToUpperInvariant()}",
            UserId = o.UserId,
            UserName = o.User == null ? "Unknown User" : $"{o.User.FirstName} {o.User.LastName}".Trim(),
            CreatedAt = o.Created.DateTime,
            Status = o.Status.ToString(),
            TotalAmount = o.TotalAmount,
            Currency = o.Currency,
            PaymentProvider = o.Payment?.Provider.ToString() ?? string.Empty,
            PaymentStatus = o.Payment?.Status.ToString() ?? string.Empty,
            ShippingAddress = string.Join(", ", new[] { o.ShippingLine1, o.ShippingLine2, o.ShippingCity, o.ShippingState, o.ShippingPostalCode, o.ShippingCountry }.Where(x => !string.IsNullOrWhiteSpace(x))),
            Fulfillments = o.Fulfillments
                .Where(f => isAdmin || f.SellerId == userId)
                .Select(f => new AdminFulfillmentDto
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
                    RejectionReason = f.RejectionReason,
                    CanShip = f.SellerId == userId && f.Status == Domain.Enums.FulfillmentStatus.Processing,
                    CanReject = f.SellerId == userId && f.Status == Domain.Enums.FulfillmentStatus.Processing &&
                                (o.Payment?.Status != PaymentStatus.Completed || o.Payment.Provider == PaymentProvider.Mock),
                    Items = f.Items.Select(i => new AdminFulfillmentItemDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        ProductImage = i.Product.ThumbnailUrl ?? string.Empty,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    }).ToList()
                }).ToList(),
            DeliveryReports = o.DeliveryReports.Select(r => new AdminDeliveryReportDto
            {
                Id = r.Id,
                Status = r.Status.ToString(),
                Reason = r.Reason,
                CreatedAt = r.Created,
                AdminNote = r.AdminNote
            }).ToList()
        }).ToList();
    }
}
