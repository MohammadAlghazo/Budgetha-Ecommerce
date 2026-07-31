using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260731194927_AddCatalogValidationConstraints")]
    public partial class AddCatalogValidationConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Reviews_Rating_Range",
                table: "Reviews",
                sql: "\"Rating\" >= 1 AND \"Rating\" <= 5");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Products_Price_Positive",
                table: "Products",
                sql: "\"Price\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Products_OriginalPrice_Positive",
                table: "Products",
                sql: "\"OriginalPrice\" IS NULL OR \"OriginalPrice\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Products_RentalPrice_Positive",
                table: "Products",
                sql: "\"RentalPricePerDay\" IS NULL OR \"RentalPricePerDay\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Products_Slug_NotEmpty",
                table: "Products",
                sql: "length(trim(\"Slug\")) > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Products_Stock_NonNegative",
                table: "Products",
                sql: "\"StockQuantity\" >= 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Reviews_Rating_Range",
                table: "Reviews");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Products_Price_Positive",
                table: "Products");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Products_OriginalPrice_Positive",
                table: "Products");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Products_RentalPrice_Positive",
                table: "Products");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Products_Slug_NotEmpty",
                table: "Products");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Products_Stock_NonNegative",
                table: "Products");
        }
    }
}
