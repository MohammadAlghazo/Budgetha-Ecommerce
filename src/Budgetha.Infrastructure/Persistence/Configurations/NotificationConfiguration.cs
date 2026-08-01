using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public sealed class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.Property(notification => notification.IdempotencyKey).HasMaxLength(300).IsRequired();
        builder.HasIndex(notification => notification.IdempotencyKey).IsUnique();
        builder.HasIndex(notification => new { notification.UserId, notification.Created });
        builder.HasIndex(notification => new { notification.UserId, notification.IsRead });
    }
}
