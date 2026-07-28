namespace Budgetha.Application.Common.Exceptions;

public class NotFoundException(string name, object key)
    : Exception($"Entity \"{name}\" ({key}) was not found.");

public class ValidationException(IEnumerable<string> errors)
    : Exception($"Validation failed: {string.Join("; ", errors)}")
{
    public IEnumerable<string> Errors { get; } = errors;
}

public class ForbiddenAccessException()
    : Exception("Access is forbidden.");
