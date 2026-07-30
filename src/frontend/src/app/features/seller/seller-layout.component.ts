import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seller-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-indigo-950 to-slate-900 text-indigo-100 flex-shrink-0 flex flex-col hidden md:flex">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">Seller Center</span>
          </div>
        </div>

        <!-- User Info -->
        <div class="px-5 py-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-indigo-600/50 flex items-center justify-center font-bold text-sm text-white border border-indigo-500/30">
              {{ authService.user()?.firstName?.[0] }}{{ authService.user()?.lastName?.[0] }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white truncate">
                {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
              </p>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
                  Seller
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-5 space-y-1">
          <p class="px-3 text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">Store</p>

          <a routerLink="/seller/products"
             routerLinkActive="bg-indigo-700/60 text-white border-indigo-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-indigo-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center group-[.active]:bg-indigo-500/30 bg-white/5">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <span class="text-sm font-medium">My Products</span>
          </a>

          <a routerLink="/seller/add-product"
             routerLinkActive="bg-indigo-700/60 text-white border-indigo-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-indigo-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center group-[.active]:bg-indigo-500/30 bg-white/5">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-sm font-medium">Add Product</span>
          </a>
        </nav>

        <!-- Footer -->
        <div class="p-3 border-t border-white/10 space-y-1">
          <a routerLink="/"
             class="flex items-center gap-3 px-3 py-2.5 text-indigo-300 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Store
          </a>
          <button (click)="authService.logout()"
                  class="w-full flex items-center gap-3 px-3 py-2.5 text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm flex-shrink-0">
          <div class="flex items-center gap-4">
            <button class="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 class="text-lg font-bold text-slate-800">Budgetha Seller Center</h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
              Verified Seller
            </span>
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
export class SellerLayoutComponent {
  readonly authService = inject(AuthService);
}
