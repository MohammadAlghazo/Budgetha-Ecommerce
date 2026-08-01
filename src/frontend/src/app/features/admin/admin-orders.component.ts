import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe, CurrencyPipe, UpperCasePipe],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h2>
          <p class="text-sm text-slate-500 mt-1">View and manage all customer orders.</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 pb-4 overflow-x-auto no-scrollbar">
        @for (status of statuses; track status) {
          <button (click)="filterStatus.set(status)"
                  class="px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors"
                  [class.bg-slate-800]="filterStatus() === status"
                  [class.text-white]="filterStatus() === status"
                  [class.bg-slate-100]="filterStatus() !== status"
                  [class.text-slate-600]="filterStatus() !== status"
                  [class.hover:bg-slate-200]="filterStatus() !== status">
            {{ status }}
          </button>
        }
      </div>

      @if (isLoading()) {
        <div class="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg class="animate-spin w-8 h-8 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Loading orders...</p>
        </div>
      } @else if (filteredOrders().length === 0) {
        <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">No Orders Found</h3>
          <p class="text-slate-500 mt-1 max-w-sm mx-auto">There are no orders matching the selected status.</p>
        </div>
      } @else {
        <!-- Desktop Table -->
        <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-start text-sm">
              <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 whitespace-nowrap">Order ID</th>
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-end">Total</th>
                  <th class="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                @for (order of pagedOrders(); track order.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="font-mono font-medium text-indigo-600">#{{ order.id.substring(0, 8) | uppercase }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-semibold text-slate-900">{{ order.userName }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-slate-500">
                      {{ order.createdAt | date:'MMM d, y, h:mm a' }}
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full"
                             [class.bg-amber-100]="order.status === 'Pending'"
                             [class.text-amber-700]="order.status === 'Pending'"
                             [class.bg-blue-100]="order.status === 'Processing'"
                             [class.text-blue-700]="order.status === 'Processing'"
                             [class.bg-indigo-100]="order.status === 'Shipped'"
                             [class.text-indigo-700]="order.status === 'Shipped'"
                             [class.bg-emerald-100]="order.status === 'Delivered'"
                             [class.text-emerald-700]="order.status === 'Delivered'"
                             [class.bg-rose-100]="order.status === 'Cancelled' || order.status === 'Failed'"
                             [class.text-rose-700]="order.status === 'Cancelled' || order.status === 'Failed'">
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-end font-bold text-slate-900">
                      {{ order.totalAmount | currency }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                       @for (fulfillment of order.fulfillments ?? []; track fulfillment.id) {
                          <div class="flex items-center gap-1 text-xs">
                            <span class="text-slate-500">{{ fulfillment.sellerName }}: {{ fulfillment.status }}</span>
                            @if (fulfillment.canShip) {
                              <button type="button" (click)="shipOrder(order.id)" class="font-semibold text-indigo-600 hover:text-indigo-500">Ship</button>
                              <button type="button" (click)="rejectOrder(order.id)" class="font-semibold text-rose-600 hover:text-rose-500">Reject</button>
                       }
                       @for (report of order.deliveryReports ?? []; track report.id) {
                         <div class="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-800 text-start">
                           <p class="font-semibold">Delivery report: {{ report.status }}</p>
                           <p>{{ report.reason }}</p>
                           @if (report.status === 'Open' && isAdmin()) {
                             <button type="button" (click)="resolveReport(report.id, false)" class="mt-1 font-semibold text-teal-700">Resolve</button>
                             <button type="button" (click)="resolveReport(report.id, true)" class="mt-1 ms-2 font-semibold text-slate-600">Dismiss</button>
                           }
                         </div>
                       }
                          </div>
                        }
                       </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          @for (order of pagedOrders(); track order.id) {
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono font-medium text-indigo-600">#{{ order.id.substring(0, 8) | uppercase }}</span>
                <span class="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full"
                       [class.bg-amber-100]="order.status === 'Pending'"
                       [class.text-amber-700]="order.status === 'Pending'"
                        [class.bg-blue-100]="order.status === 'Processing'"
                        [class.text-blue-700]="order.status === 'Processing'"
                        [class.bg-indigo-100]="order.status === 'Shipped'"
                        [class.text-indigo-700]="order.status === 'Shipped'"
                        [class.bg-emerald-100]="order.status === 'Delivered'"
                        [class.text-emerald-700]="order.status === 'Delivered'"
                        [class.bg-rose-100]="order.status === 'Cancelled' || order.status === 'Failed'"
                        [class.text-rose-700]="order.status === 'Cancelled' || order.status === 'Failed'">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <div class="mb-3">
                <p class="font-semibold text-slate-900">{{ order.userName }}</p>
                <p class="text-xs text-slate-500">{{ order.createdAt | date:'MMM d, y, h:mm a' }}</p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <span class="font-bold text-slate-900">{{ order.totalAmount | currency }}</span>
                  <div class="flex flex-col items-end gap-1">
                    @for (fulfillment of order.fulfillments ?? []; track fulfillment.id) {
                      @if (fulfillment.canShip) {
                        <div class="flex items-center gap-2 text-xs">
                          <button type="button" (click)="shipOrder(order.id)" class="font-semibold text-indigo-600">Ship</button>
                          <button type="button" (click)="rejectOrder(order.id)" class="font-semibold text-rose-600">Reject</button>
                        </div>
                      }
                    }
                  </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between mt-4 bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm border border-slate-200">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing page <span class="font-medium">{{ currentPage() }}</span> of <span class="font-medium">{{ totalPages() }}</span>
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button (click)="currentPage.set(currentPage() - 1)" [disabled]="currentPage() === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
                  </button>
                  <button (click)="currentPage.set(currentPage() + 1)" [disabled]="currentPage() === totalPages()" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  orders = signal<any[]>([]);
  isLoading = signal(true);
  
  statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Failed', 'PartiallyFulfilled'];
  filterStatus = signal('All');
  currentPage = signal(1);
  pageSize = signal(10);
  isAdmin = computed(() => this.auth.user()?.roles?.some((role: string) => role === 'Admin' || role === 'SuperAdmin') ?? false);

  filteredOrders = computed(() => {
    const statusStr = this.filterStatus();
    if (statusStr === 'All') return this.orders();
    return this.orders().filter(o => o.status === statusStr);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredOrders().length / this.pageSize())));

  pagedOrders = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.filteredOrders().slice(startIndex, startIndex + this.pageSize());
  });

  // Reset page when filter changes
  constructor() {
    effect(() => {
      this.filterStatus(); // depend on filterStatus
      this.currentPage.set(1); // reset to page 1
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    // Note: To show buyer info, we should ideally have a specific GET /api/orders/all endpoint for Admin.
    // For now we assume GET /api/orders returns all if admin or there's a specialized endpoint.
    // Wait, let's just GET /api/orders and see if it works, or we may need to create an AdminOrders endpoint.
    this.http.get<any[]>(`${environment.apiUrl}/orders/all`).subscribe({
      next: (res) => {
        this.orders.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.error('Failed to load orders.');
        this.isLoading.set(false);
      }
    });
  }

  getStatusText(status: string): string {
    return status || 'Unknown';
  }

  shipOrder(orderId: string): void {
    const carrier = prompt('Carrier (optional):') ?? '';
    const trackingNumber = prompt('Tracking number (optional):') ?? '';
    this.http.post(`${environment.apiUrl}/orders/${orderId}/ship`, { carrier, trackingNumber }).subscribe({
      next: () => { this.toast.success('Shipment marked as shipped.'); this.loadOrders(); },
      error: () => this.toast.error('The shipment could not be updated.')
    });
  }

  rejectOrder(orderId: string): void {
    const reason = prompt('Why is this order being rejected?')?.trim();
    if (!reason) return;
    this.http.post(`${environment.apiUrl}/orders/${orderId}/reject`, { reason }).subscribe({
      next: () => { this.toast.success('Order fulfillment rejected.'); this.loadOrders(); },
      error: () => this.toast.error('The order could not be rejected.')
    });
  }

  resolveReport(reportId: string, dismiss: boolean): void {
    const note = prompt(dismiss ? 'Why is this report being dismissed?' : 'How was this report resolved?')?.trim();
    if (!note) return;
    this.http.post(`${environment.apiUrl}/orders/delivery-reports/${reportId}/resolve`, { dismiss, note }).subscribe({
      next: () => { this.toast.success('Delivery report updated.'); this.loadOrders(); },
      error: () => this.toast.error('The delivery report could not be updated.')
    });
  }

}
