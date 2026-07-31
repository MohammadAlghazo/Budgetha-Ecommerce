using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Budgetha.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<WebhooksController> _logger;
    private readonly IConfiguration _configuration;

    public WebhooksController(IApplicationDbContext context, ILogger<WebhooksController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("paypal")]
    public async Task<IActionResult> PayPalWebhook()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        
        try
        {
            var document = JsonDocument.Parse(body);
            var root = document.RootElement;
            var eventType = root.GetProperty("event_type").GetString();
            
            // Validate webhook signature here using PayPal SDK if needed.
            // For now, we will process the event type.

            if (eventType == "PAYMENT.CAPTURE.COMPLETED")
            {
                var resource = root.GetProperty("resource");
                var captureId = resource.GetProperty("id").GetString();
                
                // Assuming PayPal passes back the order ID in supplementary data or custom ID.
                // Normally, we'd look up by PayPal Order ID, but in webhook it might be the capture ID or order ID is in a different field.
                // E.g., supplementary_data.related_ids.order_id
                string? payPalOrderId = null;
                if (resource.TryGetProperty("supplementary_data", out var supplementaryData))
                {
                    if (supplementaryData.TryGetProperty("related_ids", out var relatedIds))
                    {
                        if (relatedIds.TryGetProperty("order_id", out var orderIdProp))
                        {
                            payPalOrderId = orderIdProp.GetString();
                        }
                    }
                }
                
                if (string.IsNullOrEmpty(payPalOrderId))
                {
                    _logger.LogWarning("PayPal Order ID not found in webhook payload.");
                    return Ok();
                }

                // Find the Payment by ExternalTransactionId
                var payment = await _context.Payments
                    .Include(p => p.Order)
                    .FirstOrDefaultAsync(p => p.ExternalTransactionId == payPalOrderId);

                if (payment != null && payment.Status != PaymentStatus.Completed)
                {
                    payment.Status = PaymentStatus.Completed;
                    if (payment.Order != null)
                    {
                        // Update order status if needed
                    }
                    await _context.SaveChangesAsync(default);
                    _logger.LogInformation("Payment {PaymentId} marked as Completed from Webhook", payment.Id);
                }
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PayPal webhook");
            return BadRequest();
        }
    }
}
