using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class PendingImageUploadConfiguration : IEntityTypeConfiguration<PendingImageUpload>
{
    public void Configure(EntityTypeBuilder<PendingImageUpload> builder)
    {
        builder.Property(upload => upload.UserId).HasMaxLength(450).IsRequired();
        builder.Property(upload => upload.PublicId).HasMaxLength(250).IsRequired();
        builder.Property(upload => upload.Url).HasMaxLength(1000).IsRequired();
        builder.HasIndex(upload => upload.PublicId).IsUnique();
        builder.HasIndex(upload => upload.UploadedAt);
    }
}
