using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetha.Infrastructure.Persistence.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260801120000_FixCartItemColorAndSize")]
public partial class FixCartItemColorAndSize : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("ALTER TABLE \"CartItems\" ADD COLUMN IF NOT EXISTS \"Color\" text;");
        migrationBuilder.Sql("ALTER TABLE \"CartItems\" ADD COLUMN IF NOT EXISTS \"Size\" text;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}
