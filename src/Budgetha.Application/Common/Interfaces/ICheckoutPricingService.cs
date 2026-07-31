using Budgetha.Application.Common.Models;

namespace Budgetha.Application.Common.Interfaces;

public interface ICheckoutPricingService
{
    Task<CheckoutQuote> CalculateAsync(
        string userId,
        string country,
        string state,
        string? promoCode,
        CancellationToken cancellationToken);
}
