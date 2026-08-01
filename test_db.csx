using System;
using System.Linq;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var db = new ApplicationDbContext(
    new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseNpgsql("Host=localhost;Database=budgetha;Username=postgres;Password=postgres")
        .Options, null, null);

var product = db.Products.Include(p => p.Variants).Include(p => p.Category).FirstOrDefault();

if (product != null)
{
    Console.WriteLine($"Product: {product.Name}");
    Console.WriteLine($"Price: {product.Price}");
    Console.WriteLine($"IsActive: {product.IsActive}");
    Console.WriteLine($"Category Slug: {product.Category.Slug}");
    Console.WriteLine($"ApprovalStatus: {product.ApprovalStatus}");
    Console.WriteLine($"Variants Count: {product.Variants.Count}");
    foreach (var variant in product.Variants)
    {
        Console.WriteLine($"  Variant SKU: {variant.SKU}, IsActive: {variant.IsActive}, Price: {variant.Price}, Stock: {variant.StockQuantity}");
    }
}
else
{
    Console.WriteLine("No product found in DB.");
}
