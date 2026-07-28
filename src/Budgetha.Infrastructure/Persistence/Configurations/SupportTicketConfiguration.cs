using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class SupportTicketConfiguration : IEntityTypeConfiguration<SupportTicket>
{
    public void Configure(EntityTypeBuilder<SupportTicket> builder)
    {
        builder.Property(st => st.Subject).HasMaxLength(300).IsRequired();
        builder.Property(st => st.Status).HasConversion<string>().HasMaxLength(50);

        builder.HasIndex(st => st.Status);

        builder.HasOne(st => st.User)
            .WithMany(u => u.SupportTickets)
            .HasForeignKey(st => st.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
