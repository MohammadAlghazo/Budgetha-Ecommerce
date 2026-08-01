using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Features.Notifications.Queries.GetNotifications;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Budgetha.Infrastructure.Services;

public sealed class OutboxDeliveryWorker : BackgroundService
{
    private const int MaxAttempts = 8;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OutboxDeliveryWorker> _logger;
    private DateTimeOffset _nextCleanupAt = DateTimeOffset.MinValue;

    public OutboxDeliveryWorker(IServiceScopeFactory scopeFactory, ILogger<OutboxDeliveryWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await ProcessAvailableAsync(stoppingToken);
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(5));
        while (await timer.WaitForNextTickAsync(stoppingToken))
            await ProcessAvailableAsync(stoppingToken);
    }

    private async Task ProcessAvailableAsync(CancellationToken cancellationToken)
    {
        try
        {
            for (var processed = 0; processed < 50; processed++)
            {
                var id = await ClaimNextAsync(cancellationToken);
                if (id == null)
                    break;
                await DeliverAsync(id.Value, cancellationToken);
            }

            if (DateTimeOffset.UtcNow >= _nextCleanupAt)
            {
                await CleanupAsync(cancellationToken);
                _nextCleanupAt = DateTimeOffset.UtcNow.AddDays(1);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Outbox processing cycle failed.");
        }
    }

    private async Task<Guid?> ClaimNextAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var now = DateTimeOffset.UtcNow;
        var candidateId = await context.OutboxDeliveries
            .Where(delivery =>
                ((delivery.Status == OutboxDeliveryStatus.Pending || delivery.Status == OutboxDeliveryStatus.Failed) &&
                 delivery.NextAttemptAt <= now) ||
                (delivery.Status == OutboxDeliveryStatus.Processing && delivery.NextAttemptAt <= now))
            .OrderBy(delivery => delivery.CreatedAt)
            .Select(delivery => (Guid?)delivery.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (candidateId == null)
            return null;

        var claimed = await context.OutboxDeliveries
            .Where(delivery => delivery.Id == candidateId &&
                (((delivery.Status == OutboxDeliveryStatus.Pending || delivery.Status == OutboxDeliveryStatus.Failed) &&
                  delivery.NextAttemptAt <= now) ||
                 (delivery.Status == OutboxDeliveryStatus.Processing && delivery.NextAttemptAt <= now)))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(delivery => delivery.Status, OutboxDeliveryStatus.Processing)
                .SetProperty(delivery => delivery.Attempts, delivery => delivery.Attempts + 1)
                .SetProperty(delivery => delivery.NextAttemptAt, now.AddMinutes(5)), cancellationToken);
        return claimed == 1 ? candidateId : null;
    }

    private async Task DeliverAsync(Guid id, CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var delivery = await context.OutboxDeliveries
            .Include(item => item.Notification)
            .SingleAsync(item => item.Id == id, cancellationToken);

        try
        {
            switch (delivery.Type)
            {
                case OutboxDeliveryType.Email:
                    var sender = scope.ServiceProvider.GetRequiredService<IEmailSender>();
                    await sender.SendAsync(
                        delivery.Recipient,
                        delivery.Subject ?? string.Empty,
                        delivery.Body ?? string.Empty,
                        cancellationToken);
                    break;
                case OutboxDeliveryType.RealtimeNotification:
                    var notification = delivery.Notification
                        ?? throw new InvalidOperationException("Realtime delivery has no notification.");
                    var publisher = scope.ServiceProvider.GetRequiredService<IRealtimeNotificationPublisher>();
                    await publisher.PublishAsync(delivery.Recipient, new NotificationDto
                    {
                        Id = notification.Id.ToString(),
                        Title = notification.Title,
                        Message = notification.Message,
                        Type = notification.Type,
                        IsRead = notification.IsRead,
                        RelatedEntityId = notification.RelatedEntityId,
                        CreatedAt = notification.Created
                    }, cancellationToken);
                    break;
                default:
                    throw new InvalidOperationException($"Unsupported outbox delivery type {delivery.Type}.");
            }

            delivery.Status = OutboxDeliveryStatus.Completed;
            delivery.CompletedAt = DateTimeOffset.UtcNow;
            delivery.NextAttemptAt = null;
            delivery.LastError = null;
        }
        catch (Exception exception) when (!cancellationToken.IsCancellationRequested)
        {
            delivery.Status = delivery.Attempts >= MaxAttempts
                ? OutboxDeliveryStatus.DeadLettered
                : OutboxDeliveryStatus.Failed;
            delivery.NextAttemptAt = delivery.Status == OutboxDeliveryStatus.Failed
                ? DateTimeOffset.UtcNow.Add(GetRetryDelay(delivery.Attempts))
                : null;
            delivery.LastError = Truncate(exception.GetBaseException().Message, 2000);
            _logger.LogWarning(
                "Outbox delivery {DeliveryId} ({DeliveryType}) failed on attempt {Attempt}; details are retained in the outbox.",
                delivery.Id,
                delivery.Type,
                delivery.Attempts);
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task CleanupAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var now = DateTimeOffset.UtcNow;
        await context.OutboxDeliveries
            .Where(delivery => delivery.Status == OutboxDeliveryStatus.Completed &&
                               delivery.CompletedAt < now.AddDays(-30))
            .ExecuteDeleteAsync(cancellationToken);
        await context.Notifications
            .Where(notification => notification.IsRead && notification.Created < now.AddDays(-180))
            .ExecuteDeleteAsync(cancellationToken);
    }

    private static TimeSpan GetRetryDelay(int attempts) =>
        TimeSpan.FromSeconds(Math.Min(3600, 15 * Math.Pow(2, Math.Max(0, attempts - 1))));

    private static string Truncate(string value, int length) =>
        value.Length <= length ? value : value[..length];
}
