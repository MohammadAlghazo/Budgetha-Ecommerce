import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-success',
  imports: [CurrencyPipe, DatePipe, RouterLink, EmptyStateComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      @if (order(); as o) {
        <!-- Success header -->
        <div class="text-center">
          <div class="relative inline-flex mb-6">
            <div class="absolute inset-0 bg-emerald-300/50 rounded-full blur-2xl scale-125"></div>
            <div class="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-[pop_0.4s_ease-out]">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Order confirmed!</h1>
          <p class="mt-3 text-slate-500 leading-relaxed max-w-md mx-auto">
            Thank you for shopping with Budgetha. A confirmation email is on its way — your order is being prepared right now.
          </p>
          <div class="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-50 ring-1 ring-violet-100 px-5 py-2">
            <span class="text-sm text-slate-500">Order number</span>
            <span class="text-sm font-bold text-violet-700 tracking-wide">{{ o.number }}</span>
          </div>
        </div>

        <!-- Order details card -->
        <div class="card mt-10 overflow-hidden">
          <div class="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/60">
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Order date</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ o.date | date: 'MMMM d, y' }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Payment</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ o.paymentSummary }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Ships to</p>
              <p class="mt-1 text-sm font-bold text-slate-900 truncate">{{ o.shippingAddress }}</p>
            </div>
          </div>

          <ul class="divide-y divide-slate-100">
            @for (item of o.items; track item.productId + (item.color ?? '') + (item.size ?? '')) {
              <li class="flex items-center gap-4 px-6 py-4">
                <img [src]="item.image" [alt]="item.name" class="h-16 w-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Qty {{ item.quantity }}{{ item.color ? ' · ' + item.color : '' }}{{ item.size ? ' · ' + item.size : '' }}
                  </p>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
              </li>
            }
          </ul>

          <dl class="border-t border-slate-100 px-6 py-5 space-y-2.5 text-sm bg-slate-50/40">
            <div class="flex justify-between"><dt class="text-slate-500">Subtotal</dt><dd class="font-semibold text-slate-900">{{ o.subtotal | currency }}</dd></div>
            @if (o.discount > 0) {
              <div class="flex justify-between"><dt class="text-emerald-600">Discount</dt><dd class="font-semibold text-emerald-600">-{{ o.discount | currency }}</dd></div>
            }
            <div class="flex justify-between"><dt class="text-slate-500">Shipping</dt><dd class="font-semibold text-slate-900">{{ o.shipping === 0 ? 'Free' : (o.shipping | currency) }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Tax</dt><dd class="font-semibold text-slate-900">{{ o.tax | currency }}</dd></div>
            <div class="flex justify-between pt-3 border-t border-slate-200 text-base"><dt class="font-bold text-slate-900">Total</dt><dd class="font-extrabold text-slate-900">{{ o.total | currency }}</dd></div>
          </dl>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/account/orders" class="btn-secondary w-full sm:w-auto">Track My Orders</a>
          <a routerLink="/shop" class="btn-primary w-full sm:w-auto">Continue Shopping</a>
        </div>
      } @else {
        <div class="card">
          <app-empty-state
            icon="orders"
            title="Order not found"
            message="We couldn't find that order. It may belong to a different account or the link is incorrect."
            ctaLabel="View My Orders"
            ctaLink="/account/orders" />
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  `,
})
export class OrderSuccessComponent {
  private readonly orders = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  private readonly orderNumber = toSignal(
    this.route.paramMap.pipe(map(params => params.get('number') ?? '')),
    { initialValue: '' }
  );

  readonly order = computed(() => this.orders.getByNumber(this.orderNumber()));
}
