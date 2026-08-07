import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Users Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ users().length }} registered users.
            @if (isSuperAdmin()) {
              <span class="text-purple-600 font-medium">You can assign and remove roles.</span>
            }
          </p>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Roles</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined At</th>
                @if (isSuperAdmin()) {
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-end">Actions</th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td [attr.colspan]="isSuperAdmin() ? 4 : 3" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              } @else {
                @for (user of users(); track user.id) {
                <tr class="hover:bg-slate-50/60 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {{ user.firstName[0] }}{{ user.lastName[0] }}
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900">{{ user.firstName }} {{ user.lastName }}</p>
                        <p class="text-xs text-slate-400">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-1 flex-wrap">
                      @for (role of user.roles; track role) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
                              [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                              [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"
                              [class.bg-indigo-100]="role === 'Seller'" [class.text-indigo-700]="role === 'Seller'"
                              [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                          {{ role }}
                        </span>
                      }
                      @if (user.roles.length === 0) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">User</span>
                      }
                      @if (user.isBanned) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-700 ms-1">
                          Banned
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-400 text-xs">{{ user.createdAt | date:'MMM d, y · h:mm a' }}</td>
                  @if (isSuperAdmin()) {
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-2">
                        <a [routerLink]="['/admin/users', user.id]"
                           class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          Profile
                        </a>

                        @if (!user.roles.includes('SuperAdmin')) {
                          <button (click)="openRoleModal(user)"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                            Roles
                          </button>

                          <button (click)="toggleBan(user)"
                                  [disabled]="actionLoadingId() === user.id + ':ban'"
                                  [class.from-rose-600]="!user.isBanned" [class.to-rose-700]="!user.isBanned"
                                  [class.from-emerald-600]="user.isBanned" [class.to-emerald-700]="user.isBanned"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            @if (actionLoadingId() === user.id + ':ban') {
                              <span class="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block"></span>
                            } @else {
                              {{ user.isBanned ? 'Unban' : 'Ban' }}
                            }
                          </button>

                          <button (click)="deleteUser(user)"
                                  [disabled]="actionLoadingId() === user.id + ':delete'"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            @if (actionLoadingId() === user.id + ':delete') {
                              <span class="w-3 h-3 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin inline-block"></span>
                            } @else {
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            }
                          </button>
                        } @else {
                          <span class="text-xs text-slate-300 italic">Protected</span>
                        }
                      </div>
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td [attr.colspan]="isSuperAdmin() ? 4 : 3" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      <p class="text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
        
        @if (hasMore()) {
          <div class="px-6 py-4 border-t border-slate-100 flex justify-center">
            <button (click)="loadMore()" [disabled]="loadingMore()"
                    class="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
              @if (loadingMore()) {
                <span class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
                  Loading...
                </span>
              } @else {
                Load More Users
              }
            </button>
          </div>
        }
      </div>
    </div>

    <!-- Role Management Modal (SuperAdmin only) -->
    @if (selectedUser() && isSuperAdmin()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-teal-700 to-teal-900 px-6 py-5 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  {{ selectedUser()!.firstName[0] }}{{ selectedUser()!.lastName[0] }}
                </div>
                <div>
                  <h3 class="font-bold">{{ selectedUser()!.firstName }} {{ selectedUser()!.lastName }}</h3>
                  <p class="text-teal-200 text-xs">{{ selectedUser()!.email }}</p>
                </div>
              </div>
              <button (click)="closeModal()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-500">Assign or remove roles for this user. Changes take effect immediately.</p>

            <!-- Role toggles -->
            <div class="space-y-3">
              <!-- Admin role -->
              <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">Admin</p>
                    <p class="text-xs text-slate-400">Product approval, content management</p>
                  </div>
                </div>
                <button (click)="toggleRole('Admin')"
                        [class.bg-teal-600]="hasRole('Admin')"
                        [class.bg-slate-200]="!hasRole('Admin')"
                        class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
                  <span [class.translate-x-6]="hasRole('Admin')"
                        [class.translate-x-0]="!hasRole('Admin')"
                        class="theme-preserve-light absolute top-0.5 start-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
                </button>
              </div>

              <!-- Seller role -->
              <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors mt-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">Seller</p>
                    <p class="text-xs text-slate-400">Can add and manage own products</p>
                  </div>
                </div>
                <button (click)="toggleRole('Seller')"
                        [class.bg-indigo-600]="hasRole('Seller')"
                        [class.bg-slate-200]="!hasRole('Seller')"
                        class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                  <span [class.translate-x-6]="hasRole('Seller')"
                        [class.translate-x-0]="!hasRole('Seller')"
                        class="theme-preserve-light absolute top-0.5 start-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
                </button>
              </div>


            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 pb-6">
            <button (click)="closeModal()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Confirmation Modal -->
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
              Are you sure you want to <strong>{{ confirmAction()?.type }}</strong> {{ confirmAction()?.user?.firstName }}?
              @if (confirmAction()?.type === 'delete') {
                <br>This action cannot be undone.
              }
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeConfirmAction()"
                      [disabled]="confirming()"
                      class="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                      [class.bg-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.hover:bg-rose-700]="(confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban') && !confirming()"
                      [class.bg-emerald-600]="confirmAction()?.type === 'unban'"
                      [class.hover:bg-emerald-700]="confirmAction()?.type === 'unban' && !confirming()">
                @if (confirming()) {
                  <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block"></span>
                }
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly loadingMore = signal(false);
  readonly currentPage = signal(1);
  readonly hasMore = signal(false);
  readonly actionLoadingId = signal<string | null>(null);
  readonly confirming = signal(false);
  
  readonly selectedUser = signal<AdminUser | null>(null);
  readonly confirmAction = signal<{ type: 'ban' | 'unban' | 'delete', user: AdminUser } | null>(null);
  
  private readonly toastService = inject(ToastService);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  ngOnInit(): void {
    this.isLoading.set(true);
    this.adminService.getAllUsers(1, 20).subscribe({
      next: (res) => {
        this.users.set(res.items);
        this.hasMore.set(res.page < res.totalPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Failed to load users. Please refresh the page.');
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMore()) return;
    
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    this.adminService.getAllUsers(nextPage, 20).subscribe({
      next: (res) => {
        this.users.update(current => [...current, ...res.items]);
        this.currentPage.set(res.page);
        this.hasMore.set(res.page < res.totalPages);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      }
    });
  }

  openRoleModal(user: AdminUser): void {
    this.selectedUser.set({ ...user, roles: [...user.roles] });
  }

  closeModal(): void {
    this.selectedUser.set(null);
  }

  openConfirmModal(type: 'ban' | 'unban' | 'delete', user: AdminUser): void {
    this.confirmAction.set({ type, user });
  }

  closeConfirmModal(): void {
    if (this.confirming()) return;
    this.confirmAction.set(null);
  }

  hasRole(role: string): boolean {
    return this.selectedUser()?.roles.includes(role) ?? false;
  }

  toggleRole(role: string): void {
    const user = this.selectedUser();
    if (!user) return;

    const alreadyHas = user.roles.includes(role);    
    const updatedRoles = alreadyHas
      ? user.roles.filter(r => r !== role)
      : [...user.roles, role];
      
    this.selectedUser.set({ ...user, roles: updatedRoles });
    this.users.update(users => users.map(u => u.id === user.id ? { ...u, roles: updatedRoles } : u));

    const action$ = alreadyHas
      ? this.adminService.removeRole(user.id, role)
      : this.adminService.assignRole(user.id, role);

    action$.subscribe({
      next: () => {
        this.toastService.success(`Role "${role}" ${alreadyHas ? 'removed' : 'assigned'} successfully.`);
      },
      error: () => {
        this.selectedUser.set(user);
        this.users.update(users => users.map(u => u.id === user.id ? user : u));
        this.toastService.error(`Failed to ${alreadyHas ? 'remove' : 'assign'} role "${role}".`);
      }
    });
  }

  toggleBan(user: AdminUser): void {
    this.openConfirmModal(user.isBanned ? 'unban' : 'ban', user);
  }

  deleteUser(user: AdminUser): void {
    this.openConfirmModal('delete', user);
  }

  executeConfirmAction(): void {
    const action = this.confirmAction();
    if (!action || this.confirming()) return;

    const { type, user } = action;

    if (type === 'ban' || type === 'unban') {
      this.confirming.set(true);
      const newStatus = type === 'ban';
      this.users.update(users => users.map(u => u.id === user.id ? { ...u, isBanned: newStatus } : u));
      
      const action$ = type === 'unban'
        ? this.adminService.unbanUser(user.id)
        : this.adminService.banUser(user.id);

      action$.subscribe({
        next: () => {
          this.confirming.set(false);
          this.confirmAction.set(null);
          this.toastService.success(`User successfully ${type === 'ban' ? 'banned' : 'unbanned'}.`);
        },
        error: () => {
          this.confirming.set(false);
          this.confirmAction.set(null);
          this.users.update(users => users.map(u => u.id === user.id ? user : u));
          this.toastService.error(`Failed to ${type} user.`);
        }
      });
    } else if (type === 'delete') {
      this.confirming.set(true);

      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.confirming.set(false);
          this.confirmAction.set(null);
          this.users.update(users => users.filter(u => u.id !== user.id));
          this.toastService.success(`User deleted permanently.`);
        },
        error: (err: HttpErrorResponse) => {
          this.confirming.set(false);
          this.confirmAction.set(null);

          if (err.status === 409 && err.error?.code === 'SELLER_HAS_PRODUCTS') {
            this.toastService.error('This seller has products. You must delete all products first.');
            this.router.navigate(['/admin/users', user.id], {
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
