using System;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseNpgsql("Host=localhost;Database=budgetha;Username=postgres;Password=postgres")
    .Options;

var db = new ApplicationDbContext(options, null);
var conn = db.Database.GetDbConnection();
conn.Open();
var cmd = conn.CreateCommand();
cmd.CommandText = "SELECT column_name FROM information_schema.columns WHERE table_name = 'CartItems';";
using var reader = cmd.ExecuteReader();
while (reader.Read()) {
    Console.WriteLine(reader.GetString(0));
}
