using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Budgetha.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Budgetha.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public PaymentService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> CreatePayPalOrderAsync(decimal amount, string currency = "USD")
    {
        var request = await CreateAuthorizedRequestAsync(HttpMethod.Post, "/v2/checkout/orders");
        var purchaseUnit = new Dictionary<string, object>
        {
            ["amount"] = new
            {
                currency_code = currency,
                value = amount.ToString("F2", CultureInfo.InvariantCulture)
            }
        };

        var merchantId = _configuration["PayPal:MerchantId"];
        if (!string.IsNullOrWhiteSpace(merchantId))
            purchaseUnit["payee"] = new { merchant_id = merchantId };

        request.Content = JsonContent(new
        {
            intent = "CAPTURE",
            purchase_units = new[] { purchaseUnit }
        });

        using var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return document.RootElement.GetProperty("id").GetString()
            ?? throw new InvalidOperationException("PayPal did not return an order ID.");
    }

    public async Task<PayPalCaptureResult> CapturePayPalOrderAsync(
        string orderId,
        decimal expectedAmount,
        string expectedCurrency,
        CancellationToken cancellationToken = default)
    {
        var request = await CreateAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/v2/checkout/orders/{Uri.EscapeDataString(orderId)}/capture",
            cancellationToken);
        request.Content = JsonContent(new { });

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return new PayPalCaptureResult(false, null, null);

        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
        var root = document.RootElement;
        if (root.GetProperty("id").GetString() != orderId || root.GetProperty("status").GetString() != "COMPLETED")
            return new PayPalCaptureResult(false, null, null);

        if (!TryGetSingleCapture(root, out var capture) || !CaptureMatches(capture, expectedAmount, expectedCurrency))
            return new PayPalCaptureResult(false, null, null);

        return new PayPalCaptureResult(true, orderId, capture.GetProperty("id").GetString());
    }

    public async Task<PayPalWebhookResult> VerifyPayPalWebhookAsync(
        PayPalWebhookRequest webhook,
        decimal expectedAmount,
        string expectedCurrency,
        CancellationToken cancellationToken = default)
    {
        var webhookId = RequiredSetting("PayPal:WebhookId");
        using var eventDocument = JsonDocument.Parse(webhook.Body);
        var request = await CreateAuthorizedRequestAsync(
            HttpMethod.Post,
            "/v1/notifications/verify-webhook-signature",
            cancellationToken);
        request.Content = JsonContent(new
        {
            auth_algo = webhook.AuthenticationAlgorithm,
            cert_url = webhook.CertificateUrl,
            transmission_id = webhook.TransmissionId,
            transmission_sig = webhook.TransmissionSignature,
            transmission_time = webhook.TransmissionTime,
            webhook_id = webhookId,
            webhook_event = eventDocument.RootElement
        });

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return new PayPalWebhookResult(false, null, null, null);

        using var verification = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
        if (verification.RootElement.GetProperty("verification_status").GetString() != "SUCCESS")
            return new PayPalWebhookResult(false, null, null, null);

        var root = eventDocument.RootElement;
        if (root.GetProperty("event_type").GetString() != "PAYMENT.CAPTURE.COMPLETED")
            return new PayPalWebhookResult(false, null, null, null);

        var resource = root.GetProperty("resource");
        var orderId = resource.GetProperty("supplementary_data")
            .GetProperty("related_ids").GetProperty("order_id").GetString();
        if (resource.GetProperty("status").GetString() != "COMPLETED" ||
            !CaptureMatches(resource, expectedAmount, expectedCurrency))
        {
            return new PayPalWebhookResult(false, null, null, null);
        }

        return new PayPalWebhookResult(
            true,
            root.GetProperty("id").GetString(),
            orderId,
            resource.GetProperty("id").GetString());
    }

    private bool CaptureMatches(JsonElement capture, decimal expectedAmount, string expectedCurrency)
    {
        var amount = capture.GetProperty("amount");
        if (!decimal.TryParse(amount.GetProperty("value").GetString(), NumberStyles.Number, CultureInfo.InvariantCulture, out var value) ||
            value != expectedAmount ||
            !string.Equals(amount.GetProperty("currency_code").GetString(), expectedCurrency, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var payee = capture.GetProperty("payee");
        var merchantId = _configuration["PayPal:MerchantId"];
        var payeeEmail = _configuration["PayPal:PayeeEmail"];
        if (string.IsNullOrWhiteSpace(merchantId) && string.IsNullOrWhiteSpace(payeeEmail))
            throw new InvalidOperationException("PayPal:MerchantId or PayPal:PayeeEmail must be configured.");

        return (!string.IsNullOrWhiteSpace(merchantId) &&
                payee.TryGetProperty("merchant_id", out var actualMerchant) &&
                actualMerchant.GetString() == merchantId) ||
               (!string.IsNullOrWhiteSpace(payeeEmail) &&
                payee.TryGetProperty("email_address", out var actualEmail) &&
                string.Equals(actualEmail.GetString(), payeeEmail, StringComparison.OrdinalIgnoreCase));
    }

    private static bool TryGetSingleCapture(JsonElement order, out JsonElement capture)
    {
        capture = default;
        if (!order.TryGetProperty("purchase_units", out var units) || units.GetArrayLength() != 1 ||
            !units[0].TryGetProperty("payments", out var payments) ||
            !payments.TryGetProperty("captures", out var captures) || captures.GetArrayLength() != 1)
        {
            return false;
        }

        capture = captures[0];
        return capture.GetProperty("status").GetString() == "COMPLETED";
    }

    private async Task<HttpRequestMessage> CreateAuthorizedRequestAsync(
        HttpMethod method,
        string path,
        CancellationToken cancellationToken = default)
    {
        var token = await GetAccessTokenAsync(cancellationToken);
        var request = new HttpRequestMessage(method, $"{BaseUrl}{path}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return request;
    }

    private async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken = default)
    {
        var clientId = RequiredSetting("PayPal:ClientId");
        var secret = RequiredSetting("PayPal:Secret");
        var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{secret}"));
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/v1/oauth2/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);
        request.Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
        return document.RootElement.GetProperty("access_token").GetString()
            ?? throw new InvalidOperationException("PayPal did not return an access token.");
    }

    private string RequiredSetting(string key) =>
        _configuration[key] ?? throw new InvalidOperationException($"Missing configuration setting '{key}'.");

    private string BaseUrl => string.Equals(_configuration["PayPal:Mode"], "Live", StringComparison.OrdinalIgnoreCase)
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    private static StringContent JsonContent(object body) =>
        new(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
}
