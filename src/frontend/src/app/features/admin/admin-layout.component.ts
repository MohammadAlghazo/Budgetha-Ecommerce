import { Component, inject, computed, signal, effect, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet],
  template: `
    <div class="h-screen bg-slate-50 flex overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-teal-950 to-slate-900 text-teal-100 flex-shrink-0 flex flex-col hidden md:flex h-full">
        <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      @if (mobileMenuOpen()) {
        <div class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" (click)="mobileMenuOpen.set(false)"></div>
        <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-950 to-slate-900 text-teal-100 shadow-2xl flex flex-col md:hidden animate-[slideInLeft_0.3s_ease-out] h-full">
          <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
        </aside>
      }

      <ng-template #sidebarContent>
        <!-- Logo -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">Admin Panel</span>
          </div>
          <button (click)="mobileMenuOpen.set(false)" class="md:hidden text-teal-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- User Info -->
        <div class="px-5 py-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-teal-600/50 flex items-center justify-center font-bold text-sm text-white border border-teal-500/30">
              {{ authService.user()?.firstName?.[0] }}{{ authService.user()?.lastName?.[0] }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white truncate">
                {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
              </p>
              <div class="flex items-center gap-1 mt-0.5">
                @if (isSuperAdmin()) {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-purple-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>
                    SuperAdmin
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-teal-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
                    Admin
                  </span>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          <p class="px-3 text-xs font-semibold text-teal-500 uppercase tracking-wider mb-3">Main</p>

          <a routerLink="/admin/dashboard"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center group-[.active]:bg-teal-500/30 bg-white/5">
              <svg class="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            <span class="text-sm font-medium">Dashboard</span>
          </a>

          @if (isAdminOrSuperAdmin()) {
            <a routerLink="/admin/users"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span class="text-sm font-medium">Users</span>
            @if (isSuperAdmin()) {
              <span class="ml-auto text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded-md font-medium">SA</span>
            }
            </a>

            <a routerLink="/admin/seller-requests" (click)="mobileMenuOpen.set(false)"
               routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <span class="text-sm font-medium">Seller Requests</span>
            </a>
          }

          <a routerLink="/admin/products" (click)="mobileMenuOpen.set(false)"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <span class="text-sm font-medium">Products</span>
          </a>

          @if (isAdminOrSuperAdmin()) {
            <a routerLink="/admin/categories" (click)="mobileMenuOpen.set(false)"
               routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <span class="text-sm font-medium">Categories</span>
            </a>

            <a routerLink="/admin/announcements" (click)="mobileMenuOpen.set(false)"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
            </div>
            <span class="text-sm font-medium">Announcements</span>
            </a>
          }
        </nav>

        <!-- Footer -->
        <div class="p-3 border-t border-white/10 space-y-1">
          <a routerLink="/"
             class="flex items-center gap-3 px-3 py-2.5 text-teal-300 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Store
          </a>
          <button (click)="authService.logout()"
                  class="w-full flex items-center gap-3 px-3 py-2.5 text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </ng-template>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm flex-shrink-0">
          <div class="flex items-center gap-4">
            <!-- Mobile menu placeholder -->
            <button class="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500" (click)="mobileMenuOpen.set(true)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 class="text-lg font-bold text-slate-800">{{ authService.user()?.roles?.includes('Seller') && !authService.user()?.roles?.includes('Admin') && !authService.user()?.roles?.includes('SuperAdmin') ? 'Seller Dashboard' : 'Budgetha Admin' }}</h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-600 hidden sm:block">
              {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
            </span>
          </div>
        </header>

        <!-- Content -->
        <div class="flex-1 overflow-auto p-6 lg:p-8 bg-slate-50/50">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent implements OnDestroy {
  readonly authService = inject(AuthService);
  readonly mobileMenuOpen = signal(false);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly isAdminOrSuperAdmin = computed(() =>
    this.authService.user()?.roles?.some(r => r === 'Admin' || r === 'SuperAdmin') ?? false
  );

  constructor() {
    effect(() => {
      if (this.mobileMenuOpen()) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('overflow-hidden');
  }
}
