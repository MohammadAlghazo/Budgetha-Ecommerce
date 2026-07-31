using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Common.Models;
using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;

namespace Budgetha.Infrastructure.Authentication;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly IMemoryCache _cache;
    private const string UsersCacheKey = "Admin_AllUsersCache";

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        TokenService tokenService,
        IMemoryCache cache)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _cache = cache;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser is not null)
            return AuthResult.Failure("A user with this email already exists.");

        var user = new ApplicationUser
        {
            Email = email,
            UserName = email,
            FirstName = firstName,
            LastName = lastName
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return AuthResult.Failure(result.Errors.Select(e => e.Description).ToArray());

        await _userManager.AddToRoleAsync(user, "User");

        var (token, expiration) = await _tokenService.GenerateTokenAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return AuthResult.Success(token, expiration, user.Id, user.Email!, user.FirstName, user.LastName, roles, refreshToken);
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return AuthResult.Failure("Invalid email or password.");

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (result.IsLockedOut)
            return AuthResult.Failure("Account is locked. Please try again later.");
        if (!result.Succeeded)
            return AuthResult.Failure("Invalid email or password.");

        var (token, expiration) = await _tokenService.GenerateTokenAsync(user);
        var roles = await _userManager.GetRolesAsync(user);

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return AuthResult.Success(token, expiration, user.Id, user.Email!, user.FirstName, user.LastName, roles, refreshToken);
    }

    public async Task<string> GenerateEmailConfirmationTokenAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found.");
        return await _userManager.GenerateEmailConfirmationTokenAsync(user);
    }

    public async Task<bool> ConfirmEmailAsync(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;

        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded;
    }

    public async Task<string> GeneratePasswordResetTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email)
            ?? throw new InvalidOperationException("User not found.");
        return await _userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null) return false;

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        return result.Succeeded;
    }

    public async Task<bool> AssignRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;

        var result = await _userManager.AddToRoleAsync(user, role);
        if (result.Succeeded)
            _cache.Remove(UsersCacheKey);
        return result.Succeeded;
    }

    public async Task<bool> RemoveRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;

        var result = await _userManager.RemoveFromRoleAsync(user, role);
        if (result.Succeeded)
            _cache.Remove(UsersCacheKey);
        return result.Succeeded;
    }

    public async Task<IList<string>> GetRolesAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found.");
        return await _userManager.GetRolesAsync(user);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;
        return await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<AuthResult> GoogleLoginAsync(string email, string firstName, string lastName)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            user = new ApplicationUser
            {
                Email = email,
                UserName = email,
                FirstName = firstName,
                LastName = lastName,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
                return AuthResult.Failure(createResult.Errors.Select(e => e.Description).ToArray());

            await _userManager.AddToRoleAsync(user, "User");
        }

        var (token, expiration) = await _tokenService.GenerateTokenAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return AuthResult.Success(token, expiration, user.Id, user.Email!, user.FirstName, user.LastName, roles, refreshToken);
    }

    public async Task<bool> UpdateProfileAsync(string userId, string firstName, string lastName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.FirstName = firstName;
        user.LastName = lastName;
        
        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
            _cache.Remove(UsersCacheKey);

        return result.Succeeded;
    }

    public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        return result.Succeeded;
    }

    public async Task<AuthResult> RefreshTokenAsync(string token, string refreshToken)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(token);
        if (principal == null)
            return AuthResult.Failure("Invalid token.");

        var email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (email == null)
            return AuthResult.Failure("Invalid token.");

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return AuthResult.Failure("Invalid refresh token.");

        var (newToken, newExpiration) = await _tokenService.GenerateTokenAsync(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        return AuthResult.Success(newToken, newExpiration, user.Id, user.Email!, user.FirstName, user.LastName, roles, newRefreshToken);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}
