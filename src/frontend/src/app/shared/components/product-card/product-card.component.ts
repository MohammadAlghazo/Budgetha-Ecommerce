import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/shop.models';
import { CartService } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent],
  template: `
    @if (layout() === 'grid') {
      <!-- ── Grid card ── -->
      <article class="group card overflow-hidden hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div class="relative aspect-square overflow-hidden bg-slate-100">
          <a [routerLink]="['/products', product().slug]" class="block h-full p-4">
            <img
              [src]="product().images[0]"
              [alt]="product().name"
              loading="lazy"
              class="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" />
          </a>

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (discountPercent() > 0) {
              <span class="badge bg-rose-500 text-white shadow-sm">-{{ discountPercent() }}%</span>
            }
            @if (product().isNew) {
              <span class="badge bg-violet-600 text-white shadow-sm">New</span>
            }
            @if (product().stock === 0) {
              <span class="badge bg-slate-700 text-white shadow-sm">Sold out</span>
            }
            @if (product().approvalStatus && product().approvalStatus !== 'Approved') {
              <span class="badge" [class]="product().approvalStatus === 'Pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-rose-700 text-white shadow-sm'">
                {{ product().approvalStatus }}
              </span>
            }
          </div>

          <!-- Hover actions -->
          <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:translate-x-2 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-300">
            <button
              type="button"
              (click)="toggleWishlist()"
              [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
              class="icon-btn h-9 w-9 bg-white/95 shadow-md backdrop-blur"
              [class.text-rose-500]="inWishlist()">
              <svg class="w-4.5 h-4.5 w-[18px] h-[18px]" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="quickView()"
              aria-label="Quick view"
              class="icon-btn h-9 w-9 bg-white/95 shadow-md backdrop-blur">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Add to cart slide-up -->
          <div class="absolute inset-x-3 bottom-3 opacity-100 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300">
            <button
              type="button"
              (click)="addToCart()"
              [disabled]="product().stock === 0"
              class="w-full rounded-xl bg-slate-900/90 backdrop-blur text-white text-sm font-semibold py-2.5
                     hover:bg-violet-600 disabled:opacity-50 disabled:hover:bg-slate-900/90
                     transition-colors duration-300 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {{ product().stock === 0 ? 'Out of stock' : 'Add to cart' }}
            </button>
          </div>
        </div>

        <div class="p-4 flex flex-col flex-1">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ product().brand }}</span>
          <a [routerLink]="['/products', product().slug]" class="mt-1 font-semibold text-slate-900 leading-snug line-clamp-2 hover:text-violet-600 transition-colors duration-300">
            {{ product().name }}
          </a>
          <div class="mt-2 flex items-center gap-1.5">
            <app-star-rating [rating]="product().rating" size="sm" />
            <span class="text-xs text-slate-400">({{ product().reviewCount }})</span>
          </div>
          <div class="mt-auto pt-3 flex items-baseline gap-2">
            <span class="text-lg font-bold text-slate-900">{{ product().price | currency }}</span>
            @if (product().originalPrice) {
              <span class="text-sm text-slate-400 line-through">{{ product().originalPrice | currency }}</span>
            }
          </div>
        </div>
      </article>
    } @else {
      <!-- ── List card ── -->
      <article class="group card overflow-hidden hover:shadow-xl hover:shadow-violet-100/60 transition-all duration-300 flex flex-col sm:flex-row">
        <div class="relative sm:w-56 lg:w-64 shrink-0 aspect-square sm:aspect-auto overflow-hidden bg-slate-100">
          <a [routerLink]="['/products', product().slug]" class="block h-full p-4">
            <img
              [src]="product().images[0]"
              [alt]="product().name"
              loading="lazy"
              class="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" />
          </a>
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (discountPercent() > 0) {
              <span class="badge bg-rose-500 text-white shadow-sm">-{{ discountPercent() }}%</span>
            }
            @if (product().isNew) {
              <span class="badge bg-violet-600 text-white shadow-sm">New</span>
            }
            @if (product().approvalStatus && product().approvalStatus !== 'Approved') {
              <span class="badge" [class]="product().approvalStatus === 'Pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-rose-700 text-white shadow-sm'">
                {{ product().approvalStatus }}
              </span>
            }
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ product().brand }}</span>
          <a [routerLink]="['/products', product().slug]" class="mt-1 text-lg font-semibold text-slate-900 leading-snug hover:text-violet-600 transition-colors duration-300">
            {{ product().name }}
          </a>
          <div class="mt-2 flex items-center gap-1.5">
            <app-star-rating [rating]="product().rating" size="sm" />
            <span class="text-xs text-slate-400">{{ product().rating }} ({{ product().reviewCount }} reviews)</span>
          </div>
          <p class="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">{{ product().shortDescription }}</p>

          <div class="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-slate-900">{{ product().price | currency }}</span>
              @if (product().originalPrice) {
                <span class="text-sm text-slate-400 line-through">{{ product().originalPrice | currency }}</span>
              }
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="icon-btn h-10 w-10 border border-slate-200"
                [class.text-rose-500]="inWishlist()">
                <svg class="w-[18px] h-[18px]" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button
                type="button"
                (click)="addToCart()"
                [disabled]="product().stock === 0"
                class="btn-primary px-5 py-2.5">
                {{ product().stock === 0 ? 'Out of stock' : 'Add to cart' }}
              </button>
            </div>
          </div>
        </div>
      </article>
    }
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly layout = input<'grid' | 'list'>('grid');

  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly quickViewService = inject(QuickViewService);

  readonly inWishlist = computed(() => this.wishlist.ids().includes(this.product().id));
  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  addToCart(): void {
    const p = this.product();
    this.cart.add(p, 1, p.colors[0]?.name, p.sizes[0]);
  }

  toggleWishlist(): void {
    this.wishlist.toggle(this.product().id, this.product().name);
  }

  quickView(): void {
    this.quickViewService.open(this.product());
  }
}
