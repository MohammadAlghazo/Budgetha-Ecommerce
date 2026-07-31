using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Budgetha.Infrastructure.Services;

public sealed class PendingImageDeletionService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PendingImageDeletionService> _logger;

    public PendingImageDeletionService(IServiceScopeFactory scopeFactory, ILogger<PendingImageDeletionService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(15));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await ProcessAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Failed to process pending image deletions.");
            }
        }
    }

    private async Task ProcessAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var imageService = scope.ServiceProvider.GetRequiredService<Budgetha.Application.Common.Interfaces.IImageService>();
        var pending = await context.PendingImageDeletions
            .OrderBy(deletion => deletion.QueuedAt)
            .Take(100)
            .ToListAsync(cancellationToken);

        foreach (var deletion in pending)
        {
            deletion.Attempts++;
            deletion.LastAttemptAt = DateTimeOffset.UtcNow;
            if (await imageService.DeleteImageAsync(deletion.PublicId))
                context.PendingImageDeletions.Remove(deletion);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
