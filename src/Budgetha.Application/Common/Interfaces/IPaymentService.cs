namespace Budgetha.Application.Common.Interfaces;

public interface IPaymentService
{
    Task<string> CreatePayPalOrderAsync(decimal amount, string currency = "USD");
    Task<PayPalCaptureResult> CapturePayPalOrderAsync(
        string orderId,
        decimal expectedAmount,
        string expectedCurrency,
        CancellationToken cancellationToken = default);
    Task<PayPalWebhookResult> VerifyPayPalWebhookAsync(
        PayPalWebhookRequest request,
        decimal expectedAmount,
        string expectedCurrency,
        CancellationToken cancellationToken = default);
}

public record PayPalCaptureResult(bool IsValid, string? OrderId, string? CaptureId);

public record PayPalWebhookRequest(
    string Body,
    string TransmissionId,
    string TransmissionTime,
    string TransmissionSignature,
    string CertificateUrl,
    string AuthenticationAlgorithm);

public record PayPalWebhookResult(
    bool IsValid,
    string? EventId,
    string? OrderId,
    string? CaptureId);
