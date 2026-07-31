using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Common.Models;
using MediatR;

namespace Budgetha.Application.Features.Orders.Queries;

public sealed record GetCheckoutQuoteQuery(string Country, string State, string? PromoCode) : IRequest<CheckoutQuote>;

public sealed class GetCheckoutQuoteQueryHandler : IRequestHandler<GetCheckoutQuoteQuery, CheckoutQuote>
{
    private readonly ICheckoutPricingService _pricingService;
    private readonly ICurrentUserService _currentUserService;

    public GetCheckoutQuoteQueryHandler(
        ICheckoutPricingService pricingService,
        ICurrentUserService currentUserService)
    {
        _pricingService = pricingService;
        _currentUserService = currentUserService;
    }

    public Task<CheckoutQuote> Handle(GetCheckoutQuoteQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException();
        if (string.IsNullOrWhiteSpace(request.Country))
            throw new Common.Exceptions.ValidationException(new[] { "Shipping country is required." });

        return _pricingService.CalculateAsync(
            userId, request.Country.Trim(), request.State.Trim(), request.PromoCode, cancellationToken);
    }
}
