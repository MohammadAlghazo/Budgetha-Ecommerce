import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { DatePipe } from '@angular/common';

interface SellerRequest {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  status: string;
  reason: string;
  created: string;
}

@Component({
  selector: 'app-admin-seller-requests',
  imports: [DatePipe],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Seller Requests</h2>
        <p class="mt-1 text-sm text-slate-500">
          Manage applications from users wanting to become sellers.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/50 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Reason</th>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading requests...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (req of requests(); track req.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900">{{ req.fullName }}</p>
                    <p class="text-xs text-slate-500">{{ req.email }}</p>
                  </td>
                  <td class="px-6 py-4 max-w-xs truncate" [title]="req.reason">
                    {{ req.reason || 'No reason provided' }}
                  </td>
                  <td class="px-6 py-4 text-slate-500">
                    {{ req.created | date:'MMM d, y' }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full"
                          [class.bg-amber-100]="req.status === 'Pending'"
                          [class.text-amber-700]="req.status === 'Pending'"
                          [class.bg-emerald-100]="req.status === 'Approved'"
                          [class.text-emerald-700]="req.status === 'Approved'"
                          [class.bg-rose-100]="req.status === 'Rejected'"
                          [class.text-rose-700]="req.status === 'Rejected'">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (req.status === 'Pending') {
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="approve(req.id)" [disabled]="isProcessing()" class="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50">Approve</button>
                        <button (click)="reject(req.id)" [disabled]="isProcessing()" class="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50">Reject</button>
                      </div>
                    } @else {
                      <span class="text-xs text-slate-400 font-medium italic">Processed</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                    <div class="flex flex-col items-center justify-center">
                      <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                      <p class="font-medium text-slate-600">No requests found</p>
                      <p class="text-sm">There are currently no seller requests to review.</p>
                    </div>
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminSellerRequestsComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  requests = signal<SellerRequest[]>([]);
  isProcessing = signal(false);
  isLoading = signal(true);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading.set(true);
    this.http.get<any>(`${environment.apiUrl}/sellerrequests`).subscribe({
      next: (res) => {
        this.requests.set(res.items || res || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load seller requests:', err);
        this.isLoading.set(false);
        this.requests.set([]);
      }
    });
  }

  approve(id: string) {
    this.isProcessing.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests/${id}/approve`, {}).subscribe({
      next: () => {
        this.toast.success('Request approved successfully. The user is now a Seller.');
        this.loadRequests();
        this.isProcessing.set(false);
      },
      error: () => {
        this.toast.error('Failed to approve request.');
        this.isProcessing.set(false);
      }
    });
  }

  reject(id: string) {
    this.isProcessing.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests/${id}/reject`, {}).subscribe({
      next: () => {
        this.toast.success('Request rejected.');
        this.loadRequests();
        this.isProcessing.set(false);
      },
      error: () => {
        this.toast.error('Failed to reject request.');
        this.isProcessing.set(false);
      }
    });
  }
}
