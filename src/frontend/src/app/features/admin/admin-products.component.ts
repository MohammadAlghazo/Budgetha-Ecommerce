import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AdminService, AdminProductResult } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Products Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ productsResult()?.total ?? 0 }} total products.
            @if (pendingCount() > 0) {
              <span class="text-amber-600 font-medium">{{ pendingCount() }} awaiting approval.</span>
            }
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a routerLink="/admin/add-product" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Product
          </a>

        <!-- Filter tabs -->
        <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          @for (tab of filterTabs; track tab.value) {
            <button (click)="activeFilter.set(tab.value)"
                    [class.bg-white]="activeFilter() === tab.value"
                    [class.shadow-sm]="activeFilter() === tab.value"
                    [class.text-slate-900]="activeFilter() === tab.value"
                    [class.font-semibold]="activeFilter() === tab.value"
                    [class.text-slate-500]="activeFilter() !== tab.value"
                    class="px-4 py-2 rounded-lg text-sm transition-all">
              {{ tab.label }}
              @if (tab.value === 'Pending' && pendingCount() > 0) {
                <span class="ml-1.5 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{{ pendingCount() }}</span>
              }
            </button>
          }
        </div>
      </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @for (product of filteredProducts(); track product.id) {
                <tr class="hover:bg-slate-50/60 transition-colors" [class.opacity-50]="processingId() === product.id">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        @if (product.images && product.images.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        }
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 max-w-[200px] truncate" [title]="product.name">{{ product.name }}</p>
                        <p class="text-xs text-slate-400">{{ product.category }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ product.price | currency }}</td>
                  <td class="px-6 py-4">
                    <span [class.text-rose-600]="product.stock < 10"
                          [class.font-semibold]="product.stock < 10"
                          [class.text-slate-700]="product.stock >= 10">
                      {{ product.stock }}
                      @if (product.stock < 10) {
                        <span class="text-xs text-rose-400 ml-1">(Low)</span>
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          [class.bg-teal-100]="product.approvalStatus === 'Approved'"
                          [class.text-teal-700]="product.approvalStatus === 'Approved'"
                          [class.bg-amber-100]="product.approvalStatus === 'Pending'"
                          [class.text-amber-700]="product.approvalStatus === 'Pending'"
                          [class.bg-rose-100]="product.approvalStatus === 'Rejected'"
                          [class.text-rose-700]="product.approvalStatus === 'Rejected'">
                      <span class="w-1.5 h-1.5 rounded-full inline-block"
                            [class.bg-teal-500]="product.approvalStatus === 'Approved'"
                            [class.bg-amber-500]="product.approvalStatus === 'Pending'"
                            [class.bg-rose-500]="product.approvalStatus === 'Rejected'">
                      </span>
                      {{ product.approvalStatus }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Approve -->
                      @if (product.approvalStatus !== 'Approved') {
                        <button (click)="changeStatus(product, 'Approved')"
                                [disabled]="processingId() === product.id"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                          Approve
                        </button>
                      }
                      <!-- Reject -->
                      @if (product.approvalStatus !== 'Rejected') {
                        <button (click)="changeStatus(product, 'Rejected')"
                                [disabled]="processingId() === product.id"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          Reject
                        </button>
                      }
                      <!-- Delete (SuperAdmin only) -->
                      @if (isSuperAdmin()) {
                        <button (click)="confirmDelete(product)"
                                [disabled]="processingId() === product.id"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      <p class="text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    @if (productToDelete()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="productToDelete.set(null)"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="p-6">
            <div class="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Delete Product?</h3>
            <p class="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to permanently delete
              <span class="font-semibold text-slate-800">"{{ productToDelete()?.name }}"</span>?
              This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button (click)="productToDelete.set(null)"
                      class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                Cancel
              </button>
              <button (click)="deleteProduct()"
                      class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProductsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly productsResult = signal<AdminProductResult | null>(null);
  readonly processingId = signal<string | null>(null);
  readonly productToDelete = signal<any>(null);
  readonly activeFilter = signal<string>('All');

  readonly filterTabs = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly filteredProducts = computed(() => {
    const items = this.productsResult()?.items ?? [];
    const filter = this.activeFilter();
    if (filter === 'All') return items;
    return items.filter((p: any) => p.approvalStatus === filter);
  });

  readonly pendingCount = computed(() =>
    (this.productsResult()?.items ?? []).filter((p: any) => p.approvalStatus === 'Pending').length
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.adminService.getAllProducts().subscribe(result => this.productsResult.set(result));
  }

  changeStatus(product: any, status: 'Approved' | 'Rejected'): void {
    this.processingId.set(product.id);
    this.adminService.approveProduct(product.id, status).subscribe({
      next: () => {
        // Update local state optimistically
        const current = this.productsResult();
        if (current) {
          const updated = current.items.map((p: any) =>
            p.id === product.id ? { ...p, approvalStatus: status } : p
          );
          this.productsResult.set({ ...current, items: updated });
        }
        this.processingId.set(null);
      },
      error: () => {
        this.processingId.set(null);
      }
    });
  }

  confirmDelete(product: any): void {
    this.productToDelete.set(product);
  }

  deleteProduct(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.processingId.set(product.id);
    this.adminService.deleteProduct(product.id).subscribe({
      next: () => {
        const current = this.productsResult();
        if (current) {
          const updated = current.items.filter((p: any) => p.id !== product.id);
          this.productsResult.set({ ...current, items: updated, total: current.total - 1 });
        }
        this.productToDelete.set(null);
        this.processingId.set(null);
      },
      error: () => {
        this.productToDelete.set(null);
        this.processingId.set(null);
      }
    });
  }
}
