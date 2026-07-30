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

public class AdminUserDto
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public IList<string> Roles { get; set; } = new List<string>();
    public DateTimeOffset? CreatedAt { get; set; }
}

public interface IAdminService
{
    Task<AdminStatsDto> GetStatsAsync();
    Task<List<AdminUserDto>> GetRecentUsersAsync(int count);
    Task<List<AdminUserDto>> GetAllUsersAsync();
    Task<bool> DeleteProductAsync(Guid productId);
}
