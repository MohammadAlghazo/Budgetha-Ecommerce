using Budgetha.Application.Common.Models;

namespace Budgetha.Application.Common.Interfaces;

public interface IImageService
{
    Task<ImageUploadResponse> UploadImageAsync(Stream fileStream, string fileName);
    Task<bool> DeleteImageAsync(string publicId);
}
