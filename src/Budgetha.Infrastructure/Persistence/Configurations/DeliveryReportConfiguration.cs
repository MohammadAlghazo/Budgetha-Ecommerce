using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class DeliveryReportConfiguration : IEntityTypeConfiguration<DeliveryReport>
{
    public void Configure(EntityTypeBuilder<DeliveryReport> builder)
    {
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(x => x.Reason).HasMaxLength(2000);
        builder.Property(x => x.AdminNote).HasMaxLength(2000);
        builder.Property(x => x.ResolvedById).HasMaxLength(450);
        builder.HasIndex(x => new { x.OrderId, x.BuyerId, x.Status });
        builder.HasOne(x => x.Order).WithMany(x => x.DeliveryReports).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Fulfillment).WithMany(x => x.DeliveryReports).HasForeignKey(x => x.FulfillmentId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(x => x.Buyer).WithMany(x => x.DeliveryReports).HasForeignKey(x => x.BuyerId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
    }
}
