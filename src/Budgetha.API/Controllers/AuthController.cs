using Budgetha.API.Contracts.Auth;
using Budgetha.Application.Common.Interfaces;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Cryptography;
using System.Text;

namespace Budgetha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("AuthLimiter")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly IApplicationDbContext _context;

    public AuthController(
        IIdentityService identityService,
        IConfiguration configuration,
        IEmailService emailService,
        IApplicationDbContext context)
    {
        _identityService = identityService;
        _configuration = configuration;
        _emailService = emailService;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _identityService.RegisterAsync(
            request.Email, request.Password, request.FirstName, request.LastName);

        if (!result.Succeeded)
            return BadRequest(new AuthResponse(false, null, null, null, null, null, null, null, result.Errors));

        return Ok(new AuthResponse(true, result.Token, result.Expiration, result.UserId, result.Email, result.FirstName, result.LastName, result.Roles, null, result.RefreshToken));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _identityService.LoginAsync(request.Email, request.Password);

        if (!result.Succeeded)
            return Unauthorized(new AuthResponse(false, null, null, null, null, null, null, null, result.Errors));

        return Ok(new AuthResponse(true, result.Token, result.Expiration, result.UserId, result.Email, result.FirstName, result.LastName, result.Roles, null, result.RefreshToken));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        var result = await _identityService.RefreshTokenAsync(request.Token, request.RefreshToken);

        if (!result.Succeeded)
            return Unauthorized(new AuthResponse(false, null, null, null, null, null, null, null, result.Errors));

        return Ok(new AuthResponse(true, result.Token, result.Expiration, result.UserId, result.Email, result.FirstName, result.LastName, result.Roles, null, result.RefreshToken));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            var token = await _identityService.GeneratePasswordResetTokenAsync(request.Email);
            
            var baseUrl = _configuration["FrontendBaseUrl"] ?? "http://localhost:4200";
            var resetLink = $"{baseUrl}/reset-password?email={Uri.EscapeDataString(request.Email)}&token={Uri.EscapeDataString(token)}";
            var emailBody = $"<p>You requested a password reset.</p><p>Please click the link below to reset your password:</p><p><a href='{resetLink}'>Reset Password</a></p>";
            var resetKey = Convert.ToHexString(SHA256.HashData(
                Encoding.UTF8.GetBytes($"{request.Email.ToUpperInvariant()}:{token}")));

            await _emailService.QueueEmailAsync(
                request.Email,
                "Password Reset",
                emailBody,
                $"password-reset:{resetKey}",
                HttpContext.RequestAborted);
            await _context.SaveChangesAsync(HttpContext.RequestAborted);
            
            return Ok(new { Message = "If an account with that email exists, a reset link has been sent." });
        }
        catch (InvalidOperationException)
        {
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

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var clientId = _configuration["GoogleAuth:ClientId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

            var result = await _identityService.GoogleLoginAsync(
                payload.Email,
                payload.GivenName ?? "",
                payload.FamilyName ?? "");

            if (!result.Succeeded)
                return BadRequest(new AuthResponse(false, null, null, null, null, null, null, null, result.Errors));

            return Ok(new AuthResponse(true, result.Token, result.Expiration, result.UserId, result.Email, result.FirstName, result.LastName, result.Roles, null, result.RefreshToken));
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new AuthResponse(false, null, null, null, null, null, null, null, new[] { "Invalid Google token." }));
        }
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Unauthorized();

        var result = await _identityService.UpdateProfileAsync(userId, request.FirstName, request.LastName);
        if (!result) return BadRequest(new { Message = "Failed to update profile." });

        return Ok(new { Message = "Profile updated successfully." });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Unauthorized();

        var result = await _identityService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        if (!result) return BadRequest(new { Message = "Failed to change password. Please check your current password." });

        return Ok(new { Message = "Password changed successfully." });
    }
}

public record UpdateProfileRequest(string FirstName, string LastName);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
