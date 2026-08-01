using Budgetha.Application.Common.Exceptions;
using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Budgetha.Application.Features.Orders.Commands;

public record ResolveDeliveryReportCommand(Guid ReportId, bool Dismiss, string Note) : IRequest;

public sealed class ResolveDeliveryReportCommandHandler : IRequestHandler<ResolveDeliveryReportCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IIdentityService _identity;
    private readonly IOrderCommunicationService _communications;

    public ResolveDeliveryReportCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IIdentityService identity,
        IOrderCommunicationService communications)
    { _context = context; _currentUser = currentUser; _identity = identity; _communications = communications; }

    public async Task Handle(ResolveDeliveryReportCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();
        var roles = await _identity.GetRolesAsync(userId);
        if (!roles.Contains("Admin") && !roles.Contains("SuperAdmin")) throw new ForbiddenAccessException();
        if (string.IsNullOrWhiteSpace(request.Note) || request.Note.Trim().Length < 5)
            throw new ValidationException(new[] { "A resolution note of at least 5 characters is required." });

        var report = await _context.DeliveryReports
            .Include(r => r.Order).ThenInclude(o => o.Fulfillments)
            .SingleOrDefaultAsync(r => r.Id == request.ReportId, cancellationToken)
            ?? throw new NotFoundException("DeliveryReport", request.ReportId);
        if (report.Status != DeliveryReportStatus.Open)
            throw new InvalidOperationException("This delivery report has already been resolved.");

        report.Status = request.Dismiss ? DeliveryReportStatus.Dismissed : DeliveryReportStatus.Resolved;
        report.AdminNote = request.Note.Trim();
        report.ResolvedById = userId;
        report.ResolvedAt = DateTimeOffset.UtcNow;
        await _communications.QueueDeliveryReportResolutionAsync(
            report.Order,
            report.Order.Fulfillments.Select(f => f.SellerId),
            request.Dismiss,
            report.AdminNote,
            cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
