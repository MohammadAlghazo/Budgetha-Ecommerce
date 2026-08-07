using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Budgetha.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin")]
public class DatabaseSeedController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public DatabaseSeedController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost("seed-products")]
    public async Task<IActionResult> SeedProducts()
    {
        var targetUsers = new[] { "Lina Ahmad", "Sara Nasser", "Ahmad Yassin", "Mohammad Alghazo" };
        var users = new List<ApplicationUser>();

        foreach (var name in targetUsers)
        {
            var parts = name.Split(' ');
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.FirstName == parts[0] && u.LastName == parts[1]);
            if (user != null) users.Add(user);
        }

        if (users.Count == 0) return BadRequest("No target users found.");

        var categories = await _context.Categories.ToListAsync();
        if (categories.Count < 5)
        {
            var newCats = new List<Category>
            {
                new Category { Name = "Smartphones", Slug = "smartphones", Description = "Latest smartphones and accessories." },
                new Category { Name = "Laptops", Slug = "laptops", Description = "High performance laptops for work and gaming." },
                new Category { Name = "Men's Fashion", Slug = "mens-fashion", Description = "Trendy clothing and accessories for men." },
                new Category { Name = "Women's Fashion", Slug = "womens-fashion", Description = "Elegant and stylish clothing for women." },
                new Category { Name = "Home Appliances", Slug = "home-appliances", Description = "Essential appliances for your home." },
                new Category { Name = "Books", Slug = "books", Description = "Bestselling books across all genres." },
                new Category { Name = "Sports & Outdoors", Slug = "sports", Description = "Gear and apparel for sports and outdoor activities." }
            };
            foreach(var c in newCats)
            {
                if(!categories.Any(x => x.Slug == c.Slug))
                {
                    _context.Categories.Add(c);
                    categories.Add(c);
                }
            }
            await _context.SaveChangesAsync();
        }

        var rng = new Random(42);
        var productsAdded = 0;

        foreach (var user in users)
        {
            var existingProducts = await _context.Products.CountAsync(p => p.SellerId == user.Id);
            if (existingProducts >= 10) continue;

            for (int i = existingProducts; i < 10; i++)
            {
                var prodData = GenerateProduct(user.FirstName, i, categories, rng);
                prodData.SellerId = user.Id;
                _context.Products.Add(prodData);
                productsAdded++;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { Message = $"Added {productsAdded} products." });
    }

    private Product GenerateProduct(string userFirstName, int index, List<Category> categories, Random rng)
    {
        var templates = new List<(string name, string desc, decimal price, int stock, List<Category> cats, string img)>
        {
            ("Samsung Galaxy S24 Ultra", "Experience the ultimate smartphone with AI features, a stunning display, and a pro-grade camera system.", 1199.99m, 15, GetCats(categories, "smartphones", "electronics"), "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800"),
            ("MacBook Pro M3 Max", "Supercharged for pros. The most advanced Mac laptop for demanding workflows.", 2499.00m, 8, GetCats(categories, "laptops", "electronics"), "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800"),
            ("Sony WH-1000XM5 Noise Cancelling Headphones", "Industry leading noise cancellation with two processors control 8 microphones for unprecedented noise cancellation.", 398.00m, 25, GetCats(categories, "electronics", "smartphones"), "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800"),
            ("Nike Air Force 1 '07", "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.", 115.00m, 50, GetCats(categories, "mens-fashion", "clothing"), "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800"),
            ("Dyson V15 Detect Absolute", "The most powerful, intelligent cordless vacuum. Reveals invisible dust.", 749.99m, 12, GetCats(categories, "home-appliances"), "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800"),
            ("The Psychology of Money", "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave.", 18.99m, 100, GetCats(categories, "books"), "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"),
            ("Garmin Fenix 7X Pro", "Ultimate multisport GPS smartwatch with a large 1.4” display, built-in LED flashlight, and solar charging lens.", 899.99m, 10, GetCats(categories, "sports", "electronics"), "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"),
            ("Zara Tailored Wool Coat", "Long coat made of wool blend fabric. Lapel collar and long sleeves. Front flap pockets.", 149.00m, 30, GetCats(categories, "womens-fashion", "clothing"), "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800"),
            ("KitchenAid Artisan Series 5 Quart", "Make up to 9 dozen cookies in a single batch with the KitchenAid Artisan Series 5 Quart Tilt-Head Stand Mixer.", 449.99m, 20, GetCats(categories, "home-appliances"), "https://images.unsplash.com/photo-1593011388053-4876251bbf39?auto=format&fit=crop&q=80&w=800"),
            ("Spalding NBA Official Game Basketball", "The official basketball of the NBA. Features a full-grain leather cover that turns butter-soft once broken in.", 169.99m, 40, GetCats(categories, "sports"), "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=800"),
            ("LG C3 Series 65-Inch Class OLED", "The OLED evo C3 blends into the background with an almost invisible bezel for a seamless look.", 1696.99m, 5, GetCats(categories, "electronics", "home-appliances"), "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800"),
            ("Atomic Habits", "No matter your goals, Atomic Habits offers a proven framework for improving--every day.", 13.99m, 150, GetCats(categories, "books"), "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"),
            ("Yeti Rambler 20 oz Tumbler", "Any tumbler that's coming along for the ride needs to be tough enough to keep up.", 35.00m, 80, GetCats(categories, "sports", "home-appliances"), "https://images.unsplash.com/photo-1614213193988-18e47eb5ce83?auto=format&fit=crop&q=80&w=800"),
            ("Levi's 501 Original Fit Jeans", "The blueprint for every jean in existence - burned into the world's collective cortex.", 79.50m, 60, GetCats(categories, "mens-fashion", "womens-fashion", "clothing"), "https://images.unsplash.com/photo-1542272604-780c8d5a1ce7?auto=format&fit=crop&q=80&w=800"),
            ("Nintendo Switch OLED Model", "Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen with the Nintendo Switch system.", 349.99m, 25, GetCats(categories, "electronics", "sports"), "https://images.unsplash.com/photo-1578306044702-863a137bc39d?auto=format&fit=crop&q=80&w=800")
        };

        var t = templates[(index + userFirstName.Length * 3) % templates.Count];

        var product = new Product
        {
            Name = $"{t.name} (By {userFirstName})",
            Slug = $"{t.name}-{userFirstName}-{index}-{Guid.NewGuid().ToString().Substring(0, 4)}".ToLower().Replace(" ", "-").Replace("'", ""),
            Description = t.desc,
            Price = t.price,
            StockQuantity = t.stock,
            Categories = t.cats,
            ThumbnailUrl = t.img,
            ThumbnailPublicId = $"dummy-{Guid.NewGuid()}",
            Brand = "PremiumBrand",
            IsActive = true,
            ApprovalStatus = ApprovalStatus.Approved,
            IsFeatured = rng.NextDouble() > 0.8,
            Images = new List<ProductImage>
            {
                new ProductImage { Url = t.img, PublicId = $"dummy-img-{Guid.NewGuid()}", DisplayOrder = 0 }
            }
        };

        return product;
    }

    private List<Category> GetCats(List<Category> all, params string[] slugs)
    {
        var result = new List<Category>();
        foreach (var s in slugs)
        {
            var c = all.FirstOrDefault(x => x.Slug == s);
            if (c != null) result.Add(c);
        }
        if (result.Count == 0) result.Add(all.First());
        return result;
    }
}
