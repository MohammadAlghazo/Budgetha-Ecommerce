using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Products.Queries;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Budgetha.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Budgetha.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMemoryCache _cache;
    private const string UsersCacheKey = "Admin_AllUsersCache";

    public AdminService(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IMemoryCache cache)
    {
        _context = context;
        _userManager = userManager;
        _cache = cache;
    }

    public async Task<PagedResult<AdminUserDto>> GetAllUsersAsync(int page = 1, int pageSize = 50)
    {
        var total = await _userManager.Users.CountAsync();
        var totalPages = (int)Math.Ceiling(total / (double)pageSize);

        var users = await _context.Users
            .OrderByDescending(u => u.Created)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                Email = u.Email!,
                FirstName = u.FirstName,
                LastName = u.LastName,
                CreatedAt = u.Created,
                IsBanned = u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTimeOffset.UtcNow
            })
            .ToListAsync();

        var userIds = users.Select(u => u.Id).ToList();
        var userRoles = await _context.UserRoles
            .Where(ur => userIds.Contains(ur.UserId))
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => new { ur.UserId, RoleName = r.Name })
            .ToListAsync();

        var roleLookup = userRoles.GroupBy(ur => ur.UserId)
            .ToDictionary(g => g.Key, g => g.Select(ur => ur.RoleName).ToList());

        foreach (var user in users)
        {
            user.Roles = roleLookup.ContainsKey(user.Id) ? roleLookup[user.Id]! : new List<string>();
        }

        return new PagedResult<AdminUserDto>
        {
            Items = users,
            Total = total,
            TotalPages = totalPages,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<List<AdminUserDto>> GetUsersByIdsAsync(IEnumerable<string> userIds)
    {
        var users = await _userManager.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();
        var userDtos = new List<AdminUserDto>();

        foreach (var user in users)
        {
            userDtos.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName
            });
        }

        return userDtos;
    }

    public async Task<List<AdminUserDto>> GetRecentUsersAsync(int count)
    {
        var users = await _context.Users
            .OrderByDescending(u => u.Created)
            .Take(count)
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                Email = u.Email!,
                FirstName = u.FirstName,
                LastName = u.LastName,
                CreatedAt = u.Created,
                IsBanned = u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTimeOffset.UtcNow
            })
            .ToListAsync();

        var userIds = users.Select(u => u.Id).ToList();
        var userRoles = await _context.UserRoles
            .Where(ur => userIds.Contains(ur.UserId))
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => new { ur.UserId, RoleName = r.Name })
            .ToListAsync();

        var roleLookup = userRoles.GroupBy(ur => ur.UserId)
            .ToDictionary(g => g.Key, g => g.Select(ur => ur.RoleName).ToList());

        foreach (var user in users)
        {
            user.Roles = roleLookup.ContainsKey(user.Id) ? roleLookup[user.Id]! : new List<string>();
        }

        return users;
    }

    public async Task<AdminStatsDto> GetStatsAsync()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();

        return new AdminStatsDto
        {
            TotalUsers = totalUsers,
            TotalProducts = totalProducts,
            PendingProducts = 0, // Feature removed
            TotalOrders = totalOrders
        };
    }

    public async Task<SellerStatsDto> GetSellerStatsAsync(string sellerId)
    {
        var totalProducts = await _context.Products.CountAsync(p => p.SellerId == sellerId);
        
        var orderItems = await _context.OrderItems
            .Include(oi => oi.Product)
            .Include(oi => oi.Order)
            .Where(oi => oi.Product.SellerId == sellerId &&
                         oi.Order.Status != OrderStatus.Cancelled && oi.Order.Status != OrderStatus.Failed)
            .ToListAsync();

        var totalSales = orderItems.Sum(oi => oi.Quantity);
        var totalRevenue = orderItems.Sum(oi => oi.Quantity * oi.UnitPrice - oi.DiscountAmount);
        var totalOrders = orderItems.Select(oi => oi.OrderId).Distinct().Count();

        return new SellerStatsDto
        {
            TotalProducts = totalProducts,
            TotalSales = totalSales,
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders
        };
    }

    public async Task<AdminUserProfileDto?> GetUserProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        var isBanned = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;

        var products = await _context.Products
            .Where(p => p.SellerId == userId)
            .OrderByDescending(p => p.Created)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                ShortDescription = p.Description,
                Price = p.Price,
                OriginalPrice = p.Price,
                Stock = p.StockQuantity,
                Category = p.Category != null ? p.Category.Name : "Uncategorized",
                Images = p.ThumbnailUrl != null ? new List<string> { p.ThumbnailUrl } : new List<string>(),
                Rating = p.Reviews.Any() ? (decimal)p.Reviews.Average(r => r.Rating) : 0m,
                ReviewCount = p.Reviews.Count(),
                ApprovalStatus = p.ApprovalStatus.ToString()
            })
            .ToListAsync();

        return new AdminUserProfileDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles,
            CreatedAt = user.Created,
            IsBanned = isBanned,
            Products = products
        };
    }

    public async Task<bool> BanUserAsync(string actorId, bool actorIsSuperAdmin, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || !await CanManageUserAsync(actorId, actorIsSuperAdmin, user)) return false;

        
        if (!await _userManager.GetLockoutEnabledAsync(user))
        {
            await _userManager.SetLockoutEnabledAsync(user, true);
        }

        
        var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
        if (result.Succeeded)
            _cache.Remove(UsersCacheKey);
        return result.Succeeded;
    }

    public async Task<bool> UnbanUserAsync(string actorId, bool actorIsSuperAdmin, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || !await CanManageUserAsync(actorId, actorIsSuperAdmin, user)) return false;

        var result = await _userManager.SetLockoutEndDateAsync(user, null);
        if (result.Succeeded)
            _cache.Remove(UsersCacheKey);
        return result.Succeeded;
    }

    public async Task<bool> DeleteUserAsync(string actorId, bool actorIsSuperAdmin, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || !await CanManageUserAsync(actorId, actorIsSuperAdmin, user)) return false;

        
        
        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
            _cache.Remove(UsersCacheKey);
        return result.Succeeded;
    }

    private async Task<bool> CanManageUserAsync(string actorId, bool actorIsSuperAdmin, ApplicationUser target)
    {
        if (target.Id == actorId) return false;

        var roles = await _userManager.GetRolesAsync(target);
        if (roles.Contains("SuperAdmin")) return false;
        return actorIsSuperAdmin || !roles.Contains("Admin");
    }
}
