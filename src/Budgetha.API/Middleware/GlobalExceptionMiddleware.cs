using System.Net;
using System.Text.Json;
using Budgetha.Application.Common.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException notFound => (HttpStatusCode.NotFound, notFound.Message),
            ValidationException validation => (HttpStatusCode.BadRequest, JsonSerializer.Serialize(validation.Errors)),
            ForbiddenAccessException => (HttpStatusCode.Forbidden, "You do not have permission to perform this action."),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "You are not authorized."),
            InvalidOperationException invalidOperation => (HttpStatusCode.BadRequest, invalidOperation.Message),
            DbUpdateException => (HttpStatusCode.Conflict, "The request conflicts with existing data."),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
        };

        if (exception is DbUpdateException)
            _logger.LogError(exception, "Database update failed while handling {Method} {Path}. TraceId: {TraceId}",
                context.Request.Method, context.Request.Path, context.TraceIdentifier);
        else if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception");

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        object response = exception is ValidationException validationException
            ? new
            {
                StatusCode = (int)statusCode,
                Message = "Validation failed.",
                Errors = validationException.Errors,
                TraceId = context.TraceIdentifier
            }
            : new
            {
                StatusCode = (int)statusCode,
                Message = message,
                TraceId = context.TraceIdentifier
            };

        await context.Response.WriteAsJsonAsync(response);
    }
}
