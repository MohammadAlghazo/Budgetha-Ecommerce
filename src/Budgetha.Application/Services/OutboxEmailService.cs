using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Budgetha.Domain.Enums;

namespace Budgetha.Application.Services;

public sealed class OutboxEmailService : IEmailService
{
    private readonly IApplicationDbContext _context;

    public OutboxEmailService(IApplicationDbContext context)
    {
        _context = context;
    }

    public Task QueueEmailAsync(
        string to,
        string subject,
        string body,
        string idempotencyKey,
        CancellationToken cancellationToken = default)
    {
        _context.OutboxDeliveries.Add(new OutboxDelivery
        {
            Type = OutboxDeliveryType.Email,
            Recipient = to,
            Subject = subject,
            Body = body,
            IdempotencyKey = idempotencyKey
        });

        return Task.CompletedTask;
    }
}
