using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.Amount).HasPrecision(18, 2);
        builder.Property(p => p.Currency).HasMaxLength(3).IsRequired();
        builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(p => p.Provider).HasConversion<string>().HasMaxLength(50);
        builder.Property(p => p.ExternalTransactionId).HasMaxLength(250);
        builder.Property(p => p.ExternalCaptureId).HasMaxLength(250);
        builder.Property(p => p.LastWebhookEventId).HasMaxLength(250);
        builder.Property(p => p.RowVersion).IsConcurrencyToken().ValueGeneratedNever();
        builder.ToTable(table => table.HasCheckConstraint("CK_Payments_Amount_Positive", "\"Amount\" > 0"));

        builder.HasIndex(p => p.OrderId).IsUnique();
        builder.HasIndex(p => p.ExternalTransactionId).IsUnique();
        builder.HasIndex(p => p.ExternalCaptureId).IsUnique();
        builder.HasIndex(p => p.LastWebhookEventId).IsUnique();

        builder.HasOne(p => p.Order)
            .WithOne(o => o.Payment)
            .HasForeignKey<Payment>(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
