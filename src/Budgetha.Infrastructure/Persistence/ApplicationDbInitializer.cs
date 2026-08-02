using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
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

    public static async Task<string?> BootstrapSuperAdminAsync(
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        var section = configuration.GetSection("BootstrapAdmin");
        if (!section.GetValue<bool>("Enabled")) return null;

        var email = section["Email"]?.Trim();
        var password = section["Password"];
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("BootstrapAdmin requires Email and Password when enabled.");

        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var superAdmin = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = section["FirstName"]?.Trim() ?? "Development",
            LastName = section["LastName"]?.Trim() ?? "Administrator",
            EmailConfirmed = true
        };

        var passwordErrors = new List<IdentityError>();
        foreach (var validator in userManager.PasswordValidators)
        {
            var validation = await validator.ValidateAsync(userManager, superAdmin, password);
            if (!validation.Succeeded) passwordErrors.AddRange(validation.Errors);
        }
        if (passwordErrors.Count > 0)
            throw new InvalidOperationException($"BootstrapAdmin password is invalid: {string.Join("; ", passwordErrors.Select(e => e.Description))}");

        var existing = await userManager.FindByEmailAsync(email);
        if (existing is not null)
        {
            if (!await userManager.IsInRoleAsync(existing, "SuperAdmin"))
                throw new InvalidOperationException("BootstrapAdmin email belongs to an existing non-SuperAdmin account.");

            return existing.Id;
        }

        var result = await userManager.CreateAsync(superAdmin, password);
        if (!result.Succeeded)
            throw new InvalidOperationException($"BootstrapAdmin could not be created: {string.Join("; ", result.Errors.Select(e => e.Description))}");

        var roleResult = await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(superAdmin);
            throw new InvalidOperationException($"BootstrapAdmin role assignment failed: {string.Join("; ", roleResult.Errors.Select(e => e.Description))}");
        }

        return superAdmin.Id;
    }

    public static async Task SeedCatalogAsync(ApplicationDbContext context, string? sellerId)
    {
        if (sellerId is null) return;
        if (context.Categories.Any() || context.Products.Any()) return;

        var electronics = new Category { Name = "Electronics", Slug = "electronics" };
        var clothing = new Category { Name = "Clothing", Slug = "clothing" };
        
        context.Categories.AddRange(electronics, clothing);
        await context.SaveChangesAsync();

        var products = new List<Product>
        {
            new Product { Name = "Wireless Noise-Cancelling Headphones", Slug = "wireless-headphones", Description = "Premium over-ear headphones.", Price = 299.99m, StockQuantity = 50, Categories = new List<Category> { electronics }, SellerId = sellerId, ApprovalStatus = Budgetha.Domain.Enums.ApprovalStatus.Approved },
            new Product { Name = "Minimalist Mechanical Keyboard", Slug = "mechanical-keyboard", Description = "Sleek keyboard.", Price = 149.99m, StockQuantity = 20, Categories = new List<Category> { electronics }, SellerId = sellerId, ApprovalStatus = Budgetha.Domain.Enums.ApprovalStatus.Approved },
            new Product { Name = "Cotton Blend T-Shirt", Slug = "cotton-tshirt", Description = "Comfortable everyday tee.", Price = 24.99m, StockQuantity = 100, Categories = new List<Category> { clothing }, SellerId = sellerId, ApprovalStatus = Budgetha.Domain.Enums.ApprovalStatus.Approved }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}
