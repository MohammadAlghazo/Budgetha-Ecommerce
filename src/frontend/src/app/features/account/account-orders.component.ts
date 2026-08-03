import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-orders',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet, EmptyStateComponent],
  template: `
    <div class="card overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Order History</h2>
          <p class="text-sm text-slate-400 mt-0.5">{{ orders().length }} orders placed</p>
        </div>
      </div>

      @if (orders().length === 0) {
        <app-empty-state
          icon="orders"
          title="No orders found"
          message="You haven't placed any orders yet. When you do, they'll show up here with live status tracking."
          ctaLabel="Start Shopping"
          ctaLink="/shop" />
      } @else {
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-start text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                <th class="px-6 py-3.5">Order</th>
                <th class="px-6 py-3.5">Date</th>
                <th class="px-6 py-3.5">Items</th>
                <th class="px-6 py-3.5">Total</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-end">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (order of orders(); track order.id) {
                <tr class="hover:bg-violet-50/40 transition-colors duration-200">
                  <td class="px-6 py-4 font-bold text-slate-900">{{ order.number }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ order.date | date: 'MMM d, y' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex -space-x-2.5">
                      @for (item of order.items.slice(0, 3); track item.productId) {
                        <img [src]="item.image" [alt]="item.name" class="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                      }
                      @if (order.items.length > 3) {
                        <span class="h-9 w-9 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[11px] font-bold text-slate-500">
                          +{{ order.items.length - 3 }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-slate-900">{{ order.total | currency }}</td>
                  <td class="px-6 py-4">
                    <span class="badge" [class]="statusClasses(order.status)">
                      <span class="h-1.5 w-1.5 rounded-full" [class]="dotClasses(order.status)"></span>
                       {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-end">
                    <button
                      type="button"
                      (click)="toggleExpand(order.id)"
                      [attr.aria-expanded]="expandedId() === order.id"
                      class="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                      {{ expandedId() === order.id ? 'Hide' : 'View' }}
                    </button>
                  </td>
                </tr>
                @if (expandedId() === order.id) {
                  <tr>
                    <td colspan="6" class="bg-slate-50/60 px-6 py-5">
                      <ng-container *ngTemplateOutlet="orderDetail; context: { $implicit: order }"></ng-container>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden divide-y divide-slate-100">
          @for (order of orders(); track order.id) {
            <div class="p-5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-sm">{{ order.number }}</span>
                <span class="badge" [class]="statusClasses(order.status)">
                  <span class="h-1.5 w-1.5 rounded-full" [class]="dotClasses(order.status)"></span>
                  {{ order.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="text-slate-400">{{ order.date | date: 'MMM d, y' }}</span>
                <span class="font-bold text-slate-900">{{ order.total | currency }}</span>
              </div>
              <button
                type="button"
                (click)="toggleExpand(order.id)"
                class="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                {{ expandedId() === order.id ? 'Hide details' : 'View details' }}
              </button>
              @if (expandedId() === order.id) {
                <div class="mt-4">
                  <ng-container *ngTemplateOutlet="orderDetail; context: { $implicit: order }"></ng-container>
                </div>
              }
            </div>
          }
        </div>

        <!-- Shared order detail template -->
        <ng-template #orderDetail let-order>
          <div class="space-y-3">
            @for (item of order.items; track item.productId + (item.color ?? '')) {
              <div class="flex items-center gap-3.5">
                <img [src]="item.image" [alt]="item.name" class="h-14 w-14 rounded-xl object-cover bg-slate-100" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                  <p class="text-xs text-slate-400">
                    Qty {{ item.quantity }}{{ item.color ? ' · ' + item.color : '' }}{{ item.size ? ' · ' + item.size : '' }}
                  </p>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
              </div>
            }
             <div class="pt-3 border-t border-slate-200 grid sm:grid-cols-2 gap-3 text-xs text-slate-500">
               <p><span class="font-semibold text-slate-700">Ships to:</span> {{ order.shippingAddress }}</p>
               <p><span class="font-semibold text-slate-700">Payment:</span> {{ order.paymentSummary }}</p>
             </div>
             @if (order.fulfillments?.length) {
               <div class="pt-3 border-t border-slate-200 space-y-2">
                 <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Delivery tracking</p>
                 @for (fulfillment of order.fulfillments; track fulfillment.id) {
                   <div class="rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
                     <span class="font-semibold text-slate-700">{{ fulfillment.sellerName }}</span>
                     <span class="text-slate-500">{{ fulfillment.status }}{{ fulfillment.trackingNumber ? ' · ' + fulfillment.trackingNumber : '' }}</span>
                     @if (fulfillment.rejectionReason) {
                       <span class="basis-full text-rose-600">Reason: {{ fulfillment.rejectionReason }}</span>
                     }
                   </div>
                 }
               </div>
             }
             @if (order.status === 'Pending' || order.status === 'Processing') {
               <button type="button" class="btn-secondary text-sm text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300 me-3" (click)="cancelOrder(order.id)">Cancel Order</button>
             }
             @if (order.canConfirmReceipt) {
               <button type="button" class="btn-primary text-sm" (click)="confirmReceived(order.id)">I received my order</button>
             }
             @if (order.canReportNotReceived) {
               <button type="button" class="text-sm font-semibold text-rose-600 hover:text-rose-500" (click)="reportNotReceived(order.id)">I did not receive it</button>
             }
             @for (report of order.deliveryReports ?? []; track report.id) {
               @if (report.status === 'Open') {
                 <p class="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">Your delivery report is being reviewed by Budgetha support.</p>
               }
             }
          </div>
        </ng-template>
      }
    </div>
  `,
})
export class AccountOrdersComponent {
  private readonly orderService = inject(OrderService);

  readonly orders = this.orderService.orders;
  readonly expandedId = signal<string | null>(null);

  constructor() {
    this.orderService.refresh().subscribe();
  }

  toggleExpand(id: string): void {
    this.expandedId.update(current => (current === id ? null : id));
  }

  confirmReceived(orderId: string): void {
    if (!confirm('Confirm that you received this order?')) return;
    this.orderService.confirmReceived(orderId).subscribe();
  }

  cancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => this.orderService.refresh().subscribe(),
      error: () => alert('Failed to cancel the order. It may have already been processed.')
    });
  }

  reportNotReceived(orderId: string): void {
    const reason = prompt('Please explain what went wrong with delivery:')?.trim();
    if (!reason) return;
    this.orderService.reportNotReceived(orderId, reason).subscribe();
  }

  statusClasses(status: OrderStatus): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
      case 'Shipped':
        return 'bg-sky-50 text-sky-700 ring-1 ring-sky-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 ring-1 ring-rose-100';
      case 'Pending':
        return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
      case 'Refunded':
        return 'bg-violet-50 text-violet-700 ring-1 ring-violet-100';
      case 'Failed':
        return 'bg-rose-50 text-rose-600 ring-1 ring-rose-100';
      case 'PartiallyFulfilled':
        return 'bg-orange-50 text-orange-700 ring-1 ring-orange-100';
      default:
        return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
    }
  }

  dotClasses(status: OrderStatus): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500';
      case 'Shipped':
        return 'bg-sky-500';
      case 'Processing':
        return 'bg-amber-500 animate-pulse';
      case 'Cancelled':
        return 'bg-rose-500';
      case 'Pending':
        return 'bg-slate-500';
      case 'Refunded':
        return 'bg-violet-500';
      case 'Failed':
        return 'bg-rose-500';
      case 'PartiallyFulfilled':
        return 'bg-orange-500';
      default:
        return 'bg-slate-500';
    }
  }
}
