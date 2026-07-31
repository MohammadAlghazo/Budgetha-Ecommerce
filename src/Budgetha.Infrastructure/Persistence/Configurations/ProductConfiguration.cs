using Budgetha.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgetha.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(250).IsRequired();
        builder.Property(p => p.Description).HasMaxLength(4000);
        builder.Property(p => p.Price).HasPrecision(18, 2);
        builder.Property(p => p.RentalPricePerDay).HasPrecision(18, 2);
        builder.Property(p => p.ThumbnailUrl).HasMaxLength(500);

        builder.HasIndex(p => p.Slug).IsUnique();
        builder.HasIndex(p => p.IsActive);
        builder.HasIndex(p => p.ApprovalStatus);
        builder.ToTable(t =>
        {
            t.HasCheckConstraint("CK_Products_Price_Positive", "\"Price\" > 0");
            t.HasCheckConstraint("CK_Products_OriginalPrice_Positive", "\"OriginalPrice\" IS NULL OR \"OriginalPrice\" > 0");
            t.HasCheckConstraint("CK_Products_RentalPrice_Positive", "\"RentalPricePerDay\" IS NULL OR \"RentalPricePerDay\" > 0");
            t.HasCheckConstraint("CK_Products_Stock_NonNegative", "\"StockQuantity\" >= 0");
            t.HasCheckConstraint("CK_Products_Slug_NotEmpty", "length(trim(\"Slug\")) > 0");
        });

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Seller)
            .WithMany(u => u.Products)
            .HasForeignKey(p => p.SellerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
