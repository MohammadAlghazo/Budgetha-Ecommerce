import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/shop.models';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe],
  template: `
    @if (cart.drawerOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        (click)="cart.closeDrawer()"
        aria-hidden="true"></div>

      <!-- Drawer panel -->
      <aside
        class="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            Your Cart
            @if (cart.count() > 0) {
              <span class="badge bg-violet-100 text-violet-700">{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }}</span>
            }
          </h2>
          <button type="button" (click)="cart.closeDrawer()" aria-label="Close cart" class="icon-btn h-9 w-9 bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (cart.items().length === 0) {
          <!-- Empty state -->
          <div class="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-violet-200/60 rounded-full blur-2xl scale-110"></div>
              <div class="relative w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-50 rounded-full flex items-center justify-center ring-1 ring-violet-100">
                <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Your cart is empty</h3>
            <p class="mt-2 text-sm text-slate-500 leading-relaxed">Looks like you haven't added anything yet. Discover deals waiting for you.</p>
            <button type="button" (click)="goTo('/shop')" class="btn-primary mt-6">Start Shopping</button>
          </div>
        } @else {
          <!-- Free shipping progress -->
          @if (cart.amountToFreeShipping() > 0) {
            <div class="px-5 pt-4">
              <p class="text-xs text-slate-500 mb-2">
                You're <span class="font-semibold text-violet-700">{{ cart.amountToFreeShipping() | currency }}</span> away from <span class="font-semibold">free shipping</span>
              </p>
              <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" [style.width.%]="shippingProgress()"></div>
              </div>
            </div>
          } @else {
            <div class="px-5 pt-4">
              <p class="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Congratulations — your order ships free!
              </p>
            </div>
          }

          <!-- Items -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            @for (item of cart.items(); track trackItem(item)) {
              <div class="flex gap-4 group">
                <img [src]="item.image" [alt]="item.name" class="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                      <p class="mt-0.5 text-xs text-slate-400">
                        {{ item.color }}{{ item.color && item.size ? ' · ' : '' }}{{ item.size }}
                      </p>
                    </div>
                    <button
                      type="button"
                      (click)="cart.remove(item)"
                      [attr.aria-label]="'Remove ' + item.name"
                      class="icon-btn h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <div class="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
                      <button type="button" (click)="cart.updateQuantity(item, item.quantity - 1)" [attr.aria-label]="'Decrease quantity of ' + item.name" class="qty-btn h-7 w-7">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                      </button>
                      <span class="w-8 text-center text-sm font-semibold text-slate-900">{{ item.quantity }}</span>
                      <button type="button" (click)="cart.updateQuantity(item, item.quantity + 1)" [disabled]="item.quantity >= item.stock" [attr.aria-label]="'Increase quantity of ' + item.name" class="qty-btn h-7 w-7">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>
                    <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/60">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Subtotal</span>
              <span class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</span>
            </div>
            @if (cart.discount() > 0) {
              <div class="flex justify-between text-sm">
                <span class="text-emerald-600">Discount ({{ cart.promo()?.code }})</span>
                <span class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</span>
              </div>
            }
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Shipping</span>
              <span class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
              </span>
            </div>
            <div class="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{{ cart.total() | currency }}</span>
            </div>
            <p class="text-[11px] text-slate-400">Tax included: {{ cart.tax() | currency }}. Shipping calculated at checkout.</p>
            <div class="grid grid-cols-2 gap-3 pt-1">
              <button type="button" (click)="goTo('/cart')" class="btn-secondary py-3">View Cart</button>
              <button type="button" (click)="goTo('/checkout')" class="btn-primary py-3">Checkout</button>
            </div>
          </div>
        }
      </aside>
    }
  `,
  styles: `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  `,
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  trackItem(item: CartItem): string {
    return `${item.productId}-${item.color ?? ''}-${item.size ?? ''}`;
  }

  shippingProgress(): number {
    const subtotal = this.cart.subtotal() - this.cart.discount();
    return Math.min(100, (subtotal / 75) * 100);
  }

  goTo(path: string): void {
    this.cart.closeDrawer();
    this.router.navigate([path]);
  }
}
