using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovalStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ApprovalStatus",
                table: "Products",
                column: "ApprovalStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_ApprovalStatus",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Products");
        }
    }
}
