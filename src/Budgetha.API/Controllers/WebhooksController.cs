using System.Text.Json;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly IOrderCompletionService _completionService;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(
        IApplicationDbContext context,
        IPaymentService paymentService,
        IOrderCompletionService completionService,
        ILogger<WebhooksController> logger)
    {
        _context = context;
        _paymentService = paymentService;
        _completionService = completionService;
        _logger = logger;
    }

    [HttpPost("paypal")]
    public async Task<IActionResult> PayPalWebhook(CancellationToken cancellationToken)
    {
        Guid? paymentId = null;
        string? verifiedCaptureId = null;
        if (!Request.Headers.TryGetValue("PAYPAL-TRANSMISSION-ID", out var transmissionId) ||
            !Request.Headers.TryGetValue("PAYPAL-TRANSMISSION-TIME", out var transmissionTime) ||
            !Request.Headers.TryGetValue("PAYPAL-TRANSMISSION-SIG", out var transmissionSignature) ||
            !Request.Headers.TryGetValue("PAYPAL-CERT-URL", out var certificateUrl) ||
            !Request.Headers.TryGetValue("PAYPAL-AUTH-ALGO", out var authenticationAlgorithm))
        {
            return Unauthorized();
        }

        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync(cancellationToken);
        try
        {
            using var document = JsonDocument.Parse(body);
            var resource = document.RootElement.GetProperty("resource");
            var relatedIds = resource.GetProperty("supplementary_data").GetProperty("related_ids");
            var paypalOrderId = relatedIds.GetProperty("order_id").GetString();
            if (string.IsNullOrWhiteSpace(paypalOrderId))
                return BadRequest();

            var payment = await _context.Payments
                .Include(p => p.Order)
                .ThenInclude(o => o.Items)
                .ThenInclude(item => item.Product)
                .Include(p => p.Order)
                .ThenInclude(o => o.User)
                .FirstOrDefaultAsync(p => p.ExternalTransactionId == paypalOrderId, cancellationToken);
            if (payment == null)
                return Ok();
            paymentId = payment.Id;

            if (payment.Provider != PaymentProvider.PayPal ||
                payment.Status is not (PaymentStatus.Pending or PaymentStatus.Processing) ||
                payment.Order?.Status != OrderStatus.Pending)
                return Ok();

            var verification = await _paymentService.VerifyPayPalWebhookAsync(
                new PayPalWebhookRequest(body, transmissionId!, transmissionTime!, transmissionSignature!, certificateUrl!, authenticationAlgorithm!),
                payment.Amount,
                payment.Currency,
                cancellationToken);
            if (!verification.IsValid || string.IsNullOrWhiteSpace(verification.EventId) ||
                string.IsNullOrWhiteSpace(verification.CaptureId) ||
                verification.OrderId != payment.ExternalTransactionId)
                return Unauthorized();
            verifiedCaptureId = verification.CaptureId;

            if (payment.LastWebhookEventId == verification.EventId || payment.Status == PaymentStatus.Completed)
                return Ok();

            if (payment.Order != null)
            {
                await _completionService.CompletePayPalAsync(
                    payment.Order,
                    payment,
                    verification.CaptureId,
                    verification.EventId,
                    cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Ok();
        }
        catch (JsonException)
        {
            return BadRequest();
        }
        catch (DbUpdateException)
        {
            var completedConcurrently = paymentId.HasValue && verifiedCaptureId != null &&
                await _context.Payments.AsNoTracking().AnyAsync(payment =>
                    payment.Id == paymentId.Value && payment.Status == PaymentStatus.Completed &&
                    payment.ExternalCaptureId == verifiedCaptureId, cancellationToken);
            if (completedConcurrently)
            {
                _logger.LogInformation("Concurrent PayPal webhook delivery acknowledged.");
                return Ok();
            }

            throw;
        }
    }
}
