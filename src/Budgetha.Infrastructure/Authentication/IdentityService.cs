using Budgetha.Application.Common.Interfaces;
using Budgetha.Application.Common.Models;
using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Budgetha.Infrastructure.Authentication;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly TokenService _tokenService;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
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
        return AuthResult.Success(token, expiration, user.Id);
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
        return AuthResult.Success(token, expiration, user.Id);
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
        return result.Succeeded;
    }

    public async Task<bool> RemoveRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;

        var result = await _userManager.RemoveFromRoleAsync(user, role);
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
        return AuthResult.Success(token, expiration, user.Id);
    }
}
