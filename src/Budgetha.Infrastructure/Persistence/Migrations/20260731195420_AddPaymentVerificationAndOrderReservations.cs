using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations;

public partial class AddPaymentVerificationAndOrderReservations : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Currency", table: "Payments", type: "character varying(3)", maxLength: 3,
            nullable: false, defaultValue: "USD");
        migrationBuilder.AddColumn<string>(
            name: "ExternalCaptureId", table: "Payments", type: "character varying(250)", maxLength: 250,
            nullable: true);
        migrationBuilder.AddColumn<string>(
            name: "LastWebhookEventId", table: "Payments", type: "character varying(250)", maxLength: 250,
            nullable: true);
        migrationBuilder.AddColumn<byte[]>(
            name: "RowVersion", table: "Payments", type: "bytea", rowVersion: true,
            nullable: false, defaultValue: new byte[0]);
        migrationBuilder.AddColumn<DateTimeOffset>(
            name: "ReservationExpiresAt", table: "Orders", type: "timestamp with time zone", nullable: true);
        migrationBuilder.AddColumn<byte[]>(
            name: "RowVersion", table: "Orders", type: "bytea", rowVersion: true,
            nullable: false, defaultValue: new byte[0]);

        migrationBuilder.CreateIndex(
            name: "IX_Payments_ExternalCaptureId", table: "Payments", column: "ExternalCaptureId", unique: true);
        migrationBuilder.CreateIndex(
            name: "IX_Payments_ExternalTransactionId", table: "Payments", column: "ExternalTransactionId", unique: true);
        migrationBuilder.CreateIndex(
            name: "IX_Payments_LastWebhookEventId", table: "Payments", column: "LastWebhookEventId", unique: true);
        migrationBuilder.CreateIndex(
            name: "IX_Orders_ReservationExpiresAt", table: "Orders", column: "ReservationExpiresAt");

        migrationBuilder.CreateTable(
            name: "PromoCodes",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Code = table.Column<string>(type: "text", nullable: false),
                DiscountPercentage = table.Column<decimal>(type: "numeric", nullable: false),
                MaxDiscountAmount = table.Column<decimal>(type: "numeric", nullable: true),
                ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                IsActive = table.Column<bool>(type: "boolean", nullable: false),
                Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                LastModifiedBy = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PromoCodes", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_PromoCodes_Code",
            table: "PromoCodes",
            column: "Code",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(name: "IX_Payments_ExternalCaptureId", table: "Payments");
        migrationBuilder.DropIndex(name: "IX_Payments_ExternalTransactionId", table: "Payments");
        migrationBuilder.DropIndex(name: "IX_Payments_LastWebhookEventId", table: "Payments");
        migrationBuilder.DropIndex(name: "IX_Orders_ReservationExpiresAt", table: "Orders");
        migrationBuilder.DropTable(name: "PromoCodes");
        migrationBuilder.DropColumn(name: "Currency", table: "Payments");
        migrationBuilder.DropColumn(name: "ExternalCaptureId", table: "Payments");
        migrationBuilder.DropColumn(name: "LastWebhookEventId", table: "Payments");
        migrationBuilder.DropColumn(name: "RowVersion", table: "Payments");
        migrationBuilder.DropColumn(name: "ReservationExpiresAt", table: "Orders");
        migrationBuilder.DropColumn(name: "RowVersion", table: "Orders");
    }
}
