import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

export interface TransactionHistoryDto {
  orderId: string;
  orderNumber: string;
  date: string;
  type: string;
  totalAmount: number;
  status: string;
  customerName: string;
  items: TransactionItemDto[];
}

export interface TransactionItemDto {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-admin-logs',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Transaction Logs</h1>
          <p class="text-slate-500 mt-1">View your sales and purchase history</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div class="space-y-1.5 flex-1 min-w-[200px]">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction Type</label>
          <select [(ngModel)]="filterType" (change)="loadLogs()" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none">
            <option value="All">All Transactions</option>
            <option value="Sales">Sales Only</option>
            <option value="Purchases">Purchases Only</option>
          </select>
        </div>
        
        <div class="space-y-1.5 flex-1 min-w-[150px]">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">From Date</label>
          <input type="date" [(ngModel)]="startDate" (change)="loadLogs()" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none">
        </div>

        <div class="space-y-1.5 flex-1 min-w-[150px]">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
          <input type="date" [(ngModel)]="endDate" (change)="loadLogs()" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none">
        </div>

        <div class="flex gap-2">
          <button (click)="clearFilters()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors">
            Clear
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-teal-50 to-teal-100/50 p-6 rounded-2xl border border-teal-100">
          <p class="text-teal-600 font-semibold text-sm">Total Sales (Filtered)</p>
          <p class="text-3xl font-bold text-teal-900 mt-1">{{ totalSales() | currency }}</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-2xl border border-indigo-100">
          <p class="text-indigo-600 font-semibold text-sm">Total Purchases (Filtered)</p>
          <p class="text-3xl font-bold text-indigo-900 mt-1">{{ totalPurchases() | currency }}</p>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        @if (isLoading()) {
          <div class="p-10 flex justify-center">
            <div class="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
          </div>
        } @else if (logs().length === 0) {
          <div class="p-12 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900">No transactions found</h3>
            <p class="text-slate-500 mt-1">Try adjusting your filters.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Order ID</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-slate-700">
                @for (log of logs(); track log.orderId) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-6 py-4">{{ log.date | date:'MMM d, y, h:mm a' }}</td>
                    <td class="px-6 py-4 font-medium text-slate-900">{{ log.orderNumber }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            [class.bg-teal-100]="log.type === 'Sale'" [class.text-teal-700]="log.type === 'Sale'"
                            [class.bg-indigo-100]="log.type === 'Purchase'" [class.text-indigo-700]="log.type === 'Purchase'">
                        {{ log.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 font-bold" [class.text-teal-600]="log.type === 'Sale'">
                      {{ log.type === 'Sale' ? '+' : '-' }}{{ log.totalAmount | currency }}
                    </td>
                    <td class="px-6 py-4">{{ log.customerName }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {{ log.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button (click)="toggleExpand(log.orderId)" class="text-teal-600 hover:text-teal-700 font-semibold text-xs transition-colors">
                        {{ expandedId() === log.orderId ? 'Hide' : 'View' }}
                      </button>
                    </td>
                  </tr>
                  
                  <!-- Expanded Details -->
                  @if (expandedId() === log.orderId) {
                    <tr>
                      <td colspan="7" class="bg-slate-50/50 p-6 border-b border-slate-100">
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Transaction Items</h4>
                        <div class="space-y-3">
                          @for (item of log.items; track item.productId) {
                            <div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm max-w-2xl">
                              <img [src]="item.productImage || 'assets/placeholder.png'" class="w-12 h-12 rounded-lg object-cover bg-slate-50" [alt]="item.productName">
                              <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-slate-900 truncate">{{ item.productName }}</p>
                                <p class="text-xs text-slate-500">Qty: {{ item.quantity }} × {{ item.price | currency }}</p>
                              </div>
                              <div class="text-right">
                                <p class="text-sm font-bold text-slate-900">{{ (item.quantity * item.price) | currency }}</p>
                              </div>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminLogsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  
  readonly logs = signal<TransactionHistoryDto[]>([]);
  readonly isLoading = signal(true);
  readonly expandedId = signal<string | null>(null);

  filterType = 'All';
  startDate = '';
  endDate = '';

  readonly totalSales = computed(() => {
    return this.logs().filter(l => l.type === 'Sale').reduce((sum, log) => sum + log.totalAmount, 0);
  });

  readonly totalPurchases = computed(() => {
    return this.logs().filter(l => l.type === 'Purchase').reduce((sum, log) => sum + log.totalAmount, 0);
  });

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading.set(true);
    let params = `?type=${this.filterType}`;
    if (this.startDate) params += `&startDate=${this.startDate}`;
    if (this.endDate) params += `&endDate=${this.endDate}`;

    // Assuming we add getTransactionHistory to adminService or we can use HttpClient directly.
    this.adminService.getTransactionHistory(this.filterType, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.logs.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.logs.set([]);
        this.isLoading.set(false);
      }
    });
  }

  clearFilters() {
    this.filterType = 'All';
    this.startDate = '';
    this.endDate = '';
    this.loadLogs();
  }

  toggleExpand(id: string) {
    this.expandedId.update(curr => curr === id ? null : id);
  }
}
