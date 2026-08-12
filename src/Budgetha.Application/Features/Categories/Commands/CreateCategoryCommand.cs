using Budgetha.Application.Common.Interfaces;
using Budgetha.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Budgetha.Application.Features.Categories.Commands;

public record CreateCategoryCommand : IRequest<Guid>
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
}

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        
        var slug = Regex.Replace(request.Name.ToLowerInvariant(), @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-").Trim('-');

        
        var exists = _context.Categories.Any(c => c.Slug == slug);
        if (exists)
        {
            slug = $"{slug}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
        }

        var category = new Category
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            ImageUrl = request.ImageUrl
        };

        _context.Categories.Add(category);
        
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

        return category.Id;
    }
}
