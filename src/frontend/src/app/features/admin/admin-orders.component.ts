import { Component, inject, signal, OnInit, computed } from '@angular/core';
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
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 whitespace-nowrap">Order ID</th>
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Total</th>
                  <th class="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                @for (order of filteredOrders(); track order.id) {
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
                            [class.bg-blue-100]="order.status === 1 || order.status === 2"
                            [class.text-blue-700]="order.status === 1 || order.status === 2"
                            [class.bg-indigo-100]="order.status === 3"
                            [class.text-indigo-700]="order.status === 3"
                            [class.bg-emerald-100]="order.status === 4"
                            [class.text-emerald-700]="order.status === 4"
                            [class.bg-rose-100]="order.status === 5"
                            [class.text-rose-700]="order.status === 5">
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right font-bold text-slate-900">
                      {{ order.totalAmount | currency }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <select (change)="updateStatus(order.id, $event)" [value]="order.status" class="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500">
                        <option [value]="0">Pending</option>
                        <option [value]="1">Processing</option>
                        <option [value]="2">Confirmed</option>
                        <option [value]="3">Shipped</option>
                        <option [value]="4">Delivered</option>
                        <option [value]="5">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  orders = signal<any[]>([]);
  isLoading = signal(true);
  
  statuses = ['All', 'Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  filterStatus = signal('All');

  filteredOrders = computed(() => {
    const statusStr = this.filterStatus();
    if (statusStr === 'All') return this.orders();
    const statusMap: Record<string, number> = {
      'Pending': 0, 'Processing': 1, 'Confirmed': 2, 'Shipped': 3, 'Delivered': 4, 'Cancelled': 5
    };
    return this.orders().filter(o => o.status === statusMap[statusStr]);
  });

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
    const map = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
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
}
