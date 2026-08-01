using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSellerFulfillmentAndDeliveryReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FulfillmentId",
                table: "OrderItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SellerId",
                table: "OrderItems",
                type: "character varying(450)",
                maxLength: 450,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                UPDATE "OrderItems" AS item
                SET "SellerId" = product."SellerId"
                FROM "Products" AS product
                WHERE product."Id" = item."ProductId";
                """);

            migrationBuilder.CreateTable(
                name: "OrderFulfillments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    SellerId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Carrier = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    TrackingNumber = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ShippedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeliveredAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RejectedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RejectionReason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    StockReleasedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderFulfillments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderFulfillments_AspNetUsers_SellerId",
                        column: x => x.SellerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderFulfillments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql("""
                INSERT INTO "OrderFulfillments" ("Id", "OrderId", "SellerId", "Amount", "Status", "RowVersion")
                SELECT (
                    substr(md5(order_data."OrderId"::text || order_data."SellerId"), 1, 8) || '-' ||
                    substr(md5(order_data."OrderId"::text || order_data."SellerId"), 9, 4) || '-' ||
                    substr(md5(order_data."OrderId"::text || order_data."SellerId"), 13, 4) || '-' ||
                    substr(md5(order_data."OrderId"::text || order_data."SellerId"), 17, 4) || '-' ||
                    substr(md5(order_data."OrderId"::text || order_data."SellerId"), 21, 12)
                )::uuid,
                order_data."OrderId",
                order_data."SellerId",
                order_data."Amount",
                CASE order_data."OrderStatus"
                    WHEN 'Shipped' THEN 'Shipped'
                    WHEN 'Delivered' THEN 'Delivered'
                    WHEN 'Cancelled' THEN 'Rejected'
                    WHEN 'Failed' THEN 'Rejected'
                    ELSE 'Processing'
                END,
                decode(md5(order_data."OrderId"::text || order_data."SellerId"), 'hex')
                FROM (
                    SELECT item."OrderId", item."SellerId",
                           SUM(item."UnitPrice" * item."Quantity" - item."DiscountAmount") AS "Amount",
                           MAX(order_row."Status") AS "OrderStatus"
                    FROM "OrderItems" item
                    INNER JOIN "Orders" order_row ON order_row."Id" = item."OrderId"
                    GROUP BY item."OrderId", item."SellerId"
                ) AS order_data;
                """);

            migrationBuilder.Sql("""
                UPDATE "OrderItems" AS item
                SET "FulfillmentId" = fulfillment."Id"
                FROM "OrderFulfillments" AS fulfillment
                WHERE fulfillment."OrderId" = item."OrderId"
                  AND fulfillment."SellerId" = item."SellerId";
                """);

            migrationBuilder.CreateTable(
                name: "DeliveryReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    FulfillmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    BuyerId = table.Column<string>(type: "text", nullable: false),
                    WasReceived = table.Column<bool>(type: "boolean", nullable: false),
                    Reason = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    AdminNote = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ResolvedById = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: true),
                    ResolvedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeliveryReports_AspNetUsers_BuyerId",
                        column: x => x.BuyerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeliveryReports_OrderFulfillments_FulfillmentId",
                        column: x => x.FulfillmentId,
                        principalTable: "OrderFulfillments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DeliveryReports_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_FulfillmentId",
                table: "OrderItems",
                column: "FulfillmentId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_SellerId",
                table: "OrderItems",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryReports_BuyerId",
                table: "DeliveryReports",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryReports_FulfillmentId",
                table: "DeliveryReports",
                column: "FulfillmentId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryReports_OrderId_BuyerId_Status",
                table: "DeliveryReports",
                columns: new[] { "OrderId", "BuyerId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderFulfillments_OrderId_SellerId",
                table: "OrderFulfillments",
                columns: new[] { "OrderId", "SellerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderFulfillments_SellerId_Status",
                table: "OrderFulfillments",
                columns: new[] { "SellerId", "Status" });

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_AspNetUsers_SellerId",
                table: "OrderItems",
                column: "SellerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_OrderFulfillments_FulfillmentId",
                table: "OrderItems",
                column: "FulfillmentId",
                principalTable: "OrderFulfillments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_AspNetUsers_SellerId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_OrderFulfillments_FulfillmentId",
                table: "OrderItems");

            migrationBuilder.DropTable(
                name: "DeliveryReports");

            migrationBuilder.DropTable(
                name: "OrderFulfillments");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_FulfillmentId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_SellerId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "FulfillmentId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "SellerId",
                table: "OrderItems");
        }
    }
}
