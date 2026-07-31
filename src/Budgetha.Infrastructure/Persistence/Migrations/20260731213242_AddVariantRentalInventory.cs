using System;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260731213242_AddVariantRentalInventory")]
public partial class AddVariantRentalInventory : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            name: "VariantId", table: "OrderItems", type: "uuid", nullable: true);
        migrationBuilder.AddColumn<Guid>(
            name: "VariantId", table: "CartItems", type: "uuid", nullable: true);

        migrationBuilder.CreateTable(
            name: "ProductVariants",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                SKU = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Color = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Size = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                StockQuantity = table.Column<int>(type: "integer", nullable: false),
                Price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                RentalPricePerDay = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                IsActive = table.Column<bool>(type: "boolean", nullable: false),
                RowVersion = table.Column<byte[]>(type: "bytea", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ProductVariants", x => x.Id);
                table.CheckConstraint("CK_ProductVariants_Price_Positive", "\"Price\" IS NULL OR \"Price\" > 0");
                table.CheckConstraint("CK_ProductVariants_RentalPrice_Positive", "\"RentalPricePerDay\" IS NULL OR \"RentalPricePerDay\" > 0");
                table.CheckConstraint("CK_ProductVariants_SKU_NotEmpty", "length(trim(\"SKU\")) > 0");
                table.CheckConstraint("CK_ProductVariants_Stock_NonNegative", "\"StockQuantity\" >= 0");
                table.ForeignKey(
                    name: "FK_ProductVariants_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.Sql("""
            INSERT INTO "ProductVariants" ("Id", "ProductId", "SKU", "StockQuantity", "Price", "RentalPricePerDay", "IsActive", "RowVersion")
            SELECT (
                       substr(md5("Id"::text), 1, 8) || '-' || substr(md5("Id"::text), 9, 4) || '-' ||
                       substr(md5("Id"::text), 13, 4) || '-' || substr(md5("Id"::text), 17, 4) || '-' ||
                       substr(md5("Id"::text), 21, 12)
                   )::uuid,
                   "Id", 'LEGACY-' || replace("Id"::text, '-', ''), "StockQuantity", "Price",
                   "RentalPricePerDay", "IsActive", decode(md5("Id"::text), 'hex')
            FROM "Products";

            UPDATE "CartItems" AS cart
            SET "VariantId" = variant."Id", "Color" = NULL, "Size" = NULL
            FROM "ProductVariants" AS variant
            WHERE variant."ProductId" = cart."ProductId";
            """);

        migrationBuilder.CreateIndex(
            name: "IX_OrderItems_VariantId", table: "OrderItems", column: "VariantId");
        migrationBuilder.CreateIndex(
            name: "IX_CartItems_VariantId", table: "CartItems", column: "VariantId");
        migrationBuilder.CreateIndex(
            name: "IX_ProductVariants_ProductId_Color_Size",
            table: "ProductVariants",
            columns: new[] { "ProductId", "Color", "Size" },
            unique: true,
            filter: "\"IsActive\"")
            .Annotation("Npgsql:NullsDistinct", false);
        migrationBuilder.CreateIndex(
            name: "IX_ProductVariants_ProductId_IsActive",
            table: "ProductVariants",
            columns: new[] { "ProductId", "IsActive" });
        migrationBuilder.CreateIndex(
            name: "IX_ProductVariants_SKU", table: "ProductVariants", column: "SKU", unique: true);

        migrationBuilder.AddForeignKey(
            name: "FK_CartItems_ProductVariants_VariantId",
            table: "CartItems", column: "VariantId", principalTable: "ProductVariants",
            principalColumn: "Id", onDelete: ReferentialAction.Restrict);
        migrationBuilder.AddForeignKey(
            name: "FK_OrderItems_ProductVariants_VariantId",
            table: "OrderItems", column: "VariantId", principalTable: "ProductVariants",
            principalColumn: "Id", onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey("FK_CartItems_ProductVariants_VariantId", "CartItems");
        migrationBuilder.DropForeignKey("FK_OrderItems_ProductVariants_VariantId", "OrderItems");
        migrationBuilder.DropTable("ProductVariants");
        migrationBuilder.DropIndex("IX_OrderItems_VariantId", "OrderItems");
        migrationBuilder.DropIndex("IX_CartItems_VariantId", "CartItems");
        migrationBuilder.DropColumn("VariantId", "OrderItems");
        migrationBuilder.DropColumn("VariantId", "CartItems");
    }
}
