namespace Budgetha.Application.Common.Interfaces;

public interface IPaymentService
{
    Task<string> CreatePayPalOrderAsync(decimal amount, string currency = "USD");
    Task<bool> CapturePayPalOrderAsync(string orderId);
}
