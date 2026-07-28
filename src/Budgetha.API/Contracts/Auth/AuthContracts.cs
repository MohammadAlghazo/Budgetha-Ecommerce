using System.ComponentModel.DataAnnotations;

namespace Budgetha.API.Contracts.Auth;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password,
    [Required] string FirstName,
    [Required] string LastName);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record ForgotPasswordRequest(
    [Required, EmailAddress] string Email);

public record ResetPasswordRequest(
    [Required, EmailAddress] string Email,
    [Required] string Token,
    [Required, MinLength(8)] string NewPassword);

public record ConfirmEmailRequest(
    [Required] string UserId,
    [Required] string Token);

public record AuthResponse(
    bool Succeeded,
    string? Token,
    DateTime? Expiration,
    string? UserId,
    IEnumerable<string>? Errors);

public record AssignRoleRequest(
    [Required] string UserId,
    [Required] string Role);
