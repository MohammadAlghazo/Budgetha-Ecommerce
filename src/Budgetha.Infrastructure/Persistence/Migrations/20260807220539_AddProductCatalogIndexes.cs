using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCatalogIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_ApprovalStatus",
                table: "Products",
                columns: new[] { "IsActive", "ApprovalStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_ApprovalStatus_AverageRating",
                table: "Products",
                columns: new[] { "IsActive", "ApprovalStatus", "AverageRating" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_ApprovalStatus_Created",
                table: "Products",
                columns: new[] { "IsActive", "ApprovalStatus", "Created" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_ApprovalStatus_Price",
                table: "Products",
                columns: new[] { "IsActive", "ApprovalStatus", "Price" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsFeatured",
                table: "Products",
                column: "IsFeatured");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_ApprovalStatus",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_ApprovalStatus_AverageRating",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_ApprovalStatus_Created",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_ApprovalStatus_Price",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsFeatured",
                table: "Products");
        }
    }
}
