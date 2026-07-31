using Budgetha.Application.Common.Interfaces;
using Budgetha.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Budgetha.Infrastructure.Services;

public sealed class PostgresInventoryLockService : IInventoryLockService
{
    private readonly ApplicationDbContext _context;

    public PostgresInventoryLockService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IInventoryTransaction> BeginTransactionAsync(
        IEnumerable<Guid> inventoryIds,
        CancellationToken cancellationToken)
    {
        var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var keys = inventoryIds.Select(id => BitConverter.ToInt64(id.ToByteArray())).Distinct().Order().ToList();
            foreach (var key in keys)
                await _context.Database.ExecuteSqlInterpolatedAsync($"SELECT pg_advisory_xact_lock({key})", cancellationToken);

            return new InventoryTransaction(transaction);
        }
        catch
        {
            await transaction.DisposeAsync();
            throw;
        }
    }

    private sealed class InventoryTransaction : IInventoryTransaction
    {
        private readonly IDbContextTransaction _transaction;

        public InventoryTransaction(IDbContextTransaction transaction)
        {
            _transaction = transaction;
        }

        public Task CommitAsync(CancellationToken cancellationToken) => _transaction.CommitAsync(cancellationToken);

        public ValueTask DisposeAsync() => _transaction.DisposeAsync();
    }
}
