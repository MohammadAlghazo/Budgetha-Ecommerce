namespace Budgetha.Application.Common.Models;

public class AuthResult
{
    public bool Succeeded { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? Expiration { get; set; }
    public IEnumerable<string> Errors { get; set; } = [];
    public string? UserId { get; set; }

    public static AuthResult Success(string token, DateTime expiration, string userId, string? refreshToken = null)
        => new() { Succeeded = true, Token = token, Expiration = expiration, UserId = userId, RefreshToken = refreshToken };

    public static AuthResult Failure(params string[] errors)
        => new() { Succeeded = false, Errors = errors };
}
