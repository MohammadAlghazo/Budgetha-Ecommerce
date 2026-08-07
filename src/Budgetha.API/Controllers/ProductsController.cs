using Budgetha.Application.Features.Products.Commands;
using Budgetha.Application.Features.Products;
using Budgetha.Application.Features.Products.Queries;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMemoryCache _cache;

    public ProductsController(IMediator mediator, IMemoryCache cache)
    {
        _mediator = mediator;
        _cache = cache;
    }

    [HttpGet]
    [ResponseCache(Duration = 60, VaryByQueryKeys = new[] { "*" })]
    public async Task<ActionResult<CatalogResultDto>> GetProducts([FromQuery] GetProductsQuery query)
    {
        if (query.Page <= 0) query.Page = 1;
        if (query.PageSize <= 0) query.PageSize = 12;
        query.PageSize = Math.Min(query.PageSize, 100);
        query.IncludeUnapproved = false;

        var cacheKey = $"catalog:{JsonSerializer.Serialize(query)}";
        if (_cache.TryGetValue(cacheKey, out CatalogResultDto? cached) && cached != null)
        {
            Response.Headers.Append("X-Cache", "HIT");
            return Ok(cached);
        }

        var result = await _mediator.Send(query);
        _cache.Set(cacheKey, result, TimeSpan.FromSeconds(60));
        Response.Headers.Append("X-Cache", "MISS");
        return Ok(result);
    }

    [HttpGet("{slug}")]
    [ResponseCache(Duration = 300, VaryByQueryKeys = new[] { "slug" })]
    public async Task<ActionResult<ProductDto>> GetProductBySlug(string slug)
    {
        var cacheKey = $"product:{slug.ToLowerInvariant()}";
        if (_cache.TryGetValue(cacheKey, out ProductDto? cached) && cached != null)
            return Ok(cached);

        var result = await _mediator.Send(new GetProductBySlugQuery(slug));
        if (result == null) return NotFound();
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
        return Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Seller")]
    [HttpPost]
    public async Task<ActionResult<Guid>> CreateProduct([FromBody] CreateProductRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var command = new CreateProductCommand(
            request.Name,
            request.Description,
            request.Price,
            request.StockQuantity,
            request.CategoryIds,
            request.Images ?? new List<ProductImageInput>(),
            request.IsAvailableForRent,
            request.RentalPricePerDay,
            userId,
            request.Brand,
            request.OriginalPrice,
            request.Colors,
            request.Sizes,
            request.Specs,
            request.Features,
            request.Variants
        );

        var productId = await _mediator.Send(command);
        return Ok(productId);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Seller")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateProduct(Guid id, [FromBody] CreateProductRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var command = new UpdateProductCommand(
            id,
            request.Name,
            request.Description,
            request.Price,
            request.StockQuantity,
            request.CategoryIds,
            request.Images ?? new List<ProductImageInput>(),
            request.IsAvailableForRent,
            request.RentalPricePerDay,
            userId,
            request.Brand,
            request.OriginalPrice,
            request.Colors,
            request.Sizes,
            request.Specs,
            request.Features,
            request.Variants
        );

        var result = await _mediator.Send(command);
        if (!result) return Forbid(); // Or NotFound
        return NoContent();
    }

    [Authorize(Roles = "SuperAdmin,Seller")]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteProduct(Guid id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isSuperAdmin = User.IsInRole("SuperAdmin");
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _mediator.Send(new DeleteProductCommand(id, userId, isSuperAdmin));
        if (!result) return Forbid(); // Or NotFound
        return NoContent();
    }

    [HttpGet("brands")]
    public async Task<ActionResult<List<string>>> GetBrands()
    {
        var brands = await _mediator.Send(new Budgetha.Application.Features.Products.Queries.GetBrandsQuery());
        return Ok(brands);
    }

    [HttpGet("price-bounds")]
    public async Task<ActionResult<PriceBoundsDto>> GetPriceBounds([FromQuery] Guid? categoryId, [FromQuery] string? searchTerm)
    {
        var result = await _mediator.Send(new GetPriceBoundsQuery(categoryId, searchTerm));
        return Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPatch("{id:guid}/approve")]
    public async Task<ActionResult> ApproveProduct(Guid id, [FromBody] ApprovalStatus status)
    {
        var result = await _mediator.Send(new ApproveProductCommand(id, status));
        if (!result) return NotFound();
        return NoContent();
    }

}

public record CreateProductRequest(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    List<Guid> CategoryIds,
    List<ProductImageInput> Images,
    bool IsAvailableForRent,
    decimal? RentalPricePerDay,
    string Brand,
    decimal? OriginalPrice,
    List<string>? Colors = null,
    List<string>? Sizes = null,
    Dictionary<string, string>? Specs = null,
    List<string>? Features = null,
    List<ProductVariantInput>? Variants = null
);
