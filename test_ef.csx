using System;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Budgetha.Domain.Entities;
using System.Linq;

var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseNpgsql("Host=localhost;Database=budgetha;Username=postgres;Password=postgres")
    .Options;

var db = new ApplicationDbContext(options, null);
Console.WriteLine("Total products: " + db.Products.Count());
var product = db.Products.FirstOrDefault();
if (product != null) {
    Console.WriteLine("First product ID: " + product.Id);
}
