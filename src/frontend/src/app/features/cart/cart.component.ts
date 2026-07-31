import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, FormsModule, EmptyStateComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>

      @if (cart.items().length === 0) {
        <div class="card mt-8 max-w-2xl mx-auto">
          <app-empty-state
            icon="cart"
            title="Your cart is empty"
            message="Looks like you haven't added anything to your cart yet. Explore our catalog and find something you'll love."
            ctaLabel="Start Shopping"
            ctaLink="/shop" />
        </div>
      } @else {
        <div class="mt-8 grid lg:grid-cols-3 gap-8 items-start">
          <!-- ══ Item list ══ -->
          <div class="lg:col-span-2 card divide-y divide-slate-100">
            <div class="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span class="col-span-6">Product</span>
              <span class="col-span-3 text-center">Quantity</span>
              <span class="col-span-2 text-right">Subtotal</span>
              <span class="col-span-1"></span>
            </div>

            @for (item of cart.items(); track trackItem(item)) {
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-5 items-center">
                <!-- Product -->
                <div class="col-span-12 sm:col-span-6 flex items-center gap-4">
                  <a [routerLink]="['/products', item.slug]" class="shrink-0">
                    <img [src]="item.image" [alt]="item.name" class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-contain mix-blend-multiply bg-slate-100 p-2" />
                  </a>
                  <div class="min-w-0">
                    <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ item.brand }}</span>
                    <a [routerLink]="['/products', item.slug]" class="block text-sm font-semibold text-slate-900 hover:text-violet-600 transition-colors duration-300 leading-snug">
                      {{ item.name }}
                    </a>
                    @if (item.color || item.size) {
                      <p class="mt-1 text-xs text-slate-400">
                        {{ item.color }}{{ item.color && item.size ? ' · Size ' : item.size ? 'Size ' : '' }}{{ item.size }}
                      </p>
                    }
                    <p class="mt-1 text-sm font-bold text-slate-700 sm:hidden">{{ item.price | currency }}</p>
                    <p class="hidden sm:block mt-1 text-sm text-slate-500">{{ item.price | currency }} each</p>
                  </div>
                </div>

                <!-- Quantity -->
                <div class="col-span-7 sm:col-span-3 flex sm:justify-center">
                  <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button type="button" (click)="cart.updateQuantity(item, item.quantity - 1)" [attr.aria-label]="'Decrease quantity of ' + item.name" class="qty-btn h-8 w-8">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                    </button>
                    <span class="w-10 text-center text-sm font-bold text-slate-900" aria-live="polite">{{ item.quantity }}</span>
                    <button type="button" (click)="cart.updateQuantity(item, item.quantity + 1)" [disabled]="item.quantity >= item.stock" [attr.aria-label]="'Increase quantity of ' + item.name" class="qty-btn h-8 w-8">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                </div>

                <!-- Subtotal -->
                <div class="col-span-4 sm:col-span-2 text-right">
                  <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
                </div>

                <!-- Remove -->
                <div class="col-span-1 flex justify-end">
                  <button
                    type="button"
                    (click)="cart.remove(item)"
                    [attr.aria-label]="'Remove ' + item.name + ' from cart'"
                    class="icon-btn h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50">
                    <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            }

            <div class="px-6 py-4 flex items-center justify-between">
              <a routerLink="/shop" class="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue shopping
              </a>
              <button type="button" (click)="cart.clear()" class="text-sm font-medium text-slate-400 hover:text-rose-500 transition-colors duration-300">
                Clear cart
              </button>
            </div>
          </div>

          <!-- ══ Order summary ══ -->
          <aside class="card p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

            <!-- Promo code -->
            <div class="mt-5">
              @if (cart.promo(); as promo) {
                <div class="flex items-center justify-between rounded-xl bg-emerald-50 ring-1 ring-emerald-100 px-4 py-3">
                  <div>
                    <p class="text-sm font-bold text-emerald-700">{{ promo.code }}</p>
                    <p class="text-xs text-emerald-600">{{ promo.description }}</p>
                  </div>
                  <button type="button" (click)="cart.removePromo()" aria-label="Remove promo code" class="icon-btn h-8 w-8 text-emerald-500 hover:text-rose-500 hover:bg-rose-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              } @else {
                <form (submit)="applyPromo($event)" class="flex gap-2">
                  <input
                    type="text"
                    name="promo"
                    [(ngModel)]="promoInput"
                    placeholder="Promo code"
                    aria-label="Promo code"
                    class="input-field py-2.5 uppercase placeholder:normal-case"
                    [class.input-error]="promoError()" />
                  <button type="submit" class="btn-secondary px-4 py-2.5 whitespace-nowrap">Apply</button>
                </form>
                @if (promoError()) {
                  <p class="mt-1.5 text-xs text-red-500">That code isn't valid. Try WELCOME10 or SAVE20.</p>
                }
              }
            </div>

            <!-- Totals -->
            <dl class="mt-6 space-y-3.5 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Subtotal ({{ cart.count() }} items)</dt>
                <dd class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</dd>
              </div>
              @if (cart.discount() > 0) {
                <div class="flex justify-between">
                  <dt class="text-emerald-600">Discount</dt>
                  <dd class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</dd>
                </div>
              }
              <div class="flex justify-between">
                <dt class="text-slate-500">Shipping</dt>
                <dd class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                  {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Estimated tax</dt>
                <dd class="font-semibold text-slate-900">{{ cart.tax() | currency }}</dd>
              </div>
              <div class="flex justify-between border-t border-slate-100 pt-4 text-base">
                <dt class="font-bold text-slate-900">Total</dt>
                <dd class="font-extrabold text-slate-900">{{ cart.total() | currency }}</dd>
              </div>
            </dl>

            <a routerLink="/checkout" class="btn-primary w-full mt-6 py-4 text-base">
              Proceed to Checkout
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Secure 256-bit SSL encrypted checkout
            </div>
          </aside>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  readonly cart = inject(CartService);

  promoInput = '';
  readonly promoError = signal(false);

  trackItem(item: CartItem): string {
    return `${item.productId}-${item.color ?? ''}-${item.size ?? ''}`;
  }

  applyPromo(event: Event): void {
    event.preventDefault();
    if (!this.promoInput.trim()) return;
    const ok = this.cart.applyPromo(this.promoInput);
    this.promoError.set(!ok);
    if (ok) this.promoInput = '';
  }
}
