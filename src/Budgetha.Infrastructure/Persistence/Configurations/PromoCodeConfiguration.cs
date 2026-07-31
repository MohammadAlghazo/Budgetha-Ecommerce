using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class PromoCodeConfiguration : IEntityTypeConfiguration<PromoCode>
{
    public void Configure(EntityTypeBuilder<PromoCode> builder)
    {
        builder.Property(p => p.Code).HasMaxLength(100).IsRequired();
        builder.Property(p => p.DiscountPercentage).HasPrecision(18, 2);
        builder.Property(p => p.MaxDiscountAmount).HasPrecision(18, 2);
        builder.Property(p => p.Scope).HasMaxLength(50).IsRequired();
        builder.Property(p => p.SellerId).HasMaxLength(450);
        builder.HasIndex(p => p.Code).IsUnique();
        builder.HasIndex(p => p.SellerId);
    }
}
