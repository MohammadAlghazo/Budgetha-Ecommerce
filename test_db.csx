using System;
using System.Linq;
using System.Threading.Tasks;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

async Task RunTest()
{
    var db = new ApplicationDbContext(
        new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql("Host=localhost;Database=budgetha;Username=postgres;Password=postgres")
            .Options, null, null);

    var counts = await db.Products.GroupBy(p => p.Name).Select(g => new { g.Key, Count = g.Count() }).Where(c => c.Count > 1).ToListAsync();
    Console.WriteLine($"Products with duplicate names: {counts.Count}");
    if (counts.Any()) {
        Console.WriteLine($"Example: {counts.First().Key} has {counts.First().Count} copies");
    }
}

RunTest().GetAwaiter().GetResult();

