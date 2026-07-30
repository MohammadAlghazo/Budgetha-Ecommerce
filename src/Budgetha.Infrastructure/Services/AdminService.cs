using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Products.Queries;
using Budgetha.Domain.Entities;
using Budgetha.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Budgetha.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<List<AdminUserDto>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = new List<AdminUserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var isBanned = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;
            userDtos.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles,
                CreatedAt = user.Created,
                IsBanned = isBanned
            });
        }

        return userDtos.OrderByDescending(u => u.CreatedAt).ToList();
    }

    public async Task<List<AdminUserDto>> GetRecentUsersAsync(int count)
    {
        var users = await _userManager.Users
            .OrderByDescending(u => u.Created)
            .Take(count)
            .ToListAsync();

        var userDtos = new List<AdminUserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var isBanned = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;
            userDtos.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles,
                CreatedAt = user.Created,
                IsBanned = isBanned
            });
        }

        return userDtos;
    }

    public async Task<AdminStatsDto> GetStatsAsync()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var pendingProducts = await _context.Products.CountAsync(p => p.ApprovalStatus == Budgetha.Domain.Enums.ApprovalStatus.Pending);
        var totalOrders = await _context.Orders.CountAsync();

        return new AdminStatsDto
        {
            TotalUsers = totalUsers,
            TotalProducts = totalProducts,
            PendingProducts = pendingProducts,
            TotalOrders = totalOrders
        };
    }

    public async Task<bool> DeleteProductAsync(Guid productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<AdminUserProfileDto?> GetUserProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        var isBanned = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;

        var products = await _context.Products
            .Where(p => p.CreatedBy == userId)
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

    public async Task<bool> BanUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        // Set lockout enabled if not already
        if (!await _userManager.GetLockoutEnabledAsync(user))
        {
            await _userManager.SetLockoutEnabledAsync(user, true);
        }

        // Ban for 100 years
        var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
        return result.Succeeded;
    }

    public async Task<bool> UnbanUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var result = await _userManager.SetLockoutEndDateAsync(user, null);
        return result.Succeeded;
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        // Optional: Manual cleanup if EF cascade delete isn't configured for all user-related tables.
        // Assuming EF handles cascade delete properly or we just delete the user.
        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }
}
