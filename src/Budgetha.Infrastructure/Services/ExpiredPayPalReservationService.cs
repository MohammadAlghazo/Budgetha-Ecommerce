using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Budgetha.Infrastructure.Services;

public sealed class ExpiredPayPalReservationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ExpiredPayPalReservationService> _logger;

    public ExpiredPayPalReservationService(
        IServiceScopeFactory scopeFactory,
        ILogger<ExpiredPayPalReservationService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(1));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await ReleaseExpiredReservationsAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Failed to release expired PayPal reservations.");
            }
        }
    }

    private async Task ReleaseExpiredReservationsAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var orders = await context.Orders
            .Include(order => order.Payment)
            .Include(order => order.Items)
            .ThenInclude(item => item.Product)
            .Include(order => order.Items)
            .ThenInclude(item => item.Variant)
            .Where(order => order.Status == OrderStatus.Pending &&
                            order.Payment != null &&
                            order.Payment.Provider == PaymentProvider.PayPal &&
                            order.Payment.Status == PaymentStatus.Pending &&
                            order.ReservationExpiresAt <= DateTimeOffset.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var order in orders)
        {
            order.Status = OrderStatus.Failed;
            order.Payment!.Status = PaymentStatus.Failed;
            order.ReservationExpiresAt = null;
            foreach (var item in order.Items.Where(item => item.Type == OrderItemType.Purchase))
            {
                if (item.Variant != null)
                    item.Variant.StockQuantity += item.Quantity;
                else
                    item.Product.StockQuantity += item.Quantity;
            }

            try
            {
                await context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Capture or cancellation won the race; their row-version prevents double release.
                context.ChangeTracker.Clear();
            }
        }
    }
}
