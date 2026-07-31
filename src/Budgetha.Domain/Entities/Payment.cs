using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;

namespace Budgetha.Domain.Entities;

public class Payment : BaseAuditableEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public PaymentProvider Provider { get; set; }
    public string? ExternalTransactionId { get; set; }
    public string? ExternalCaptureId { get; set; }
    public string? LastWebhookEventId { get; set; }

    [System.ComponentModel.DataAnnotations.ConcurrencyCheck]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
