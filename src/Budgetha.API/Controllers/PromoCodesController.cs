using Budgetha.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromoCodesController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public PromoCodesController(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    [HttpGet("{code}")]
    public async Task<ActionResult> ValidatePromoCode(string code)
    {
        var promo = await _context.PromoCodes
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Code.ToLower() == code.ToLower() && p.IsActive);

        if (promo == null || (promo.ExpiryDate.HasValue && promo.ExpiryDate.Value < DateTime.UtcNow))
        {
            return NotFound("Invalid or expired promo code.");
        }

        var userId = _currentUserService.UserId;
        if (!string.IsNullOrEmpty(userId))
        {
            var userUsageCount = await _context.PromoCodeUsages
                .CountAsync(u => u.PromoCodeId == promo.Id && u.UserId == userId);
            
            if (userUsageCount >= promo.MaxUsesPerUser)
            {
                return BadRequest("You have reached the maximum usage limit for this promo code.");
            }
        }

        return Ok(new
        {
            promo.Code,
            promo.DiscountPercentage,
            promo.MaxDiscountAmount,
            promo.Scope,
            promo.SellerId
        });
    }
}
