using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Common;
using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTimeService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService,
        IDateTimeService dateTimeService)
        : base(options)
    {
        _currentUserService = currentUserService;
        _dateTimeService = dateTimeService;
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<SellerVerification> SellerVerifications => Set<SellerVerification>();
    public DbSet<SupportTicket> SupportTickets => Set<SupportTicket>();
    public DbSet<TicketMessage> TicketMessages => Set<TicketMessage>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<SellerRequest> SellerRequests => Set<SellerRequest>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<ProductColor> ProductColors => Set<ProductColor>();
    public DbSet<ProductSize> ProductSizes => Set<ProductSize>();
    public DbSet<ProductSpec> ProductSpecs => Set<ProductSpec>();
    public DbSet<ProductFeature> ProductFeatures => Set<ProductFeature>();
    public DbSet<PromoCode> PromoCodes => Set<PromoCode>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        
        builder.Ignore<BaseEvent>();

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Product>()
                     .Where(entry => entry.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
        }

        foreach (var entry in ChangeTracker.Entries<ProductVariant>()
                     .Where(entry => entry.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
        }

        foreach (var entry in ChangeTracker.Entries<Order>()
                     .Where(entry => entry.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
        }

        foreach (var entry in ChangeTracker.Entries<Payment>()
                     .Where(entry => entry.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
        }

        foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
        {
            var now = _dateTimeService.UtcNow;
            var userId = _currentUserService.UserId;

            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Created = now;
                    entry.Entity.CreatedBy = userId;
                    entry.Entity.LastModified = now;
                    entry.Entity.LastModifiedBy = userId;
                    break;
                case EntityState.Modified:
                    entry.Entity.LastModified = now;
                    entry.Entity.LastModifiedBy = userId;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
