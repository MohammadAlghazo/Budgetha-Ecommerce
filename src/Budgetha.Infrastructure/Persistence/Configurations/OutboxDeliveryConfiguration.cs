using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public sealed class OutboxDeliveryConfiguration : IEntityTypeConfiguration<OutboxDelivery>
{
    public void Configure(EntityTypeBuilder<OutboxDelivery> builder)
    {
        builder.Property(delivery => delivery.Type).HasConversion<string>().HasMaxLength(50);
        builder.Property(delivery => delivery.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(delivery => delivery.Recipient).HasMaxLength(450).IsRequired();
        builder.Property(delivery => delivery.Subject).HasMaxLength(300);
        builder.Property(delivery => delivery.LastError).HasMaxLength(2000);
        builder.Property(delivery => delivery.IdempotencyKey).HasMaxLength(350).IsRequired();
        builder.HasIndex(delivery => delivery.IdempotencyKey).IsUnique();
        builder.HasIndex(delivery => new { delivery.Status, delivery.NextAttemptAt });
        builder.HasIndex(delivery => delivery.CompletedAt);
        builder.HasOne(delivery => delivery.Notification)
            .WithMany()
            .HasForeignKey(delivery => delivery.NotificationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
