namespace Budgetha.Application.Common.Interfaces;

public interface IInventoryLockService
{
    Task<IInventoryTransaction> BeginTransactionAsync(
        IEnumerable<Guid> inventoryIds,
        CancellationToken cancellationToken);
}

public interface IInventoryTransaction : IAsyncDisposable
{
    Task CommitAsync(CancellationToken cancellationToken);
}
