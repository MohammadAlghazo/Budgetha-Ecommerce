using Budgetha.API.Contracts.Auth;
using Budgetha.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public AuthController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _identityService.RegisterAsync(
            request.Email, request.Password, request.FirstName, request.LastName);

        if (!result.Succeeded)
            return BadRequest(new AuthResponse(false, null, null, null, result.Errors));

        return Ok(new AuthResponse(true, result.Token, result.Expiration, result.UserId, null));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _identityService.LoginAsync(request.Email, request.Password);

        if (!result.Succeeded)
            return Unauthorized(new AuthResponse(false, null, null, null, result.Errors));

        return Ok(new AuthResponse(true, result.Token, result.Expiration, result.UserId, null));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            var token = await _identityService.GeneratePasswordResetTokenAsync(request.Email);
            // In production, send this token via email. For now, return it directly.
            return Ok(new { Message = "Password reset token generated.", Token = token });
        }
        catch (InvalidOperationException)
        {
            // Don't reveal whether the email exists
            return Ok(new { Message = "If an account with that email exists, a reset link has been sent." });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _identityService.ResetPasswordAsync(
            request.Email, request.Token, request.NewPassword);

        if (!result)
            return BadRequest(new { Message = "Password reset failed. Invalid or expired token." });

        return Ok(new { Message = "Password has been reset successfully." });
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        var result = await _identityService.ConfirmEmailAsync(request.UserId, request.Token);

        if (!result)
            return BadRequest(new { Message = "Email confirmation failed." });

        return Ok(new { Message = "Email confirmed successfully." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
            return Unauthorized();

        var roles = await _identityService.GetRolesAsync(userId);
        return Ok(new
        {
            UserId = userId,
            Email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value,
            FirstName = User.FindFirst(System.Security.Claims.ClaimTypes.GivenName)?.Value,
            LastName = User.FindFirst(System.Security.Claims.ClaimTypes.Surname)?.Value,
            Roles = roles
        });
    }
}
