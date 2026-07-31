import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, AdminProductResult } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Products Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ productsResult()?.total ?? 0 }} total products.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a routerLink="/admin/add-product" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Product
          </a>
        </div>
      </div>

      <!-- Products Desktop Table -->
      <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading products...</p>
                    </div>
                  </td>
                </tr>
              } @else {
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
                        <span class="text-xs text-rose-400 ms-1">(Low)</span>
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 text-end">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Edit -->
                      @if (canManageProducts()) {
                        <a [routerLink]="['/admin/edit-product', product.slug]"
                           class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          Edit
                        </a>

                        <!-- Delete -->
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
                  <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      <p class="text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden space-y-4">
        @if (isLoading()) {
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
            <div class="flex flex-col items-center justify-center gap-3">
              <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p class="text-sm text-slate-500 font-medium">Loading products...</p>
            </div>
          </div>
        } @else {
          @for (product of filteredProducts(); track product.id) {
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100" [class.opacity-50]="processingId() === product.id">
              <div class="flex items-center gap-3 mb-3">
                <div class="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  @if (product.images && product.images.length > 0) {
                    <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                  } @else {
                    <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  }
                </div>
                <div>
                  <p class="font-semibold text-slate-900 truncate" [title]="product.name">{{ product.name }}</p>
                  <p class="text-xs text-slate-400">{{ product.category }}</p>
                </div>
              </div>
              <div class="flex justify-between items-center text-sm mb-4">
                <span class="font-bold">{{ product.price | currency }}</span>
                <span [class.text-rose-600]="product.stock < 10" [class.font-semibold]="product.stock < 10" [class.text-slate-700]="product.stock >= 10">
                  Stock: {{ product.stock }}
                </span>
              </div>
              <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                @if (canManageProducts()) {
                  <a [routerLink]="['/admin/edit-product', product.slug]" class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                    Edit
                  </a>
                  <button (click)="confirmDelete(product)" [disabled]="processingId() === product.id" class="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
                    Delete
                  </button>
                }
              </div>
            </div>
          } @empty {
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-400">
              <p class="text-sm">No products found</p>
            </div>
          }
        }
      </div>

      <!-- Pagination -->
      @if (productsResult() && productsResult()!.totalPages > 1) {
        <div class="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm">
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing page <span class="font-medium">{{ currentPage() }}</span> of <span class="font-medium">{{ productsResult()?.totalPages }}</span>
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
                </button>
                <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() === productsResult()?.totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      }
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
  readonly isLoading = signal(true);
  readonly currentPage = signal(1);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly canManageProducts = computed(() => {
    const roles = this.authService.user()?.roles ?? [];
    return roles.includes('SuperAdmin') || roles.includes('Seller');
  });

  readonly filteredProducts = computed(() => {
    return this.productsResult()?.items ?? [];
  });

  ngOnInit(): void {
    this.loadProducts(this.currentPage());
  }

  loadProducts(page: number = 1): void {
    this.isLoading.set(true);
    this.adminService.getAllProducts(page).subscribe({
      next: (result) => {
        this.productsResult.set(result);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      }
    });
  }

  changePage(page: number): void {
    if (page > 0 && page <= (this.productsResult()?.totalPages || 1)) {
      this.loadProducts(page);
    }
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
