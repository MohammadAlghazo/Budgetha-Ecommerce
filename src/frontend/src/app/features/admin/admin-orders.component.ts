import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

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
                            [class.bg-amber-100]="order.status === 0"
                            [class.text-amber-700]="order.status === 0"
                            [class.bg-blue-100]="order.status === 1"
                            [class.text-blue-700]="order.status === 1"
                            [class.bg-indigo-100]="order.status === 2"
                            [class.text-indigo-700]="order.status === 2"
                            [class.bg-emerald-100]="order.status === 3"
                            [class.text-emerald-700]="order.status === 3"
                            [class.bg-rose-100]="order.status === 4 || order.status === 6"
                            [class.text-rose-700]="order.status === 4 || order.status === 6">
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-end font-bold text-slate-900">
                      {{ order.totalAmount | currency }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                      <select (change)="updateStatus(order.id, $event)" [value]="order.status" class="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500">
                        <option [value]="0">Pending</option>
                        <option [value]="1">Processing</option>
                         <option [value]="2">Shipped</option>
                         <option [value]="3">Delivered</option>
                         <option [value]="4">Cancelled</option>
                         <option [value]="5">Refunded</option>
                       <option [value]="6">Failed</option>
                       </select>
                       @if (order.status !== 3 && order.status !== 4) {
                         <button type="button" (click)="cancelOrder(order.id)" class="text-xs font-semibold text-rose-600 hover:text-rose-500">Cancel</button>
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
                      [class.bg-amber-100]="order.status === 0"
                      [class.text-amber-700]="order.status === 0"
                       [class.bg-blue-100]="order.status === 1"
                       [class.text-blue-700]="order.status === 1"
                       [class.bg-indigo-100]="order.status === 2"
                       [class.text-indigo-700]="order.status === 2"
                       [class.bg-emerald-100]="order.status === 3"
                       [class.text-emerald-700]="order.status === 3"
                       [class.bg-rose-100]="order.status === 4 || order.status === 6"
                       [class.text-rose-700]="order.status === 4 || order.status === 6">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <div class="mb-3">
                <p class="font-semibold text-slate-900">{{ order.userName }}</p>
                <p class="text-xs text-slate-500">{{ order.createdAt | date:'MMM d, y, h:mm a' }}</p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <span class="font-bold text-slate-900">{{ order.totalAmount | currency }}</span>
                 <div class="flex items-center gap-2">
                 <select (change)="updateStatus(order.id, $event)" [value]="order.status" class="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500">
                  <option [value]="0">Pending</option>
                  <option [value]="1">Processing</option>
                   <option [value]="2">Shipped</option>
                   <option [value]="3">Delivered</option>
                   <option [value]="4">Cancelled</option>
                   <option [value]="5">Refunded</option>
                   <option [value]="6">Failed</option>
                 </select>
                 @if (order.status !== 3 && order.status !== 4) {
                   <button type="button" (click)="cancelOrder(order.id)" class="text-xs font-semibold text-rose-600">Cancel</button>
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

  orders = signal<any[]>([]);
  isLoading = signal(true);
  
  statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Failed'];
  filterStatus = signal('All');
  currentPage = signal(1);
  pageSize = signal(10);

  filteredOrders = computed(() => {
    const statusStr = this.filterStatus();
    if (statusStr === 'All') return this.orders();
    const statusMap: Record<string, number> = {
      'Pending': 0, 'Processing': 1, 'Shipped': 2, 'Delivered': 3, 'Cancelled': 4, 'Refunded': 5, 'Failed': 6
    };
    return this.orders().filter(o => o.status === statusMap[statusStr]);
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

  getStatusText(status: number): string {
    const map = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Failed'];
    return map[status] || 'Unknown';
  }

  updateStatus(orderId: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = parseInt(select.value, 10);
    
    this.http.put(`${environment.apiUrl}/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: () => {
        this.toast.success('Order status updated.');
        this.orders.update(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      },
      error: () => {
        this.toast.error('Failed to update order status.');
        this.loadOrders(); // reload to revert select
      }
    });
  }

  cancelOrder(orderId: string): void {
    this.http.post(`${environment.apiUrl}/orders/${orderId}/cancel`, {}).subscribe({
      next: () => {
        this.toast.success('Order cancelled.');
        this.loadOrders();
      },
      error: () => this.toast.error('Order could not be cancelled.')
    });
  }
}
