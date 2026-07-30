namespace Budgetha.Application.Common.Models;

public class AuthResult
{
    public bool Succeeded { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? Expiration { get; set; }
    public IEnumerable<string> Errors { get; set; } = [];
    public string? UserId { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public IList<string>? Roles { get; set; }

    public static AuthResult Success(string token, DateTime expiration, string userId, string email, string firstName, string lastName, IList<string> roles, string? refreshToken = null)
        => new() { Succeeded = true, Token = token, Expiration = expiration, UserId = userId, Email = email, FirstName = firstName, LastName = lastName, Roles = roles, RefreshToken = refreshToken };

    public static AuthResult Failure(params string[] errors)
        => new() { Succeeded = false, Errors = errors };
}
