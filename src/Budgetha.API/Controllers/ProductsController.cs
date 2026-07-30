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
        // Set default pagination if not provided
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

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPatch("{id:guid}/approve")]
    public async Task<ActionResult> ApproveProduct(Guid id, [FromBody] ApprovalStatus status)
    {
        var result = await _mediator.Send(new ApproveProductCommand(id, status));
        if (!result) return NotFound();
        return NoContent();
    }
}
