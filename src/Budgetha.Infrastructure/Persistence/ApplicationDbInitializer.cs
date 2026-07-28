using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Budgetha.Infrastructure.Persistence;

public static class ApplicationDbInitializer
{
    public static readonly string[] AllRoles = ["SuperAdmin", "Admin", "Seller", "User"];

    public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        foreach (var role in AllRoles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    public static async Task SeedSuperAdminAsync(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        const string email = "superadmin@budgetha.com";
        var existing = await userManager.FindByEmailAsync(email);
        if (existing is not null) return;

        var superAdmin = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = "Super",
            LastName = "Admin",
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(superAdmin, "SuperAdmin@123!");
        if (result.Succeeded)
            await userManager.AddToRolesAsync(superAdmin, AllRoles);
    }
}
