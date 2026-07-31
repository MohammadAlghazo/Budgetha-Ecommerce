using Budgetha.Application.Features.Products.Commands;
using Budgetha.Application.Features.Products.Queries;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<CatalogResultDto>> GetProducts([FromQuery] GetProductsQuery query)
    {
        
        if (query.Page <= 0) query = query with { Page = 1 };
        if (query.PageSize <= 0) query = query with { PageSize = 12 };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDto>> GetProductBySlug(string slug)
    {
        var result = await _mediator.Send(new GetProductBySlugQuery(slug));
        if (result == null) return NotFound();
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
            request.CategoryId,
            request.ImageUrls ?? new List<string>(),
            request.IsAvailableForRent,
            request.RentalPricePerDay,
            userId,
            request.Brand,
            request.OriginalPrice
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
            request.CategoryId,
            request.ImageUrls ?? new List<string>(),
            request.IsAvailableForRent,
            request.RentalPricePerDay,
            userId,
            request.Brand,
            request.OriginalPrice
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
    Guid CategoryId,
    List<string> ImageUrls,
    bool IsAvailableForRent,
    decimal? RentalPricePerDay,
    string Brand,
    decimal? OriginalPrice
);
