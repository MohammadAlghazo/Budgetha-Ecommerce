using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class PendingImageDeletionConfiguration : IEntityTypeConfiguration<PendingImageDeletion>
{
    public void Configure(EntityTypeBuilder<PendingImageDeletion> builder)
    {
        builder.Property(deletion => deletion.PublicId).HasMaxLength(250).IsRequired();
        builder.HasIndex(deletion => deletion.PublicId).IsUnique();
        builder.HasIndex(deletion => deletion.QueuedAt);
    }
}
