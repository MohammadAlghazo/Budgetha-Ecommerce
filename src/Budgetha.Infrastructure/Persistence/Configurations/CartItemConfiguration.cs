using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.Property(ci => ci.Type).HasConversion<string>().HasMaxLength(50);
        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_CartItems_Quantity_Positive", "\"Quantity\" > 0");
            table.HasCheckConstraint("CK_CartItems_RentalDates", "\"Type\" <> 'Rental' OR (\"RentalStartDate\" IS NOT NULL AND \"RentalEndDate\" IS NOT NULL AND \"RentalEndDate\" > \"RentalStartDate\")");
        });

        builder.HasOne(ci => ci.Cart)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ci => ci.Product)
            .WithMany(p => p.CartItems)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ci => ci.Variant)
            .WithMany(v => v.CartItems)
            .HasForeignKey(ci => ci.VariantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
