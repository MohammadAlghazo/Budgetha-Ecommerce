import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService, AdminUserProfile } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-user-profile',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a routerLink="/admin/users" class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </a>
          <div>
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">User Profile</h2>
            <p class="mt-1 text-sm text-slate-500">Detailed information and associated products</p>
          </div>
        </div>

        @if (profile() && isSuperAdmin()) {
          <div class="flex items-center gap-3">
            <button (click)="toggleBan()"
                    [disabled]="actionLoading() !== null"
                    [class.text-rose-600]="!profile()!.isBanned" [class.bg-rose-50]="!profile()!.isBanned" [class.hover:bg-rose-100]="!profile()!.isBanned && actionLoading() === null"
                    [class.text-emerald-600]="profile()!.isBanned" [class.bg-emerald-50]="profile()!.isBanned" [class.hover:bg-emerald-100]="profile()!.isBanned && actionLoading() === null"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              @if (actionLoading() === 'ban') {
                <span class="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block"></span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              }
              {{ profile()!.isBanned ? 'Unban User' : 'Ban User' }}
            </button>
            <button (click)="deleteUser()"
                    [disabled]="actionLoading() !== null"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
              @if (actionLoading() === 'delete') {
                <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block"></span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              }
              Delete User
            </button>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center p-12">
          <div class="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      } @else if (profile()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <div class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-teal-200 mb-6 relative">
                {{ profile()!.firstName[0] }}{{ profile()!.lastName[0] }}
                @if (profile()!.isBanned) {
                  <div class="absolute -bottom-2 -end-2 w-8 h-8 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center text-white" title="User is Banned">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                }
              </div>
              <h3 class="text-xl font-bold text-slate-900">{{ profile()!.firstName }} {{ profile()!.lastName }}</h3>
              <p class="text-slate-500 mt-1">{{ profile()!.email }}</p>

              <div class="flex flex-wrap justify-center gap-2 mt-4">
                @for (role of profile()!.roles; track role) {
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold"
                        [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                        [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"
                        [class.bg-indigo-100]="role === 'Seller'" [class.text-indigo-700]="role === 'Seller'"
                        [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                    {{ role }}
                  </span>
                }
                @if (profile()!.roles.length === 0) {
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">User</span>
                }
              </div>

              <div class="mt-8 pt-6 border-t border-slate-100 text-start space-y-4">
                <div>
                  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p class="text-sm font-medium text-slate-700 mt-1">{{ profile()!.createdAt | date:'longDate' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</p>
                  <p class="text-sm font-medium text-slate-700 mt-1 truncate" [title]="profile()!.id">{{ profile()!.id }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-slate-900">Products Created ({{ profile()!.products.length }})</h3>
              </div>

              @if (profile()!.products.length > 0) {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (product of profile()!.products; track product.id) {
                    <div class="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                      <div class="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        @if (product.images && product.images.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <div class="w-full h-full flex items-center justify-center text-slate-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-slate-900 truncate">{{ product.name }}</h4>
                        <p class="text-xs text-slate-500 mt-0.5 truncate">
                          @if (product.categories && product.categories.length > 0) {
                            {{ product.categories[0].name }}
                            @if (product.categories.length > 1) {
                              <span class="opacity-75"> +{{ product.categories.length - 1 }}</span>
                            }
                          } @else {
                            Uncategorized
                          }
                        </p>
                        <div class="flex items-center gap-3 mt-2">
                          <span class="text-sm font-bold text-teal-600">{{ product.price | currency }}</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                [class.bg-emerald-100]="product.approvalStatus === 'Approved'" [class.text-emerald-700]="product.approvalStatus === 'Approved'"
                                [class.bg-amber-100]="product.approvalStatus === 'Pending'" [class.text-amber-700]="product.approvalStatus === 'Pending'"
                                [class.bg-rose-100]="product.approvalStatus === 'Rejected'" [class.text-rose-700]="product.approvalStatus === 'Rejected'">
                            {{ product.approvalStatus }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div class="w-12 h-12 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                  <h4 class="text-sm font-bold text-slate-700">No products found</h4>
                  <p class="text-xs text-slate-500 mt-1">This user hasn't created any products yet.</p>
                </div>
              }
            </div>
          </div>

          <div class="lg:col-span-3 space-y-6 mt-6">
            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-slate-900">Order History ({{ profile()!.orders ? profile()!.orders.length : 0 }})</h3>
              </div>

              @if (profile()!.orders && profile()!.orders.length > 0) {
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-start">
                    <thead>
                      <tr class="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                        <th class="px-4 py-3 text-start">Order Number</th>
                        <th class="px-4 py-3 text-start">Date</th>
                        <th class="px-4 py-3 text-start">Total Amount</th>
                        <th class="px-4 py-3 text-start">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      @for (order of profile()!.orders; track order.id) {
                        <tr class="hover:bg-slate-50 transition-colors">
                          <td class="px-4 py-3 font-semibold text-slate-900">{{ order.orderNumber }}</td>
                          <td class="px-4 py-3 text-slate-500">{{ order.date | date: 'mediumDate' }}</td>
                          <td class="px-4 py-3 font-bold text-teal-600">{{ order.totalAmount | currency }}</td>
                          <td class="px-4 py-3">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                  [class.bg-emerald-100]="order.status === 'Delivered'" [class.text-emerald-700]="order.status === 'Delivered'"
                                  [class.bg-amber-100]="order.status === 'Processing' || order.status === 'Pending'" [class.text-amber-700]="order.status === 'Processing' || order.status === 'Pending'"
                                  [class.bg-rose-100]="order.status === 'Cancelled' || order.status === 'Failed'" [class.text-rose-700]="order.status === 'Cancelled' || order.status === 'Failed'"
                                  [class.bg-slate-100]="!['Delivered','Processing','Pending','Cancelled','Failed'].includes(order.status)"
                                  [class.text-slate-700]="!['Delivered','Processing','Pending','Cancelled','Failed'].includes(order.status)">
                              {{ order.status }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div class="w-12 h-12 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <h4 class="text-sm font-bold text-slate-700">No orders found</h4>
                  <p class="text-xs text-slate-500 mt-1">This user hasn't placed any orders yet.</p>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <h4 class="text-lg font-bold text-slate-900">User not found</h4>
          <p class="text-slate-500 mt-1">The user might have been deleted or the ID is incorrect.</p>
        </div>
      }

    @if (confirmAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                 [class.bg-rose-100]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                 [class.text-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                 [class.bg-emerald-100]="confirmAction()?.type === 'unban'"
                 [class.text-emerald-600]="confirmAction()?.type === 'unban'">
              @if (confirmAction()?.type === 'delete') {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              } @else if (confirmAction()?.type === 'ban') {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              } @else {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              }
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Confirm Action</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to <strong>{{ confirmAction()?.type }}</strong> {{ profile()?.firstName }}?
              @if (confirmAction()?.type === 'delete') {
                <br>This action cannot be undone.
              }
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" [disabled]="actionLoading() !== null" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-60">
                Cancel
              </button>
              <button (click)="executeConfirmAction()"
                      [disabled]="actionLoading() !== null"
                      class="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                      [class.bg-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.hover:bg-rose-700]="(confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban') && actionLoading() === null"
                      [class.bg-emerald-600]="confirmAction()?.type === 'unban'"
                      [class.hover:bg-emerald-700]="confirmAction()?.type === 'unban' && actionLoading() === null">
                @if (actionLoading() !== null) {
                  <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block"></span>
                }
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    }
    </div>
  `
})
export class AdminUserProfileComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly profile = signal<AdminUserProfile | null>(null);
  readonly loading = signal<boolean>(true);
  readonly confirmAction = signal<{ type: 'ban' | 'unban' | 'delete' } | null>(null);
  readonly actionLoading = signal<'ban' | 'delete' | null>(null);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfile(id);
    } else {
      this.loading.set(false);
    }
  }

  loadProfile(userId: string): void {
    this.loading.set(true);
    this.adminService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.loading.set(false);
      }
    });
  }

  openConfirmModal(type: 'ban' | 'unban' | 'delete'): void {
    this.confirmAction.set({ type });
  }

  closeConfirmModal(): void {
    if (this.actionLoading() !== null) return;
    this.confirmAction.set(null);
  }

  toggleBan(): void {
    const user = this.profile();
    if (!user) return;
    this.openConfirmModal(user.isBanned ? 'unban' : 'ban');
  }

  deleteUser(): void {
    this.openConfirmModal('delete');
  }

  executeConfirmAction(): void {
    const action = this.confirmAction();
    const user = this.profile();
    if (!action || !user || this.actionLoading() !== null) return;

    const { type } = action;

    if (type === 'ban' || type === 'unban') {
      this.actionLoading.set('ban');
      const action$ = type === 'unban'
        ? this.adminService.unbanUser(user.id)
        : this.adminService.banUser(user.id);

      action$.subscribe({
        next: () => {
          this.actionLoading.set(null);
          this.confirmAction.set(null);
          this.toastService.success(`User successfully ${type === 'ban' ? 'banned' : 'unbanned'}.`);
          this.loadProfile(user.id);
        },
        error: () => {
          this.actionLoading.set(null);
          this.confirmAction.set(null);
          this.toastService.error(`Failed to ${type} user.`);
        }
      });
    } else if (type === 'delete') {
      this.actionLoading.set('delete');
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.actionLoading.set(null);
          this.confirmAction.set(null);
          this.toastService.success(`User deleted permanently.`);
          this.router.navigate(['/admin/users']);
        },
        error: (err: HttpErrorResponse) => {
          this.actionLoading.set(null);
          this.confirmAction.set(null);

          if (err.status === 409 && err.error?.code === 'SELLER_HAS_PRODUCTS') {
            this.toastService.error('This seller has products. You must delete all products first.');
            this.router.navigate(['/admin/products'], {
              queryParams: { sellerDeleteMode: '1', sellerId: user.id, sellerName: user.firstName + ' ' + user.lastName }
            });
          } else {
            this.toastService.error('Failed to delete user.');
          }
        }
      });
    }
  }
}
