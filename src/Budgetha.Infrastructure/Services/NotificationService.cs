using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace Budgetha.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IServiceProvider _serviceProvider;

    public NotificationService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task SendNotificationAsync(string userId, string title, string message, string type, string? relatedEntityId = null)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        // 1. Save to database
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            IsRead = false,
            RelatedEntityId = relatedEntityId
        };

        context.Notifications.Add(notification);
        await context.SaveChangesAsync(default);

        // 2. Broadcast via SignalR dynamically (using Reflection to get IHubContext since Budgetha.Infrastructure doesn't reference Budgetha.API directly)
        try
        {
            var hubContextType = Type.GetType("Microsoft.AspNetCore.SignalR.IHubContext`1, Microsoft.AspNetCore.SignalR.Core");
            var myHubType = Type.GetType("Budgetha.API.Hubs.NotificationHub, Budgetha.API");
            
            if (hubContextType != null && myHubType != null)
            {
                var genericHubContextType = hubContextType.MakeGenericType(myHubType);
                var hubContext = scope.ServiceProvider.GetService(genericHubContextType);

                if (hubContext != null)
                {
                    var clientsProperty = genericHubContextType.GetProperty("Clients");
                    var clients = clientsProperty?.GetValue(hubContext);
                    
                    var userMethod = clients?.GetType().GetMethod("User", new[] { typeof(string) });
                    var userProxy = userMethod?.Invoke(clients, new object[] { userId });

                    var sendMethod = userProxy?.GetType().GetMethod("SendCoreAsync", new[] { typeof(string), typeof(object[]), typeof(System.Threading.CancellationToken) });
                    
                    if (sendMethod != null)
                    {
                        var task = (Task)sendMethod.Invoke(userProxy, new object[] 
                        { 
                            "ReceiveNotification", 
                            new object[] { new 
                            {
                                id = notification.Id.ToString(),
                                title = notification.Title,
                                message = notification.Message,
                                type = notification.Type,
                                isRead = notification.IsRead,
                                relatedEntityId = notification.RelatedEntityId,
                                createdAt = notification.Created
                            } }, 
                            default(System.Threading.CancellationToken) 
                        });
                        
                        if (task != null)
                        {
                            await task;
                        }
                    }
                }
            }
        }
        catch
        {
            // Ignore SignalR reflection errors, the notification is already saved to DB.
        }
    }
}
