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

    public static async Task SeedCatalogAsync(ApplicationDbContext context)
    {
        if (context.Categories.Any() || context.Products.Any()) return;

        var electronics = new Category { Name = "Electronics", Slug = "electronics" };
        var clothing = new Category { Name = "Clothing", Slug = "clothing" };
        
        context.Categories.AddRange(electronics, clothing);
        await context.SaveChangesAsync();

        var superAdmin = context.Users.FirstOrDefault(u => u.Email == "superadmin@budgetha.com");
        var sellerId = superAdmin?.Id ?? Guid.NewGuid().ToString(); // Fallback if not found

        var products = new List<Product>
        {
            new Product { Name = "Wireless Noise-Cancelling Headphones", Slug = "wireless-headphones", Description = "Premium over-ear headphones.", Price = 299.99m, StockQuantity = 50, CategoryId = electronics.Id, SellerId = sellerId, ApprovalStatus = Budgetha.Domain.Enums.ApprovalStatus.Approved },
            new Product { Name = "Minimalist Mechanical Keyboard", Slug = "mechanical-keyboard", Description = "Sleek keyboard.", Price = 149.99m, StockQuantity = 20, CategoryId = electronics.Id, SellerId = sellerId, ApprovalStatus = Budgetha.Domain.Enums.ApprovalStatus.Approved },
            new Product { Name = "Cotton Blend T-Shirt", Slug = "cotton-tshirt", Description = "Comfortable everyday tee.", Price = 24.99m, StockQuantity = 100, CategoryId = clothing.Id, SellerId = sellerId, ApprovalStatus = Budgetha.Domain.Enums.ApprovalStatus.Approved }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}
