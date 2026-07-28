using Budgetha.API.Middleware;
using Budgetha.API.Services;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.DependencyInjection;
using Budgetha.Infrastructure.DependencyInjection;
using Budgetha.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await ApplicationDbInitializer.SeedRolesAsync(services);
    await ApplicationDbInitializer.SeedSuperAdminAsync(services);
}

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
