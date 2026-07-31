using Budgetha.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromoCodesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public PromoCodesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{code}")]
    public async Task<ActionResult> ValidatePromoCode(string code)
    {
        var promo = await _context.PromoCodes
            .FirstOrDefaultAsync(p => p.Code.ToLower() == code.ToLower() && p.IsActive);

        if (promo == null || (promo.ExpiryDate.HasValue && promo.ExpiryDate.Value < DateTime.UtcNow))
        {
            return NotFound("Invalid or expired promo code.");
        }

        return Ok(new
        {
            promo.Code,
            promo.DiscountPercentage,
            promo.MaxDiscountAmount
        });
    }
}
