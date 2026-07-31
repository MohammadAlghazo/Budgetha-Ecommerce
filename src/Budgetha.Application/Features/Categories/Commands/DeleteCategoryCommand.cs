using Budgetha.Application.Common.Interfaces;
using MediatR;

namespace Budgetha.Application.Features.Categories.Commands;

public record DeleteCategoryCommand(Guid Id) : IRequest<bool>;

public class DeleteCategoryCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteCategoryCommand, bool>
{
    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await context.Categories.FindAsync([request.Id], cancellationToken);
        if (category is null) return false;

        context.Categories.Remove(category);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
