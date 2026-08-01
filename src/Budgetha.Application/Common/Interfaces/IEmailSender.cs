namespace Budgetha.Application.Common.Interfaces;

public interface IEmailSender
{
    bool IsEnabled { get; }
    Task SendAsync(
        string recipient,
        string subject,
        string body,
        CancellationToken cancellationToken = default);
}
