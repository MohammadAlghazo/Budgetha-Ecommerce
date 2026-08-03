using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Common.Models;
using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;
using System.Text;
using Budgetha.Infrastructure.Persistence;

namespace Budgetha.Infrastructure.Authentication;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly IMemoryCache _cache;
    private readonly ApplicationDbContext _context;
    private const string UsersCacheKey = "Admin_AllUsersCache";

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        TokenService tokenService,
        IMemoryCache cache,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _cache = cache;
        _context = context;
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
        
        var refreshToken = await IssueRefreshTokenAsync(user);

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

        var refreshToken = await IssueRefreshTokenAsync(user);

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

    public async Task<IList<string>> GetUserIdsInRoleAsync(string role)
    {
        var users = await _userManager.GetUsersInRoleAsync(role);
        return users.Select(user => user.Id).ToList();
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
        
        var refreshToken = await IssueRefreshTokenAsync(user);

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
        System.Security.Claims.ClaimsPrincipal? principal;
        try
        {
            principal = _tokenService.GetPrincipalFromExpiredToken(token);
        }
        catch (Microsoft.IdentityModel.Tokens.SecurityTokenException)
        {
            return AuthResult.Failure("Invalid token.");
        }
        catch (ArgumentException)
        {
            return AuthResult.Failure("Invalid token.");
        }
        if (principal == null)
            return AuthResult.Failure("Invalid token.");

        var email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (email == null)
            return AuthResult.Failure("Invalid token.");

        var user = await _userManager.FindByEmailAsync(email);
        var securityStamp = principal.FindFirst("security_stamp")?.Value;
        if (user == null || user.LockoutEnd > DateTimeOffset.UtcNow ||
            !string.Equals(user.SecurityStamp ?? string.Empty, securityStamp ?? string.Empty, StringComparison.Ordinal))
            return AuthResult.Failure("Invalid refresh token.");

        var now = DateTimeOffset.UtcNow;
        var tokenHash = HashToken(refreshToken);
        var storedToken = await _context.RefreshTokens
            .SingleOrDefaultAsync(candidate => candidate.UserId == user.Id && candidate.TokenHash == tokenHash);

        // Existing installations stored one raw token on the user. Rotate it once into the token-family model.
        var isLegacyToken = storedToken is null &&
            user.RefreshTokenExpiryTime > DateTime.UtcNow &&
            FixedTimeEquals(user.RefreshToken, refreshToken);
        if (storedToken is null && !isLegacyToken)
            return AuthResult.Failure("Invalid refresh token.");

        if (storedToken is not null &&
            (storedToken.UsedAt.HasValue || storedToken.RevokedAt.HasValue))
        {
            await RevokeAllSessionsAsync(user.Id, now);
            return AuthResult.Failure("Refresh token reuse detected. All sessions have been revoked.");
        }

        if (storedToken is not null && storedToken.ExpiresAt <= now)
            return AuthResult.Failure("Invalid refresh token.");

        var familyId = storedToken?.FamilyId ?? Guid.NewGuid();
        var newRefreshToken = GenerateRefreshToken();
        var newRefreshTokenHash = HashToken(newRefreshToken);

        if (storedToken is null)
        {
            storedToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                FamilyId = familyId,
                CreatedAt = now,
                ExpiresAt = new DateTimeOffset(
                    DateTime.SpecifyKind(user.RefreshTokenExpiryTime!.Value, DateTimeKind.Utc))
            };
            _context.RefreshTokens.Add(storedToken);
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
        }

        storedToken.UsedAt = now;
        storedToken.ReplacedByTokenHash = newRefreshTokenHash;
        _context.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenHash,
            FamilyId = familyId,
            CreatedAt = now,
            ExpiresAt = now.AddDays(7)
        });

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            await RevokeAllSessionsAsync(user.Id, now);
            return AuthResult.Failure("Refresh token reuse detected. All sessions have been revoked.");
        }
        catch (DbUpdateException)
        {
            await RevokeAllSessionsAsync(user.Id, now);
            return AuthResult.Failure("Refresh token reuse detected. All sessions have been revoked.");
        }

        var (newToken, newExpiration) = await _tokenService.GenerateTokenAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        return AuthResult.Success(newToken, newExpiration, user.Id, user.Email!, user.FirstName, user.LastName, roles, newRefreshToken);
    }

    private async Task<string> IssueRefreshTokenAsync(ApplicationUser user)
    {
        var token = GenerateRefreshToken();
        var now = DateTimeOffset.UtcNow;
        _context.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(token),
            FamilyId = Guid.NewGuid(),
            CreatedAt = now,
            ExpiresAt = now.AddDays(7)
        });
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _context.SaveChangesAsync();
        return token;
    }

    private async Task RevokeAllSessionsAsync(string userId, DateTimeOffset revokedAt)
    {
        _context.ChangeTracker.Clear();
        await _context.RefreshTokens
            .Where(token => token.UserId == userId && token.RevokedAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(token => token.RevokedAt, revokedAt));

        var user = await _userManager.FindByIdAsync(userId);
        if (user is not null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
        }

        await _context.SaveChangesAsync();
        if (user is not null)
            await _userManager.UpdateSecurityStampAsync(user);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        RandomNumberGenerator.Fill(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private static bool FixedTimeEquals(string? left, string right)
    {
        if (left is null) return false;
        return CryptographicOperations.FixedTimeEquals(
            SHA256.HashData(Encoding.UTF8.GetBytes(left)),
            SHA256.HashData(Encoding.UTF8.GetBytes(right)));
    }
}
