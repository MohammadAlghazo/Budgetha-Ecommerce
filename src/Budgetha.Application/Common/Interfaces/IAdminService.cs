using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Budgetha.Application.Common.Interfaces;

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalProducts { get; set; }
    public int PendingProducts { get; set; }
    public int TotalOrders { get; set; }
}

public class SellerStatsDto
{
    public int TotalProducts { get; set; }
    public int TotalSales { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
}

public class AdminUserDto
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public IList<string> Roles { get; set; } = new List<string>();
    public DateTimeOffset? CreatedAt { get; set; }
    public bool IsBanned { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int Total { get; set; }
    public int TotalPages { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public class AdminUserOrderDto
{
    public string Id { get; set; } = null!;
    public string OrderNumber { get; set; } = null!;
    public DateTimeOffset Date { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = null!;
}

public class AdminUserProfileDto : AdminUserDto
{
    public List<Budgetha.Application.Features.Products.Queries.ProductDto> Products { get; set; } = new();
    public List<AdminUserOrderDto> Orders { get; set; } = new();
}

public interface IAdminService
{
    Task<AdminStatsDto> GetStatsAsync();
    Task<SellerStatsDto> GetSellerStatsAsync(string sellerId);
    Task<List<AdminUserDto>> GetRecentUsersAsync(int count);
    Task<PagedResult<AdminUserDto>> GetAllUsersAsync(int page = 1, int pageSize = 50);
    Task<List<AdminUserDto>> GetUsersByIdsAsync(IEnumerable<string> userIds);
    Task<AdminUserProfileDto?> GetUserProfileAsync(string userId);
    Task<bool> BanUserAsync(string actorId, bool actorIsSuperAdmin, string userId);
    Task<bool> UnbanUserAsync(string actorId, bool actorIsSuperAdmin, string userId);
    Task<bool> DeleteUserAsync(string actorId, bool actorIsSuperAdmin, string userId);
}
