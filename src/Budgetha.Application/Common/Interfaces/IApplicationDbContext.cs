using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Cart> Carts { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Wishlist> Wishlists { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<SellerVerification> SellerVerifications { get; }
    DbSet<SupportTicket> SupportTickets { get; }
    DbSet<TicketMessage> TicketMessages { get; }
    DbSet<Announcement> Announcements { get; }
    DbSet<SellerRequest> SellerRequests { get; }
    DbSet<ApplicationUser> Users { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<ProductColor> ProductColors { get; }
    DbSet<ProductSize> ProductSizes { get; }
    DbSet<ProductSpec> ProductSpecs { get; }
    DbSet<ProductFeature> ProductFeatures { get; }
    DbSet<PromoCode> PromoCodes { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
