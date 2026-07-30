import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface SellerProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  approvalStatus: string;
  images: string[];
}

export interface SellerCatalogResult {
  items: SellerProduct[];
  total: number;
  totalPages: number;
}

@Component({
  selector: 'app-seller-products',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">My Products</h2>
          <p class="mt-1 text-sm text-slate-500">
            Manage your store inventory. You have {{ productsResult()?.total ?? 0 }} products total.
          </p>
        </div>
        
        <a routerLink="/seller/add-product"
           class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
          Add Product
        </a>
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
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @for (product of productsResult()?.items; track product.id) {
                <tr class="hover:bg-slate-50/60 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        @if (product.images && product.images.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        }
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 max-w-[200px] truncate" [title]="product.name">{{ product.name }}</p>
                        <p class="text-xs text-slate-400">{{ product.category }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold text-slate-900">{{ product.price | currency }}</td>
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
                          [class.bg-emerald-100]="product.approvalStatus === 'Approved'"
                          [class.text-emerald-700]="product.approvalStatus === 'Approved'"
                          [class.bg-amber-100]="product.approvalStatus === 'Pending'"
                          [class.text-amber-700]="product.approvalStatus === 'Pending'"
                          [class.bg-rose-100]="product.approvalStatus === 'Rejected'"
                          [class.text-rose-700]="product.approvalStatus === 'Rejected'">
                      <span class="w-1.5 h-1.5 rounded-full inline-block"
                            [class.bg-emerald-500]="product.approvalStatus === 'Approved'"
                            [class.bg-amber-500]="product.approvalStatus === 'Pending'"
                            [class.bg-rose-500]="product.approvalStatus === 'Rejected'">
                      </span>
                      {{ product.approvalStatus }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-16 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      </div>
                      <p class="text-base font-semibold text-slate-600">No products yet</p>
                      <p class="text-sm max-w-sm mx-auto">You haven't added any products to your store. Click "Add Product" to get started.</p>
                      <a routerLink="/seller/add-product" class="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">Add your first product &rarr;</a>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class SellerProductsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly productsResult = signal<SellerCatalogResult | null>(null);

  ngOnInit(): void {
    this.http.get<SellerCatalogResult>(`${environment.apiUrl}/api/products/my-products`).subscribe({
      next: (res) => this.productsResult.set(res),
      error: (err) => console.error('Error fetching seller products', err)
    });
  }
}
