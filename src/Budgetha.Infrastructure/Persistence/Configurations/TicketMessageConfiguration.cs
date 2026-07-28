using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class TicketMessageConfiguration : IEntityTypeConfiguration<TicketMessage>
{
    public void Configure(EntityTypeBuilder<TicketMessage> builder)
    {
        builder.Property(tm => tm.SenderId).HasMaxLength(450).IsRequired();
        builder.Property(tm => tm.Body).HasMaxLength(4000).IsRequired();

        builder.HasOne(tm => tm.Ticket)
            .WithMany(st => st.Messages)
            .HasForeignKey(tm => tm.TicketId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
