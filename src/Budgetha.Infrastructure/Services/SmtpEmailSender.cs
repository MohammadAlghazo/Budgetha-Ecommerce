using System.Net;
using System.Net.Mail;
using Budgetha.Application.Common.Interfaces;
using Microsoft.Extensions.Options;

namespace Budgetha.Infrastructure.Services;

public sealed class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;

    public SmtpEmailSender(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public bool IsEnabled => _settings.Enabled;

    public async Task SendAsync(
        string recipient,
        string subject,
        string body,
        CancellationToken cancellationToken = default)
    {
        if (!IsEnabled)
            return;

        using var client = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.EnableSsl,
            Timeout = checked(_settings.TimeoutSeconds * 1000)
        };
        if (!string.IsNullOrWhiteSpace(_settings.Username))
            client.Credentials = new NetworkCredential(_settings.Username, _settings.Password);

        using var message = new MailMessage
        {
            From = new MailAddress(_settings.FromEmail),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        message.To.Add(recipient);

        await client.SendMailAsync(message, cancellationToken)
            .WaitAsync(TimeSpan.FromSeconds(_settings.TimeoutSeconds), cancellationToken);
    }
}
