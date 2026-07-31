using Microsoft.AspNetCore.SignalR;

namespace Budgetha.Api.Hubs;

public class ReviewHub : Hub
{
    // Clients can join a group for a specific product to only receive reviews for that product
    public async Task JoinProductGroup(string productId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Product_{productId}");
    }

    public async Task LeaveProductGroup(string productId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Product_{productId}");
    }
}
