using System.Threading.Tasks;

namespace Budgetha.Application.Common.Interfaces;

public interface INotificationService
{
    Task SendNotificationAsync(string userId, string title, string message, string type, string? relatedEntityId = null);
}
