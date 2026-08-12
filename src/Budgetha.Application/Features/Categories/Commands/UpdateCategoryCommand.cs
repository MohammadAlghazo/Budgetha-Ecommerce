using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Budgetha.Application.Features.Categories.Commands;

public record UpdateCategoryCommand(
    Guid Id,
    string Name,
    string Slug,
    string? ImageUrl,
    Guid? ParentId
) : IRequest<bool>;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FindAsync(new object[] { request.Id }, cancellationToken);
        if (category == null) return false;

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.ImageUrl = request.ImageUrl;
        category.ParentId = request.ParentId;

        if (!string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            var pendingUpload = await _context.PendingImageUploads
                .FirstOrDefaultAsync(u => u.Url == request.ImageUrl, cancellationToken);
            if (pendingUpload != null)
            {
                _context.PendingImageUploads.Remove(pendingUpload);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
