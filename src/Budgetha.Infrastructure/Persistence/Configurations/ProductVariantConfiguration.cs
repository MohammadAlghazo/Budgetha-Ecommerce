using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.Property(v => v.SKU).HasMaxLength(100).IsRequired();
        builder.Property(v => v.Color).HasMaxLength(100);
        builder.Property(v => v.Size).HasMaxLength(100);
        builder.Property(v => v.Price).HasPrecision(18, 2);
        builder.Property(v => v.RentalPricePerDay).HasPrecision(18, 2);
        builder.Property(v => v.RowVersion).IsConcurrencyToken().ValueGeneratedNever();

        builder.HasIndex(v => v.SKU).IsUnique();
        builder.HasIndex(v => new { v.ProductId, v.Color, v.Size })
            .IsUnique()
            .HasFilter("\"IsActive\"")
            .HasAnnotation("Npgsql:NullsDistinct", false);
        builder.HasIndex(v => new { v.ProductId, v.IsActive });

        builder.ToTable(t =>
        {
            t.HasCheckConstraint("CK_ProductVariants_SKU_NotEmpty", "length(trim(\"SKU\")) > 0");
            t.HasCheckConstraint("CK_ProductVariants_Stock_NonNegative", "\"StockQuantity\" >= 0");
            t.HasCheckConstraint("CK_ProductVariants_Price_Positive", "\"Price\" IS NULL OR \"Price\" > 0");
            t.HasCheckConstraint("CK_ProductVariants_RentalPrice_Positive", "\"RentalPricePerDay\" IS NULL OR \"RentalPricePerDay\" > 0");
        });

        builder.HasOne(v => v.Product)
            .WithMany(p => p.Variants)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
