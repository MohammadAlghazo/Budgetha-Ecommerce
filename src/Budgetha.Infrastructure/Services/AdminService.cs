using Budgetha.Application.Common.Interfaces;
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
            userDtos.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles,
                CreatedAt = user.Created
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
            userDtos.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles,
                CreatedAt = user.Created
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
}
