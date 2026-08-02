using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Budgetha.Infrastructure.Persistence;

var services = new ServiceCollection();
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql("Host=ep-fancy-shape-agm0ehmi.c-2.eu-central-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_R9K3vGnlxhbj;SSL Mode=Require;Trust Server Certificate=true;"));

var provider = services.BuildServiceProvider();
var db = provider.GetRequiredService<ApplicationDbContext>();

var indexes = db.Database.SqlQueryRaw<string>("SELECT indexdef FROM pg_indexes WHERE tablename = 'CartItems'").ToList();

foreach (var index in indexes)
{
    Console.WriteLine(index);
}
