using System;
using System.Collections.Generic;
using Npgsql;

var connectionString = Environment.GetEnvironmentVariable("BUDGETHA_DB_CONNECTION")
    ?? throw new InvalidOperationException("BUDGETHA_DB_CONNECTION is required.");

await using var connection = new NpgsqlConnection(connectionString);
await connection.OpenAsync();

var reports = new Dictionary<string, string>
{
    ["row_counts"] = """
        SELECT 'users', COUNT(*) FROM "AspNetUsers"
        UNION ALL SELECT 'products', COUNT(*) FROM "Products"
        UNION ALL SELECT 'categories', COUNT(*) FROM "Categories"
        UNION ALL SELECT 'reviews', COUNT(*) FROM "Reviews"
        UNION ALL SELECT 'orders', COUNT(*) FROM "Orders"
        UNION ALL SELECT 'order_items', COUNT(*) FROM "OrderItems"
        UNION ALL SELECT 'carts', COUNT(*) FROM "Carts"
        UNION ALL SELECT 'cart_items', COUNT(*) FROM "CartItems"
        UNION ALL SELECT 'product_images', COUNT(*) FROM "ProductImages"
        ORDER BY 1;
        """,
    ["product_status"] = """
        SELECT "IsActive"::text || '/' || "ApprovalStatus", COUNT(*)
        FROM "Products"
        GROUP BY "IsActive", "ApprovalStatus"
        ORDER BY 1;
        """,
    ["duplicate_products"] = """
        SELECT lower(trim("Name")) || ' @ ' || "SellerId", COUNT(*)
        FROM "Products"
        GROUP BY lower(trim("Name")), "SellerId"
        HAVING COUNT(*) > 1
        ORDER BY COUNT(*) DESC, 1
        LIMIT 20;
        """,
    ["incomplete_users"] = """
        SELECT 'missing_name', COUNT(*) FROM "AspNetUsers"
        WHERE trim(COALESCE("FirstName", '')) = '' OR trim(COALESCE("LastName", '')) = ''
        UNION ALL
        SELECT 'missing_email', COUNT(*) FROM "AspNetUsers"
        WHERE trim(COALESCE("Email", '')) = '';
        """,
    ["seeded_accounts"] = """
        SELECT split_part("Email", '@', 1), COUNT(*)
        FROM "AspNetUsers"
        WHERE "Email" ~* '^seller[1-5]@budgetha\\.com$'
        GROUP BY 1
        ORDER BY 1;
        """,
    ["image_hosts"] = """
        SELECT COALESCE(substring("Url" from '^https?://([^/]+)'), '(invalid)'), COUNT(*)
        FROM "ProductImages"
        GROUP BY 1
        ORDER BY COUNT(*) DESC, 1;
        """,
    ["image_metadata"] = """
        SELECT 'cloudinary_urls', COUNT(*) FROM "ProductImages" WHERE "Url" ILIKE '%cloudinary.com%'
        UNION ALL SELECT 'missing_public_id', COUNT(*) FROM "ProductImages" WHERE "PublicId" IS NULL OR trim("PublicId") = '';
        """,
    ["review_consistency"] = """
        SELECT 'products_with_stale_review_count', COUNT(*)
        FROM "Products" p
        WHERE p."ReviewCount" <> (SELECT COUNT(*) FROM "Reviews" r WHERE r."ProductId" = p."Id")
        UNION ALL
        SELECT 'products_with_stale_average', COUNT(*)
        FROM "Products" p
        WHERE p."AverageRating" <> COALESCE((SELECT AVG(r."Rating") FROM "Reviews" r WHERE r."ProductId" = p."Id"), 0);
        """,
    ["item_columns"] = """
        SELECT table_name || '.' || column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name IN ('CartItems', 'OrderItems')
          AND column_name IN ('Color', 'Size')
        ORDER BY 1;
        """,
    ["latest_migrations"] = """
        SELECT "MigrationId", "ProductVersion"
        FROM "__EFMigrationsHistory"
        ORDER BY "MigrationId" DESC
        LIMIT 5;
        """
};

foreach (var report in reports)
{
    Console.WriteLine($"[{report.Key}]");
    await using var command = new NpgsqlCommand(report.Value, connection);
    await using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
        Console.WriteLine($"{reader.GetValue(0)} = {reader.GetValue(1)}");
}
