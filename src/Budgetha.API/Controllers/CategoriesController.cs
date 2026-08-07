using Budgetha.Application.Features.Categories.Commands;
using Budgetha.Application.Features.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMemoryCache _cache;
    private const string CategoriesCacheKey = "AllCategories";

    public CategoriesController(IMediator mediator, IMemoryCache cache)
    {
        _mediator = mediator;
        _cache = cache;
    }

    [HttpGet]
    [ResponseCache(Duration = 3600)]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        if (!_cache.TryGetValue(CategoriesCacheKey, out List<CategoryDto>? categories))
        {
            categories = await _mediator.Send(new GetCategoriesQuery());
            _cache.Set(CategoriesCacheKey, categories, TimeSpan.FromHours(12));
        }
        return Ok(categories);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<Guid>> CreateCategory([FromBody] CreateCategoryCommand command)
    {
        var result = await _mediator.Send(command);
        _cache.Remove(CategoriesCacheKey);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryCommand command)
    {
        if (id != command.Id) return BadRequest();
        var result = await _mediator.Send(command);
        if (!result) return NotFound();
        _cache.Remove(CategoriesCacheKey);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult> DeleteCategory(Guid id)
    {
        var result = await _mediator.Send(new DeleteCategoryCommand(id));
        if (!result) return NotFound();
        _cache.Remove(CategoriesCacheKey);
        return NoContent();
    }
}
