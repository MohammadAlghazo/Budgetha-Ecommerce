import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, Review } from '../../core/models/shop.models';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

type Tab = 'description' | 'specs' | 'reviews';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent, ProductCardComponent, EmptyStateComponent, FormsModule],
  template: `
    @if (product(); as p) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <!-- Breadcrumb -->
        <nav class="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
          <span>/</span>
          <a routerLink="/shop" class="hover:text-violet-600 transition-colors duration-300">Shop</a>
          <span>/</span>
          <a routerLink="/shop" [queryParams]="{ category: p.category }" class="hover:text-violet-600 transition-colors duration-300 capitalize">{{ categoryName() }}</a>
          <span>/</span>
          <span class="text-slate-600 font-medium truncate max-w-[16rem]">{{ p.name }}</span>
        </nav>

        <!-- ══ Main section ══ -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <!-- Gallery -->
          <div>
            <div class="card overflow-hidden aspect-square flex items-center justify-center p-6 bg-slate-50">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-scale-down mix-blend-multiply transition-opacity duration-300 p-4" />
            </div>
            <div class="mt-4 grid grid-cols-4 gap-3">
              @for (image of p.images; track image; let i = $index) {
                <button
                  type="button"
                  (click)="activeIndex.set(i)"
                  [attr.aria-label]="'View image ' + (i + 1)"
                  class="aspect-square rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-300 bg-slate-50 p-2 flex items-center justify-center"
                  [class]="activeIndex() === i ? 'ring-violet-600' : 'ring-transparent hover:ring-slate-300'">
                  <img [src]="image" [alt]="p.name + ' thumbnail ' + (i + 1)" class="h-full w-full object-scale-down mix-blend-multiply" />
                </button>
              }
            </div>
          </div>

          <!-- Buy panel -->
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              @if (p.isNew) {
                <span class="badge bg-violet-100 text-violet-700">New</span>
              }
              @if (discountPercent() > 0) {
                <span class="badge bg-rose-100 text-rose-600">Save {{ discountPercent() }}%</span>
              }
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{{ p.name }}</h1>

            <button type="button" (click)="activeTab.set('reviews'); scrollToTabs()" class="mt-3 flex items-center gap-2 w-fit group">
              <app-star-rating [rating]="averageRating()" size="md" />
              <span class="text-sm font-semibold text-slate-700">{{ averageRating() }}</span>
              <span class="text-sm text-slate-400 group-hover:text-violet-600 underline-offset-2 group-hover:underline transition-colors duration-300">
                {{ reviews().length }} reviews
              </span>
            </button>

            <div class="mt-5 flex items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-extrabold text-slate-900">{{ p.price | currency }}</span>
              @if (p.originalPrice) {
                <span class="text-lg text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
              }
            </div>

            <p class="mt-4 text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

            <!-- Stock indicator -->
            <div class="mt-4">
              @if (p.stock === 0) {
                <span class="badge bg-slate-100 text-slate-600">Out of stock</span>
              } @else if (p.stock <= 15) {
                <span class="badge bg-amber-100 text-amber-700 animate-pulse">Only {{ p.stock }} left in stock</span>
              } @else {
                <span class="badge bg-emerald-100 text-emerald-700">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  In stock, ready to ship
                </span>
              }
            </div>

            <!-- Color swatches -->
            @if (p.colors.length) {
              <div class="mt-6">
                <span class="text-sm font-semibold text-slate-900">
                  Color: <span class="font-normal text-slate-500">{{ selectedColor() }}</span>
                </span>
                <div class="mt-3 flex gap-3">
                  @for (color of (p.colors || []); track color.name) {
                    <button
                      type="button"
                       (click)="selectColor(color.name)"
                      [attr.aria-label]="'Select color ' + color.name"
                      [attr.aria-pressed]="selectedColor() === color.name"
                      class="h-10 w-10 rounded-full ring-2 ring-offset-2 transition-all duration-300 border border-slate-200"
                      [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                      [style.background-color]="color.hex"></button>
                  }
                </div>
              </div>
            }

            <!-- Size pills -->
            @if (p.sizes.length) {
              <div class="mt-6">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-900">Size: <span class="font-normal text-slate-500">{{ selectedSize() || 'Select a size' }}</span></span>
                  <button type="button" class="text-xs font-medium text-violet-600 hover:text-violet-500 underline underline-offset-2 transition-colors duration-300">Size guide</button>
                </div>
                <div class="mt-3 flex flex-wrap gap-2.5">
                  @for (size of p.sizes; track size) {
                    <button
                      type="button"
                       (click)="selectSize(size)"
                      [attr.aria-pressed]="selectedSize() === size"
                      class="min-w-[3rem] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300"
                      [class]="selectedSize() === size
                        ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'">
                      {{ size }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Quantity + CTAs -->
            @if (p.isAvailableForRent) {
              <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Purchase type">
                  <button type="button" (click)="purchaseType.set('Purchase')" [attr.aria-checked]="purchaseType() === 'Purchase'" role="radio"
                          class="rounded-xl px-3 py-2 text-sm font-semibold" [class]="purchaseType() === 'Purchase' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'">Buy</button>
                  <button type="button" (click)="purchaseType.set('Rental')" [attr.aria-checked]="purchaseType() === 'Rental'" role="radio"
                          class="rounded-xl px-3 py-2 text-sm font-semibold" [class]="purchaseType() === 'Rental' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'">Rent</button>
                </div>
                @if (purchaseType() === 'Rental') {
                  <div class="mt-3 grid grid-cols-2 gap-3">
                    <label class="text-xs font-semibold text-slate-600">Start date<input type="date" [value]="rentalStartDate()" (change)="rentalStartDate.set($any($event.target).value)" class="input-field mt-1" /></label>
                    <label class="text-xs font-semibold text-slate-600">End date<input type="date" [value]="rentalEndDate()" (change)="rentalEndDate.set($any($event.target).value)" class="input-field mt-1" /></label>
                  </div>
                }
              </div>
            }

            <!-- Quantity + CTAs -->
            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
                <button type="button" (click)="decrement()" [disabled]="quantity() <= 1" aria-label="Decrease quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                </button>
                <span class="w-12 text-center text-base font-bold text-slate-900" aria-live="polite">{{ quantity() }}</span>
                 <button type="button" (click)="increment()" [disabled]="quantity() >= selectedStock()" aria-label="Increase quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

               <button type="button" (click)="addToCart()" [disabled]="selectedStock() === 0" class="btn-primary flex-1 py-3.5 text-base gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                 {{ selectedStock() === 0 ? 'Out of stock' : 'Add to Cart — ' + (selectedPrice() * quantity() | currency) }}
              </button>

              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="h-[3.25rem] w-[3.25rem] rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0"
                [class]="inWishlist()
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200'">
                <svg class="w-6 h-6" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <!-- Trust rows -->
            <div class="mt-8 card divide-y divide-slate-100">
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free delivery</span> on orders over $75 · arrives in 2–4 business days</p>
              </div>
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free 30-day returns</span> — no questions asked</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ Tabs ══ -->
        <div class="mt-14" id="product-tabs">
          <div class="border-b border-slate-200 flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Product information">
            @for (tab of tabs; track tab.key) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === tab.key"
                (click)="activeTab.set(tab.key)"
                class="relative px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300"
                [class]="activeTab() === tab.key ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'">
                {{ tab.label }}
                @if (tab.key === 'reviews') {
                  <span class="ms-1.5 badge bg-slate-100 text-slate-500">{{ reviews().length }}</span>
                }
                @if (activeTab() === tab.key) {
                  <span class="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-violet-600"></span>
                }
              </button>
            }
          </div>

          <div class="py-8">
            @switch (activeTab()) {
              <!-- Description -->
              @case ('description') {
                <div class="grid lg:grid-cols-5 gap-10">
                  <div class="lg:col-span-3">
                    <h2 class="text-lg font-bold text-slate-900 mb-4">About this product</h2>
                    <p class="text-slate-600 leading-relaxed">{{ p.description }}</p>
                  </div>
                  <div class="lg:col-span-2">
                    <h3 class="text-lg font-bold text-slate-900 mb-4">Highlights</h3>
                    <ul class="space-y-3">
                      @for (feature of (p.features || []); track feature) {
                        <li class="flex items-start gap-3">
                          <span class="mt-0.5 h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                            <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                          <span class="text-sm text-slate-600 leading-relaxed">{{ feature }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <!-- Specifications -->
              @case ('specs') {
                <div class="card overflow-hidden max-w-3xl">
                  <table class="w-full text-sm">
                    <tbody>
                      @for (spec of (p.specs || []); track spec.label; let even = $even) {
                        <tr [class]="even ? 'bg-slate-50/70' : 'bg-white'">
                          <th scope="row" class="text-start font-semibold text-slate-700 px-6 py-3.5 w-1/3">{{ spec.label }}</th>
                          <td class="text-slate-600 px-6 py-3.5">{{ spec.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Reviews -->
              @case ('reviews') {
                <div class="grid lg:grid-cols-3 gap-10">
                  <!-- Ratings summary -->
                  <div class="lg:col-span-1">
                    <div class="card p-6 lg:sticky lg:top-24">
                      <div class="flex items-end gap-3">
                        <span class="text-5xl font-extrabold text-slate-900 leading-none">{{ averageRating() }}</span>
                        <div class="pb-1">
                          <app-star-rating [rating]="averageRating()" size="md" />
                          <p class="mt-1 text-xs text-slate-400">Based on {{ reviews().length }} reviews</p>
                        </div>
                      </div>

                      <!-- Star distribution -->
                      <div class="mt-6 space-y-2.5">
                        @for (bucket of ratingBuckets(); track bucket.stars) {
                          <div class="flex items-center gap-3">
                            <span class="text-xs font-medium text-slate-600 w-10 shrink-0">{{ bucket.stars }} star</span>
                            <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" [style.width.%]="bucket.percent"></div>
                            </div>
                            <span class="text-xs text-slate-400 w-9 text-end shrink-0">{{ bucket.percent }}%</span>
                          </div>
                        }
                      </div>

                      @if (authService.isAuthenticated()) {
                        <div class="mt-8 border-t border-slate-100 pt-6">
                          <h3 class="font-bold text-sm mb-3">Write a Review</h3>
                          <div class="flex items-center gap-1 mb-4">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button type="button" (click)="newReviewRating.set(star)" class="text-2xl transition-colors" [class]="star <= newReviewRating() ? 'text-amber-400' : 'text-slate-200'">★</button>
                            }
                          </div>
                          <textarea [(ngModel)]="newReviewComment" rows="3" class="w-full rounded-xl border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500 mb-3" placeholder="Share your thoughts..."></textarea>
                          <button type="button" (click)="submitReview()" [disabled]="isSubmittingReview()" class="btn-primary w-full disabled:opacity-50">Submit Review</button>
                        </div>
                      } @else {
                        <button type="button" routerLink="/login" class="btn-primary w-full mt-6">Log in to Review</button>
                      }
                    </div>
                  </div>

                  <!-- Review cards -->
                  <div class="lg:col-span-2 space-y-5">
                    @if (reviews().length === 0) {
                      <app-empty-state
                        icon="reviews"
                        title="No reviews yet"
                        message="Be the first to share your experience with this product — your review helps other shoppers decide." />
                    }
                    @for (review of reviews(); track review.id) {
                      <article class="card p-6">
                        @if (isEditingReview() === review.id) {
                          <div class="flex items-center gap-1 mb-4">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button type="button" (click)="editReviewRating.set(star)" class="text-2xl transition-colors" [class]="star <= editReviewRating() ? 'text-amber-400' : 'text-slate-200'">★</button>
                            }
                          </div>
                          <textarea [(ngModel)]="editReviewComment" rows="3" class="w-full rounded-xl border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500 mb-3"></textarea>
                          <div class="flex gap-2">
                            <button type="button" (click)="saveEdit()" class="btn-primary flex-1 py-2 text-sm">Save</button>
                            <button type="button" (click)="cancelEdit()" class="px-4 py-2 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                          </div>
                        } @else {
                          <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-3">
                              <span class="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                {{ review.initials }}
                              </span>
                              <div>
                                <p class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                  {{ review.author }}
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">{{ review.date }}</p>
                              </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                              <app-star-rating [rating]="review.rating" size="sm" />
                              <div class="flex items-center gap-2">
                                @if (review.isAuthor) {
                                  <button type="button" (click)="startEdit(review)" class="text-xs text-violet-600 font-medium hover:underline">Edit</button>
                                }
                                @if (review.isAuthor || isAdmin()) {
                                  <button type="button" (click)="deleteReview(review.id)" class="text-xs text-rose-500 font-medium hover:underline">Delete</button>
                                }
                              </div>
                            </div>
                          </div>
                          @if (review.title) {
                            <h3 class="mt-4 text-sm font-bold text-slate-900">{{ review.title }}</h3>
                          }
                          <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ review.comment }}</p>
                        }
                      </article>
                    }
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <!-- ══ Related products ══ -->
        <section class="mt-10">
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-6">You might also like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (related of relatedProducts(); track related.id) {
              <app-product-card [product]="related" layout="grid" />
            }
          </div>
        </section>
      </div>
    } @else {
      <!-- Product not found -->
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="search"
            title="Product not found"
            message="The product you're looking for may have been removed or the link is incorrect."
            ctaLabel="Back to Shop"
            ctaLink="/shop" />
        </div>
      </div>
    }

    <!-- Confirmation Modal -->
    @if (confirmDeleteReviewId()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Review</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this review?
              <br>This action cannot be undone.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeDeleteReview()" 
                      class="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent implements OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  readonly product = signal<Product | undefined>(undefined);
  readonly confirmDeleteReviewId = signal<string | number | null>(null);
  readonly activeIndex = signal(0);
  readonly selectedColor = signal('');
  readonly selectedSize = signal('');
  readonly selectedVariantId = signal<string | undefined>(undefined);
  readonly quantity = signal(1);
  readonly purchaseType = signal<'Purchase' | 'Rental'>('Purchase');
  readonly rentalStartDate = signal('');
  readonly rentalEndDate = signal('');
  readonly activeTab = signal<Tab>('description');
  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly relatedProducts = signal<Product[]>([]);

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: 'Customer Reviews' },
  ];

  readonly activeImage = computed(() => {
    const p = this.product();
    return p && p.images && p.images.length ? p.images[Math.min(this.activeIndex(), p.images.length - 1)] : '';
  });

  readonly selectedVariant = computed(() => this.product()?.variants?.find(v => v.id === this.selectedVariantId()));
  readonly selectedStock = computed(() => this.selectedVariant()?.stockQuantity ?? this.product()?.stock ?? 0);
  readonly selectedPrice = computed(() => this.purchaseType() === 'Rental'
    ? (this.selectedVariant()?.rentalPricePerDay ?? this.product()?.rentalPricePerDay ?? this.selectedVariant()?.price ?? this.product()?.price ?? 0)
    : (this.selectedVariant()?.price ?? this.product()?.price ?? 0));

  readonly inWishlist = computed(() => {
    const p = this.product();
    return !!p && this.wishlist.ids().includes(p.id);
  });

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p?.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  readonly categoryName = computed(() => {
    const p = this.product();
    const cats = this.categories();
    return p
      ? cats.find(c => c.slug === p.category)?.name ?? p.category
      : '';
  });

  private readonly reviewService = inject(ReviewService);
  readonly authService = inject(AuthService);

  readonly reviews = signal<Review[]>([]);
  readonly isSubmittingReview = signal(false);
  readonly newReviewRating = signal(5);
  readonly newReviewComment = signal('');
  
  readonly isEditingReview = signal<string | number | null>(null);

  readonly isAdmin = computed(() => {
    const roles = this.authService.user()?.roles || [];
    return roles.includes('Admin') || roles.includes('SuperAdmin');
  });
  readonly editReviewRating = signal(5);
  readonly editReviewComment = signal('');

  private hubConnection?: signalR.HubConnection;

  readonly ratingBuckets = computed(() => {
    const revs = this.reviews();
    const total = revs.length;
    return [5, 4, 3, 2, 1].map(stars => {
      const count = revs.filter(r => r.rating === stars).length;
      return {
        stars,
        count,
        percent: total ? Math.round((count / total) * 100) : 0
      };
    });
  });
  
  readonly averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / revs.length).toFixed(1));
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const slug = params.get('slug') ?? '';
      if (slug) {
        this.productService.getBySlug(slug).subscribe(product => {
          this.product.set(product);
          this.activeIndex.set(0);
           this.quantity.set(1);
           this.purchaseType.set('Purchase');
           this.rentalStartDate.set('');
           this.rentalEndDate.set('');
          this.activeTab.set('description');
           const firstVariant = product?.variants?.find(variant => variant.isActive);
           this.selectedColor.set(firstVariant?.color ?? '');
           this.selectedSize.set(firstVariant?.size ?? '');
           this.selectedVariantId.set(firstVariant?.id);
          window.scrollTo({ top: 0 });

          if (product) {
            this.titleService.setTitle(`${product.name} - Budgetha`);
            this.metaService.updateTag({ name: 'description', content: product.shortDescription || product.description.substring(0, 160) });
            this.metaService.updateTag({ property: 'og:title', content: product.name });
            this.metaService.updateTag({ property: 'og:description', content: product.shortDescription || product.description.substring(0, 160) });
            if (product.images?.length > 0) {
              this.metaService.updateTag({ property: 'og:image', content: product.images[0] });
            }

            this.productService.getRelated(product).subscribe(related => {
              this.relatedProducts.set(related);
            });
            this.reviewService.getReviews(product.id.toString()).subscribe(revs => {
              this.reviews.set(revs);
            });
            
            // Setup SignalR
            if (this.hubConnection) {
              this.hubConnection.stop();
            }
            this.hubConnection = new signalR.HubConnectionBuilder()
              .withUrl(`${environment.hubUrl}/reviews`, {
                accessTokenFactory: () => this.authService.getToken() || ''
              })
              .withAutomaticReconnect()
              .build();
              
            this.hubConnection.on('ReviewsUpdated', () => {
              this.reviewService.getReviews(product.id.toString()).subscribe(revs => {
                this.reviews.set(revs);
              });
            });
            
            this.hubConnection.start().then(() => {
              this.hubConnection?.invoke('JoinProductGroup', product.id.toString());
            }).catch(err => console.error('Error connecting to SignalR', err));

          } else {
             this.relatedProducts.set([]);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  increment(): void {
    const stock = this.selectedStock();
    this.quantity.update(q => Math.min(q + 1, stock));
  }

  decrement(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p || this.selectedStock() === 0) return;
    if (this.purchaseType() === 'Rental' && (!this.rentalStartDate() || !this.rentalEndDate())) {
      this.toastService.error('Select rental start and end dates first.');
      return;
    }
    if (this.purchaseType() === 'Rental' && this.rentalEndDate() <= this.rentalStartDate()) {
      this.toastService.error('Rental end date must be after the start date.');
      return;
    }
    this.cart.add(p, this.quantity(), this.selectedColor() || undefined, this.selectedSize() || undefined,
      this.purchaseType(), this.rentalStartDate() || undefined, this.rentalEndDate() || undefined,
      this.selectedVariantId());
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
    const variant = this.product()?.variants?.find(v => v.color === color && (!this.selectedSize() || v.size === this.selectedSize()))
      ?? this.product()?.variants?.find(v => v.color === color);
    if (variant) {
      this.selectedVariantId.set(variant.id);
      this.selectedSize.set(variant.size ?? '');
    }
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
    const variant = this.product()?.variants?.find(v => v.size === size && (!this.selectedColor() || v.color === this.selectedColor()))
      ?? this.product()?.variants?.find(v => v.size === size);
    if (variant) {
      this.selectedVariantId.set(variant.id);
      this.selectedColor.set(variant.color ?? '');
    }
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p.id, p.name);
  }

  scrollToTabs(): void {
    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
  }

  submitReview(): void {
    const p = this.product();
    if (!p) return;
    this.isSubmittingReview.set(true);
    this.reviewService.addReview({
      productId: p.id.toString(),
      rating: this.newReviewRating(),
      comment: this.newReviewComment()
    }).subscribe({
      next: () => {
        this.newReviewComment.set('');
        this.newReviewRating.set(5);
        this.isSubmittingReview.set(false);
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.isSubmittingReview.set(false)
    });
  }

  startEdit(review: Review): void {
    this.isEditingReview.set(review.id);
    this.editReviewRating.set(review.rating);
    this.editReviewComment.set(review.comment || '');
  }

  cancelEdit(): void {
    this.isEditingReview.set(null);
  }

  saveEdit(): void {
    const p = this.product();
    const id = this.isEditingReview();
    if (!p || !id) return;
    
    this.reviewService.updateReview(id.toString(), {
      reviewId: id.toString(),
      rating: this.editReviewRating(),
      comment: this.editReviewComment()
    }).subscribe({
      next: () => {
        this.isEditingReview.set(null);
        this.toastService.success('Review updated successfully.');
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.toastService.error('Failed to update review.')
    });
  }

  deleteReview(id: string | number): void {
    this.confirmDeleteReviewId.set(id);
  }

  closeConfirmModal(): void {
    this.confirmDeleteReviewId.set(null);
  }

  executeDeleteReview(): void {
    const id = this.confirmDeleteReviewId();
    if (!id) return;
    
    this.closeConfirmModal();

    const p = this.product();
    if (!p) return;
    
    this.reviewService.deleteReview(id.toString()).subscribe({
      next: () => {
        this.toastService.success('Review deleted successfully.');
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.toastService.error('Failed to delete review.')
    });
  }
}
