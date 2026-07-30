using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Orders.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Queries;

public class GetTransactionHistoryQuery : IRequest<List<TransactionHistoryDto>>
{
    public string Type { get; set; } = "All"; // "All", "Sales", "Purchases"
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class GetTransactionHistoryQueryHandler : IRequestHandler<GetTransactionHistoryQuery, List<TransactionHistoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetTransactionHistoryQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<TransactionHistoryDto>> Handle(GetTransactionHistoryQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(currentUserId))
        {
            return new List<TransactionHistoryDto>();
        }

        var results = new List<TransactionHistoryDto>();

        // 1. Fetch Purchases (where current user is the buyer)
        if (request.Type == "All" || request.Type == "Purchases")
        {
            var purchaseOrders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Where(o => o.UserId == currentUserId)
                .Where(o => !request.StartDate.HasValue || o.Created >= request.StartDate.Value)
                .Where(o => !request.EndDate.HasValue || o.Created <= request.EndDate.Value)
                .ToListAsync(cancellationToken);

            foreach (var order in purchaseOrders)
            {
                var dto = new TransactionHistoryDto
                {
                    OrderId = order.Id,
                    OrderNumber = $"BGT-{order.Created.Year}-{order.Id.ToString().Substring(0, 4).ToUpper()}",
                    Date = order.Created.Date,
                    Type = "Purchase",
                    TotalAmount = order.TotalAmount,
                    Status = order.Status.ToString(),
                    CustomerName = "You"
                };

                foreach (var item in order.Items)
                {
                    dto.Items.Add(new TransactionItemDto
                    {
                        ProductId = item.ProductId,
                        ProductName = item.Product.Name,
                        ProductImage = item.Product.ThumbnailUrl ?? "",
                        Quantity = item.Quantity,
                        Price = item.UnitPrice
                    });
                }
                results.Add(dto);
            }
        }

        // 2. Fetch Sales (where current user is the seller of the product)
        if (request.Type == "All" || request.Type == "Sales")
        {
            // Note: Since a single Order could contain products from multiple sellers,
            // we need to find OrderItems where the Product's SellerId == CurrentUserId.
            // And then group them by OrderId so we display one row per Order for the seller.
            
            var salesItems = await _context.OrderItems
                .Include(i => i.Order)
                .ThenInclude(o => o.User)
                .Include(i => i.Product)
                .Where(i => i.Product.SellerId == currentUserId)
                .Where(i => !request.StartDate.HasValue || i.Order.Created >= request.StartDate.Value)
                .Where(i => !request.EndDate.HasValue || i.Order.Created <= request.EndDate.Value)
                .ToListAsync(cancellationToken);

            var groupedSales = salesItems.GroupBy(i => i.Order);

            foreach (var group in groupedSales)
            {
                var order = group.Key;
                var sellerTotalAmount = group.Sum(i => i.UnitPrice * i.Quantity);

                var dto = new TransactionHistoryDto
                {
                    OrderId = order.Id,
                    OrderNumber = $"BGT-{order.Created.Year}-{order.Id.ToString().Substring(0, 4).ToUpper()}",
                    Date = order.Created.Date,
                    Type = "Sale",
                    TotalAmount = sellerTotalAmount, // Only the amount for this seller's products
                    Status = order.Status.ToString(),
                    CustomerName = $"{order.User.FirstName} {order.User.LastName}"
                };

                foreach (var item in group)
                {
                    dto.Items.Add(new TransactionItemDto
                    {
                        ProductId = item.ProductId,
                        ProductName = item.Product.Name,
                        ProductImage = item.Product.ThumbnailUrl ?? "",
                        Quantity = item.Quantity,
                        Price = item.UnitPrice
                    });
                }
                results.Add(dto);
            }
        }

        // Sort results by Date descending
        return results.OrderByDescending(x => x.Date).ToList();
    }
}
