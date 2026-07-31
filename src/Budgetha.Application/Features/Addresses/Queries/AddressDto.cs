namespace Budgetha.Application.Features.Addresses.Queries;

public record AddressDto(
    Guid Id,
    string FullName,
    string Line1,
    string? Line2,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault
);
