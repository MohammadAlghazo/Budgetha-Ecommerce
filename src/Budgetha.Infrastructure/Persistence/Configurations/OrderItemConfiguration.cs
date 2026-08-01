using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
        builder.Property(oi => oi.DiscountAmount).HasPrecision(18, 2);
        builder.Property(oi => oi.Type).HasConversion<string>().HasMaxLength(50);
        builder.Property(oi => oi.SellerId).HasMaxLength(450).IsRequired();
        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_OrderItems_Quantity_Positive", "\"Quantity\" > 0");
            table.HasCheckConstraint("CK_OrderItems_Prices_NonNegative", "\"UnitPrice\" >= 0 AND \"DiscountAmount\" >= 0");
            table.HasCheckConstraint("CK_OrderItems_RentalDates", "\"Type\" <> 'Rental' OR (\"RentalStartDate\" IS NOT NULL AND \"RentalEndDate\" IS NOT NULL AND \"RentalEndDate\" > \"RentalStartDate\")");
        });

        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(oi => oi.Variant)
            .WithMany(v => v.OrderItems)
            .HasForeignKey(oi => oi.VariantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(oi => oi.Fulfillment)
            .WithMany(f => f.Items)
            .HasForeignKey(oi => oi.FulfillmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(oi => oi.Seller)
            .WithMany()
            .HasForeignKey(oi => oi.SellerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
