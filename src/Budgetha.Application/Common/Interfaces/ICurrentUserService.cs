namespace Budgetha.Application.Common.Interfaces;

/// <summary>
/// Exposes the current authenticated user's identity to the application layer
/// without a direct dependency on ASP.NET Core's HttpContext.
/// </summary>
public interface ICurrentUserService
{
    string? UserId { get; }
    bool IsAuthenticated { get; }
}
