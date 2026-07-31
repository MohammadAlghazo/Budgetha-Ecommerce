using Budgetha.Application.Common.Models;

namespace Budgetha.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<AuthResult> RegisterAsync(string email, string password, string firstName, string lastName);
    Task<AuthResult> LoginAsync(string email, string password);
    Task<string> GenerateEmailConfirmationTokenAsync(string userId);
    Task<bool> ConfirmEmailAsync(string userId, string token);
    Task<string> GeneratePasswordResetTokenAsync(string email);
    Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    Task<bool> AssignRoleAsync(string userId, string role);
    Task<bool> RemoveRoleAsync(string userId, string role);
    Task<IList<string>> GetRolesAsync(string userId);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<AuthResult> GoogleLoginAsync(string email, string firstName, string lastName);
    Task<bool> UpdateProfileAsync(string userId, string firstName, string lastName);
    Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
}
