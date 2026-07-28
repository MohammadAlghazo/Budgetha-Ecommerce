using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class SellerVerificationConfiguration : IEntityTypeConfiguration<SellerVerification>
{
    public void Configure(EntityTypeBuilder<SellerVerification> builder)
    {
        builder.Property(sv => sv.BusinessName).HasMaxLength(200).IsRequired();
        builder.Property(sv => sv.BusinessDescription).HasMaxLength(2000);
        builder.Property(sv => sv.DocumentUrl).HasMaxLength(500);
        builder.Property(sv => sv.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(sv => sv.ReviewedBy).HasMaxLength(450);
        builder.Property(sv => sv.RejectionReason).HasMaxLength(1000);

        builder.HasIndex(sv => sv.UserId).IsUnique();

        builder.HasOne(sv => sv.User)
            .WithOne(u => u.SellerVerification)
            .HasForeignKey<SellerVerification>(sv => sv.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
