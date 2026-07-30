using Budgetha.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Budgetha.Application.Common.Behaviours;




public class UnhandledExceptionBehaviour<TRequest, TResponse>(
    ILogger<TRequest> logger) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        try
        {
            return await next(ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception for request {Name} {@Request}", typeof(TRequest).Name, request);
            throw;
        }
    }
}
