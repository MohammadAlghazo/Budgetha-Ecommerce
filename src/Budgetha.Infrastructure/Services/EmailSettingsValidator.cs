using Microsoft.Extensions.Options;

namespace Budgetha.Infrastructure.Services;

public sealed class EmailSettingsValidator : IValidateOptions<EmailSettings>
{
    public ValidateOptionsResult Validate(string? name, EmailSettings settings)
    {
        if (!settings.Enabled)
            return ValidateOptionsResult.Success;

        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(settings.Host))
            errors.Add("EmailSettings:Host is required when email is enabled.");
        if (settings.Port is < 1 or > 65535)
            errors.Add("EmailSettings:Port must be between 1 and 65535.");
        if (!System.Net.Mail.MailAddress.TryCreate(settings.FromEmail, out _))
            errors.Add("EmailSettings:FromEmail must be a valid email address.");
        if (settings.TimeoutSeconds is < 1 or > 300)
            errors.Add("EmailSettings:TimeoutSeconds must be between 1 and 300.");
        if (string.IsNullOrWhiteSpace(settings.Username) != string.IsNullOrWhiteSpace(settings.Password))
            errors.Add("EmailSettings:Username and Password must either both be set or both be empty.");

        return errors.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(errors);
    }
}
