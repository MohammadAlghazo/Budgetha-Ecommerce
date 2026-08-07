import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminProductResult } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">

      @if (sellerDeleteMode()) {
        <div class="rounded-2xl bg-rose-50 border border-rose-200 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-rose-900 text-sm">Seller Deletion Mode</p>
              <p class="text-rose-700 text-xs mt-0.5">
                To delete seller <strong>{{ sellerDeleteMode()!.sellerName }}</strong>, you must first delete all {{ sellerProductCount() }} product(s) listed below.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <button (click)="deleteAllSellerProducts()"
                    [disabled]="deletingAllSeller()"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
              @if (deletingAllSeller()) {
                <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Deleting...
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete All Products
              }
            </button>
            <button (click)="exitSellerDeleteMode()" class="text-xs text-rose-600 hover:text-rose-800 font-semibold underline">Cancel</button>
          </div>
        </div>
      }
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Products Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ productsResult()?.total ?? 0 }} total products.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filters -->
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            <option value="">All Categories</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.slug">{{ cat.name }}</option>
            }
          </select>

          <select [(ngModel)]="selectedSort" (change)="applyFilters()" class="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            <option value="newest">Newest to Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

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
                        <p class="text-xs text-slate-400 mt-0.5">
                          @if (product.categories?.length) {
                            {{ product.categories[0].name }}
                            @if (product.categories.length > 1) {
                              <span class="opacity-75"> +{{ product.categories.length - 1 }}</span>
                            }
                          } @else {
                            Uncategorized
                          }
                        </p>
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
                      <!-- View Details -->
                      <button (click)="viewDetails(product)"
                              class="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        View Details
                      </button>

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
                      @if (canApproveProducts() && product.approvalStatus !== 'Approved') {
                        <button (click)="approve(product.id, 'Approved')" [disabled]="processingId() === product.id" class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">Approve</button>
                      }
                      @if (canApproveProducts() && product.approvalStatus !== 'Rejected') {
                        <button (click)="approve(product.id, 'Rejected')" [disabled]="processingId() === product.id" class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">Reject</button>
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
                  <p class="text-xs text-slate-400 mt-0.5">
                    @if (product.categories?.length) {
                      {{ product.categories[0].name }}
                      @if (product.categories.length > 1) {
                        <span class="opacity-75"> +{{ product.categories.length - 1 }}</span>
                      }
                    } @else {
                      Uncategorized
                    }
                  </p>
                </div>
              </div>
              <div class="flex justify-between items-center text-sm mb-4">
                <span class="font-bold">{{ product.price | currency }}</span>
                <span [class.text-rose-600]="product.stock < 10" [class.font-semibold]="product.stock < 10" [class.text-slate-700]="product.stock >= 10">
                  Stock: {{ product.stock }}
                </span>
              </div>
              <div class="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button (click)="viewDetails(product)"
                        class="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  Details
                </button>
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

    <!-- Product Details Modal -->
    @if (selectedProductDetails()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="selectedProductDetails.set(null)"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-slate-900">Product Details</h3>
              <button (click)="selectedProductDetails.set(null)" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div class="space-y-6">
              <div class="flex gap-4 items-start">
                <div class="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  @if (selectedProductDetails()?.images && selectedProductDetails()?.images?.length > 0) {
                    <img [src]="selectedProductDetails()?.images[0]" [alt]="selectedProductDetails()?.name" class="w-full h-full object-cover">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center text-slate-300">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  }
                </div>
                <div>
                  <h4 class="text-lg font-bold text-slate-900">{{ selectedProductDetails()?.name }}</h4>
                  <p class="text-sm text-slate-500 mt-1 line-clamp-2">{{ selectedProductDetails()?.description }}</p>
                  <div class="flex gap-2 mt-2">
                    @for (cat of selectedProductDetails()?.categories; track cat.id) {
                      <span class="inline-flex px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">
                        {{ cat.name }}
                      </span>
                    }
                    <span class="inline-flex px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                      {{ selectedProductDetails()?.brand || 'No Brand' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</p>
                  <p class="text-lg font-bold text-slate-900">{{ selectedProductDetails()?.price | currency }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stock</p>
                  <p class="text-lg font-bold" [class.text-rose-600]="selectedProductDetails()?.stock < 10" [class.text-slate-900]="selectedProductDetails()?.stock >= 10">
                    {{ selectedProductDetails()?.stock }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rating</p>
                  <p class="text-lg font-bold text-slate-900 flex items-center gap-1">
                    {{ selectedProductDetails()?.rating }}
                    <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reviews</p>
                  <p class="text-lg font-bold text-slate-900">{{ selectedProductDetails()?.reviewCount }}</p>
                </div>
              </div>

              <!-- Seller Info Section -->
              <div class="border-t border-slate-100 pt-4">
                <h5 class="text-sm font-bold text-slate-900 mb-3">Seller Information</h5>
                <div class="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {{ selectedProductDetails()?.sellerName?.charAt(0) || '?' }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">{{ selectedProductDetails()?.sellerName || 'Unknown Seller' }}</p>
                      <p class="text-sm text-slate-500">Seller ID: {{ selectedProductDetails()?.sellerId }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-8 flex justify-end">
              <button (click)="selectedProductDetails.set(null)"
                      class="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    }

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
                      [disabled]="!!processingId()"
                      class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm disabled:opacity-60">
                Cancel
              </button>
              <button (click)="deleteProduct()"
                      [disabled]="!!processingId()"
                      class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                @if (processingId() === productToDelete()?.id) {
                  <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                }
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
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);

  readonly productsResult = signal<AdminProductResult | null>(null);
  readonly processingId = signal<string | null>(null);
  readonly productToDelete = signal<any>(null);
  readonly selectedProductDetails = signal<any>(null);
  readonly isLoading = signal(true);
  readonly currentPage = signal(1);
  readonly categories = signal<any[]>([]);
  readonly sellerDeleteMode = signal<{ sellerId: string; sellerName: string } | null>(null);
  readonly deletingAllSeller = signal(false);

  selectedCategory = '';
  selectedSort = 'newest';

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly canManageProducts = computed(() => {
    const roles = this.authService.user()?.roles ?? [];
    return roles.includes('SuperAdmin') || roles.includes('Seller');
  });

  readonly canApproveProducts = computed(() => {
    const roles = this.authService.user()?.roles ?? [];
    return roles.includes('Admin') || roles.includes('SuperAdmin');
  });

  readonly filteredProducts = computed(() => {
    const mode = this.sellerDeleteMode();
    const items = this.productsResult()?.items ?? [];
    if (mode) {
      return items.filter((p: any) => p.sellerId === mode.sellerId);
    }
    return items;
  });

  readonly sellerProductCount = computed(() => this.filteredProducts().length);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('sellerDeleteMode') === '1') {
      this.sellerDeleteMode.set({
        sellerId: params.get('sellerId') ?? '',
        sellerName: params.get('sellerName') ?? 'Unknown Seller'
      });
    }
    this.loadCategories();
    this.loadProducts(this.currentPage());
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  loadProducts(page: number = 1): void {
    this.isLoading.set(true);
    this.adminService.getAllProducts(page, 50, this.selectedSort, this.selectedCategory).subscribe({
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

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadProducts(1);
  }

  changePage(page: number): void {
    if (page > 0 && page <= (this.productsResult()?.totalPages || 1)) {
      this.loadProducts(page);
    }
  }

  viewDetails(product: any): void {
    this.selectedProductDetails.set(product);
  }

  approve(productId: string, status: 'Approved' | 'Rejected'): void {
    this.processingId.set(productId);
    this.adminService.approveProduct(productId, status).subscribe({
      next: () => {
        this.processingId.set(null);
        this.loadProducts(this.currentPage());
      },
      error: () => this.processingId.set(null)
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

  deleteAllSellerProducts(): void {
    const mode = this.sellerDeleteMode();
    if (!mode || this.deletingAllSeller()) return;

    const sellerProducts = this.filteredProducts();
    if (sellerProducts.length === 0) return;

    this.deletingAllSeller.set(true);
    const deletes$ = sellerProducts.map((p: any) => this.adminService.deleteProduct(p.id));

    forkJoin(deletes$).subscribe({
      next: () => {
        const current = this.productsResult();
        if (current) {
          const sellerIds = new Set(sellerProducts.map((p: any) => p.id));
          const remaining = current.items.filter((p: any) => !sellerIds.has(p.id));
          this.productsResult.set({ ...current, items: remaining, total: remaining.length });
        }
        this.deletingAllSeller.set(false);
        this.sellerDeleteMode.set(null);
      },
      error: () => {
        this.deletingAllSeller.set(false);
        this.loadProducts(this.currentPage());
      }
    });
  }

  exitSellerDeleteMode(): void {
    this.sellerDeleteMode.set(null);
  }
}
