using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class OrderFulfillmentConfiguration : IEntityTypeConfiguration<OrderFulfillment>
{
    public void Configure(EntityTypeBuilder<OrderFulfillment> builder)
    {
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(x => x.SellerId).HasMaxLength(450).IsRequired();
        builder.Property(x => x.Carrier).HasMaxLength(100);
        builder.Property(x => x.TrackingNumber).HasMaxLength(200);
        builder.Property(x => x.RejectionReason).HasMaxLength(1000);
        builder.Property(x => x.RowVersion).IsConcurrencyToken().ValueGeneratedNever();
        builder.HasIndex(x => new { x.OrderId, x.SellerId }).IsUnique();
        builder.HasIndex(x => new { x.SellerId, x.Status });
        builder.HasOne(x => x.Order).WithMany(x => x.Fulfillments).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Seller).WithMany(x => x.Fulfillments).HasForeignKey(x => x.SellerId).OnDelete(DeleteBehavior.Restrict);
    }
}
