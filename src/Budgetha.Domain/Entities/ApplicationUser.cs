using Budgetha.Domain.Common;
using Budgetha.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Budgetha.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<OrderFulfillment> Fulfillments { get; set; } = new List<OrderFulfillment>();
    public ICollection<DeliveryReport> DeliveryReports { get; set; } = new List<DeliveryReport>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public Cart? Cart { get; set; }
    public SellerVerification? SellerVerification { get; set; }
    public ICollection<SupportTicket> SupportTickets { get; set; } = new List<SupportTicket>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
