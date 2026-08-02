using System;
using Microsoft.EntityFrameworkCore;
using Budgetha.Infrastructure.Persistence;

var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseNpgsql("Host=localhost;Database=budgetha;Username=postgres;Password=postgres")
    .Options;
using var context = new ApplicationDbContext(options, null, null);
var conn = context.Database.GetDbConnection();
conn.Open();
using var cmd = conn.CreateCommand();
cmd.CommandText = "SELECT tgname, tgenabled FROM pg_trigger WHERE tgrelid = '\"CartItems\"'::regclass;";
using var reader = cmd.ExecuteReader();
var count = 0;
while(reader.Read()) {
    Console.WriteLine($"Trigger: {reader.GetString(0)}, Enabled: {reader.GetString(1)}");
    count++;
}
if(count == 0) Console.WriteLine("No triggers found on CartItems.");
