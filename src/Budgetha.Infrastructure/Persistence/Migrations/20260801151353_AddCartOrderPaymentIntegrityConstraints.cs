using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCartOrderPaymentIntegrityConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Payments_Amount_Positive",
                table: "Payments",
                sql: "\"Amount\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderItems_Prices_NonNegative",
                table: "OrderItems",
                sql: "\"UnitPrice\" >= 0 AND \"DiscountAmount\" >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderItems_Quantity_Positive",
                table: "OrderItems",
                sql: "\"Quantity\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderItems_RentalDates",
                table: "OrderItems",
                sql: "\"Type\" <> 'Rental' OR (\"RentalStartDate\" IS NOT NULL AND \"RentalEndDate\" IS NOT NULL AND \"RentalEndDate\" > \"RentalStartDate\")");

            migrationBuilder.AddCheckConstraint(
                name: "CK_CartItems_Quantity_Positive",
                table: "CartItems",
                sql: "\"Quantity\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_CartItems_RentalDates",
                table: "CartItems",
                sql: "\"Type\" <> 'Rental' OR (\"RentalStartDate\" IS NOT NULL AND \"RentalEndDate\" IS NOT NULL AND \"RentalEndDate\" > \"RentalStartDate\")");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Payments_Amount_Positive",
                table: "Payments");

            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderItems_Prices_NonNegative",
                table: "OrderItems");

            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderItems_Quantity_Positive",
                table: "OrderItems");

            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderItems_RentalDates",
                table: "OrderItems");

            migrationBuilder.DropCheckConstraint(
                name: "CK_CartItems_Quantity_Positive",
                table: "CartItems");

            migrationBuilder.DropCheckConstraint(
                name: "CK_CartItems_RentalDates",
                table: "CartItems");
        }
    }
}
