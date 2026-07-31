using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Budgetha.Infrastructure.Services;

public sealed class PendingImageCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PendingImageCleanupService> _logger;

    public PendingImageCleanupService(IServiceScopeFactory scopeFactory, ILogger<PendingImageCleanupService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(1));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await CleanupAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Failed to clean pending image uploads.");
            }
        }
    }

    private async Task CleanupAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var imageService = scope.ServiceProvider.GetRequiredService<Budgetha.Application.Common.Interfaces.IImageService>();
        var cutoff = DateTimeOffset.UtcNow.AddHours(-24);
        var uploads = await context.PendingImageUploads
            .Where(upload => upload.UploadedAt < cutoff)
            .Take(100)
            .ToListAsync(cancellationToken);

        foreach (var upload in uploads)
        {
            if (await imageService.DeleteImageAsync(upload.PublicId))
                context.PendingImageUploads.Remove(upload);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
