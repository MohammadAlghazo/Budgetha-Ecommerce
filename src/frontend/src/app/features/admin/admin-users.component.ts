import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, FormsModule],
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
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Roles</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined At</th>
                @if (isSuperAdmin()) {
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
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

                              [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                          {{ role }}
                        </span>
                      }
                      @if (user.roles.length === 0) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">User</span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-400 text-xs">{{ user.createdAt | date:'MMM d, y · h:mm a' }}</td>
                  @if (isSuperAdmin()) {
                    <td class="px-6 py-4 text-right">
                      <!-- Don't show role button for SuperAdmin users (prevent self-demotion) -->
                      @if (!user.roles.includes('SuperAdmin')) {
                        <button (click)="openRoleModal(user)"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-teal-200 hover:shadow-md">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          Manage Roles
                        </button>
                      } @else {
                        <span class="text-xs text-slate-300 italic">Protected</span>
                      }
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
            </tbody>
          </table>
        </div>
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
                  <span [class.translate-x-7]="hasRole('Admin')"
                        [class.translate-x-1]="!hasRole('Admin')"
                        class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
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
                  <span [class.translate-x-7]="hasRole('Seller')"
                        [class.translate-x-1]="!hasRole('Seller')"
                        class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
                </button>
              </div>


            </div>

            <!-- Status message -->
            @if (roleActionMsg()) {
              <div class="flex items-center gap-2 p-3 rounded-lg text-sm"
                   [class.bg-emerald-50]="!roleActionError()"
                   [class.text-emerald-700]="!roleActionError()"
                   [class.bg-rose-50]="roleActionError()"
                   [class.text-rose-700]="roleActionError()">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @if (!roleActionError()) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  }
                </svg>
                {{ roleActionMsg() }}
              </div>
            }
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
  `
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly users = signal<AdminUser[]>([]);
  readonly selectedUser = signal<AdminUser | null>(null);
  readonly roleActionMsg = signal<string>('');
  readonly roleActionError = signal<boolean>(false);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe(users => this.users.set(users));
  }

  openRoleModal(user: AdminUser): void {
    this.selectedUser.set({ ...user, roles: [...user.roles] });
    this.roleActionMsg.set('');
    this.roleActionError.set(false);
  }

  closeModal(): void {
    this.selectedUser.set(null);
    // Reload users to reflect any changes
    this.adminService.getAllUsers().subscribe(users => this.users.set(users));
  }

  hasRole(role: string): boolean {
    return this.selectedUser()?.roles.includes(role) ?? false;
  }

  toggleRole(role: string): void {
    const user = this.selectedUser();
    if (!user) return;

    const alreadyHas = user.roles.includes(role);
    this.roleActionMsg.set('');
    this.roleActionError.set(false);

    const action$ = alreadyHas
      ? this.adminService.removeRole(user.id, role)
      : this.adminService.assignRole(user.id, role);

    action$.subscribe({
      next: () => {
        // Optimistically update local roles
        const updated = alreadyHas
          ? user.roles.filter(r => r !== role)
          : [...user.roles, role];
        this.selectedUser.set({ ...user, roles: updated });
        this.roleActionMsg.set(`Role "${role}" ${alreadyHas ? 'removed' : 'assigned'} successfully.`);
        this.roleActionError.set(false);
      },
      error: () => {
        this.roleActionMsg.set(`Failed to ${alreadyHas ? 'remove' : 'assign'} role "${role}". Please try again.`);
        this.roleActionError.set(true);
      }
    });
  }
}
