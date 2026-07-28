namespace Budgetha.Application.Common.Models;

public record ImageUploadResponse(
    string Url,
    string PublicId,
    bool Succeeded,
    string? Error = null)
{
    public static ImageUploadResponse Success(string url, string publicId)
        => new(url, publicId, true);

    public static ImageUploadResponse Failure(string error)
        => new(string.Empty, string.Empty, false, error);
}
