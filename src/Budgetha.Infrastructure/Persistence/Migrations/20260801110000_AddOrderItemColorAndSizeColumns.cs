using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260801110000_AddOrderItemColorAndSizeColumns")]
public partial class AddOrderItemColorAndSizeColumns : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Color",
            table: "OrderItems",
            type: "text",
            nullable: true);

        migrationBuilder.AddColumn<string>(
            name: "Size",
            table: "OrderItems",
            type: "text",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "Color",
            table: "OrderItems");

        migrationBuilder.DropColumn(
            name: "Size",
            table: "OrderItems");
    }
}
