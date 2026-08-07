using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(o => o.Subtotal).HasPrecision(18, 2);
        builder.Property(o => o.DiscountAmount).HasPrecision(18, 2);
        builder.Property(o => o.ShippingAmount).HasPrecision(18, 2);
        builder.Property(o => o.TaxAmount).HasPrecision(18, 2);
        builder.Property(o => o.TotalAmount).HasPrecision(18, 2);
        builder.Property(o => o.Currency).HasMaxLength(3).IsRequired();
        builder.Property(o => o.PromoCode).HasMaxLength(100);
        builder.Property(o => o.PromoScope).HasMaxLength(50);
        builder.Property(o => o.PromoSellerId).HasMaxLength(450);
        builder.Property(o => o.ShippingFullName).HasMaxLength(200).IsRequired();
        builder.Property(o => o.ShippingLine1).HasMaxLength(300).IsRequired();
        builder.Property(o => o.ShippingLine2).HasMaxLength(300);
        builder.Property(o => o.ShippingCity).HasMaxLength(100).IsRequired();
        builder.Property(o => o.ShippingState).HasMaxLength(100).IsRequired();
        builder.Property(o => o.ShippingPostalCode).HasMaxLength(20).IsRequired();
        builder.Property(o => o.ShippingCountry).HasMaxLength(100).IsRequired();
        builder.Property(o => o.ShippingPhone).HasMaxLength(50).IsRequired();
        builder.Property(o => o.ContactEmail).HasMaxLength(256);
        builder.Property(o => o.ContactPhone).HasMaxLength(50).IsRequired();
        builder.Property(o => o.Notes).HasMaxLength(1000);
        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(o => o.RowVersion).IsConcurrencyToken().ValueGeneratedNever();

        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.ReservationExpiresAt);

        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
