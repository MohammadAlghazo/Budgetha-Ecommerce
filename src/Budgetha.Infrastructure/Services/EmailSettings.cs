using System.ComponentModel.DataAnnotations;

namespace Budgetha.Infrastructure.Services;

public sealed class EmailSettings
{
    public const string SectionName = "EmailSettings";

    public bool Enabled { get; set; }
    public string Host { get; set; } = string.Empty;

    [Range(1, 65535)]
    public int Port { get; set; } = 25;

    public bool EnableSsl { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string FromEmail { get; set; } = string.Empty;

    [Range(1, 300)]
    public int TimeoutSeconds { get; set; } = 30;
}
