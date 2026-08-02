using System;
using System.Linq;
using System.Threading.Tasks;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

class Program
{
    static async Task Main()
    {
        var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddConsole();
        });

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql("Host=localhost;Database=budgetha;Username=postgres;Password=postgres")
            .EnableSensitiveDataLogging()
            .UseLoggerFactory(loggerFactory)
            .Options;

        using var context = new ApplicationDbContext(options, null, null);

        // 1. Get user cart
        var userId = "edc0c4f1-8162-43fa-904c-9c57d2c57ce1";
        var cart = await context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            context.Carts.Add(cart);
            await context.SaveChangesAsync();
        }

        // 2. Get product (AsNoTracking)
        var product = await context.Products.Include(p => p.Variants).AsNoTracking().FirstOrDefaultAsync();
        if (product == null) return;
        var variant = product.Variants.FirstOrDefault();

        // 3. Add to cart
        var newItem = new CartItem
        {
            ProductId = product.Id,
            VariantId = variant?.Id,
            Quantity = 1,
            Type = OrderItemType.Purchase
        };
        cart.Items.Add(newItem);

        try
        {
            await context.SaveChangesAsync();
            Console.WriteLine("Saved successfully!");
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine("DB Error: " + ex.Message);
            if (ex.InnerException != null)
                Console.WriteLine("Inner: " + ex.InnerException.Message);
        }
    }
}
