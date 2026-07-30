import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { PwaService } from '../../core/services/pwa.service';
import { ToastService } from '../../core/services/toast.service';
import { InstallButtonComponent } from '../../shared/components/install-button/install-button.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule, InstallButtonComponent],
  template: `
    <!-- Announcement bar -->
    <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 text-white text-center text-xs sm:text-sm font-medium py-2 px-4">
      Free shipping on orders over $75 · Use code <span class="font-bold tracking-wide">WELCOME10</span> for 10% off your first order
    </div>

    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-sm shadow-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between gap-4 h-16 lg:h-[4.5rem]">
          <!-- Left: mobile hamburger + logo -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Toggle menu"
              class="lg:hidden icon-btn h-10 w-10">
              @if (mobileMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              }
            </button>

            <a routerLink="/" class="flex items-center gap-2 group -ml-3">
              <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
              <span class="text-3xl font-black text-slate-900 tracking-tighter hidden sm:block" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
            </a>
          </div>

          <!-- Center: desktop nav -->
          <nav class="hidden lg:flex items-center gap-1" aria-label="Primary">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                [queryParams]="link.query"
                routerLinkActive="text-teal-700 bg-teal-50"
                [routerLinkActiveOptions]="{ exact: link.exact }"
                class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300">
                {{ link.label }}
              </a>
            }
          </nav>

          <!-- Right: search + actions -->
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- Install as app (hidden once installed or dismissed) -->
            <app-install-button variant="header" />

            <!-- Desktop search -->
            <form (submit)="submitSearch($event)" class="hidden md:block relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                name="search"
                [(ngModel)]="searchTerm"
                placeholder="Search products…"
                aria-label="Search products"
                class="w-44 lg:w-64 rounded-full border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20
                       focus:border-teal-500 focus:bg-white transition-all duration-300" />
            </form>

            <!-- Wishlist -->
            <a routerLink="/shop" [queryParams]="{ wishlist: 1 }" aria-label="Wishlist" class="icon-btn h-10 w-10 relative">
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              @if (wishlistCount() > 0) {
                <span class="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {{ wishlistCount() }}
                </span>
              }
            </a>

            <!-- Cart -->
            <button type="button" (click)="cart.openDrawer()" aria-label="Open cart" class="icon-btn h-10 w-10 relative">
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              @if (cartCount() > 0) {
                <span class="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {{ cartCount() }}
                </span>
              }
            </button>

            <!-- User menu -->
            @if (auth.isAuthenticated()) {
              <div class="relative">
                <button
                  type="button"
                  (click)="toggleUserMenu($event)"
                  [attr.aria-expanded]="userMenuOpen()"
                  aria-label="Account menu"
                  class="flex items-center gap-2 rounded-full pl-1 pr-1 sm:pr-3 py-1 hover:bg-slate-100 transition-colors duration-300">
                  <span class="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-bold flex items-center justify-center">
                    {{ initials() }}
                  </span>
                  <svg class="hidden sm:block w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                @if (userMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-56 card p-2 shadow-xl shadow-slate-200/80 animate-[menuIn_0.15s_ease-out]" (click)="$event.stopPropagation()">
                    <div class="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p class="text-sm font-semibold text-slate-900 truncate">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p>
                      <p class="text-xs text-slate-400 truncate">{{ auth.user()?.email }}</p>
                    </div>
                    @if (auth.user()?.roles?.includes('Admin') || auth.user()?.roles?.includes('SuperAdmin')) {
                      <a
                        routerLink="/admin"
                        (click)="userMenuOpen.set(false)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors duration-200 mb-1 font-medium">
                        Admin Dashboard
                      </a>
                    }
                    @for (item of accountLinks; track item.path) {
                      <a
                        [routerLink]="item.path"
                        (click)="userMenuOpen.set(false)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200">
                        {{ item.label }}
                      </a>
                    }
                    <button
                      type="button"
                      (click)="logout()"
                      class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors duration-200 mt-1 border-t border-slate-100 pt-2.5">
                      Sign out
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a
                routerLink="/auth/login"
                class="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300">
                Sign in
              </a>
              <a routerLink="/auth/register" class="btn-primary px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm ml-1">Sign up</a>
            }
          </div>
        </div>

        <!-- Mobile search -->
        <form (submit)="submitSearch($event)" class="md:hidden pb-3 relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-[calc(50%+0.375rem)] w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            name="search-mobile"
            [(ngModel)]="searchTerm"
            placeholder="Search products…"
            aria-label="Search products"
            class="w-full rounded-full border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm
                   placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20
                   focus:border-teal-500 focus:bg-white transition-all duration-300" />
        </form>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <nav class="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-[menuIn_0.2s_ease-out]" aria-label="Mobile">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              [queryParams]="link.query"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="text-teal-700 bg-teal-50"
              [routerLinkActiveOptions]="{ exact: link.exact }"
              class="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200">
              {{ link.label }}
            </a>
          }

          @if (!auth.isAuthenticated()) {
            <div class="pt-2 mt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              <a routerLink="/auth/login" (click)="mobileMenuOpen.set(false)" class="btn-secondary py-3">Sign in</a>
              <a routerLink="/auth/register" (click)="mobileMenuOpen.set(false)" class="btn-primary py-3">Sign up</a>
            </div>
          }

          @if (pwa.showInstallAffordance()) {
            <button
              type="button"
              (click)="installApp()"
              class="mt-2 w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors duration-200">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13.5m0 0l4.5-4.5M12 16.5L7.5 12M3.75 18.75h16.5" />
              </svg>
              Install Budgetha app
            </button>
          }
        </nav>
      }
    </header>
  `,
  styles: `
    @keyframes menuIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  `,
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly pwa = inject(PwaService);
  private readonly toast = inject(ToastService);
  private readonly wishlist = inject(WishlistService);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal(false);
  readonly userMenuOpen = signal(false);
  searchTerm = '';

  readonly cartCount = this.cart.count;
  readonly wishlistCount = this.wishlist.count;

  readonly navLinks = [
    { label: 'Home', path: '/', query: {}, exact: true },
    { label: 'Shop', path: '/shop', query: {}, exact: true },
    { label: 'Electronics', path: '/shop', query: { category: 'electronics' }, exact: false },
    { label: 'Fashion', path: '/shop', query: { category: 'fashion' }, exact: false },
    { label: 'Deals', path: '/shop', query: { deals: 1 }, exact: false },
  ];

  readonly accountLinks = [
    { label: 'My Orders', path: '/account/orders' },
    { label: 'Saved Addresses', path: '/account/addresses' },
    { label: 'Payment Methods', path: '/account/payments' },
    { label: 'Account Settings', path: '/account/settings' },
  ];

  readonly initials = computed(() => {
    const u = this.auth.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || u.email[0].toUpperCase();
  });

  @HostListener('document:click')
  closeMenus(): void {
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen.update(v => !v);
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/shop'], { queryParams: { search: this.searchTerm || null } });
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
    this.toast.success('You’ve been signed out.');
  }

  installApp(): void {
    this.mobileMenuOpen.set(false);
    void this.pwa.install();
  }
}
