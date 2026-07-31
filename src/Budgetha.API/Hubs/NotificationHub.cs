using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Budgetha.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    // Real-time connections are managed based on the authenticated user's NameIdentifier (UserId) by default in SignalR.
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
