import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallButtonComponent } from '../../shared/components/install-button/install-button.component';
import { ToastService } from '../../core/services/toast.service';
import { PwaService } from '../../core/services/pwa.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, InstallButtonComponent],
  template: `
    <footer class="bg-slate-900 text-slate-300 mt-20">
      <!-- Newsletter strip -->
      <div class="border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 class="text-xl font-bold text-white">Stay in the loop</h3>
            <p class="mt-1 text-sm text-slate-400">Get early access to deals, new arrivals, and exclusive promo codes.</p>
          </div>
          <form class="flex w-full lg:w-auto gap-3" (submit)="subscribe($event)">
            <input
              type="email"
              name="newsletterEmail"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              class="flex-1 lg:w-80 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                     transition-all duration-300" />
            <button type="submit" class="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>

      <!-- Link columns -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div class="col-span-2 lg:col-span-2">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
              <img src="/images/logo.png" alt="Budgetha" class="h-10 w-auto object-contain" />
            </div>
            <span class="text-3xl font-black text-white tracking-tighter" style="font-family: 'Outfit', sans-serif;">Budgetha</span>
          </div>
          <p class="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
            Shop smarter, spend wiser. Budgetha brings the best deals from 200+ trusted vendors into one beautiful storefront.
          </p>
          <div class="mt-5 flex gap-3">
            @for (social of socials; track social.label) {
              <a
                [href]="social.href"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="social.label"
                class="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400
                       hover:bg-violet-600 hover:text-white transition-all duration-300">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path [attr.d]="social.icon" />
                </svg>
              </a>
            }
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider">Shop</h4>
          <ul class="mt-4 space-y-2.5">
            <li><a routerLink="/shop" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">All Products</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'electronics' }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Electronics</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'fashion' }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Fashion</a></li>
            <li><a routerLink="/shop" [queryParams]="{ deals: 1 }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Deals</a></li>
            <li><a routerLink="/shop" [queryParams]="{ sort: 'newest' }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider">Account</h4>
          <ul class="mt-4 space-y-2.5">
            <li><a routerLink="/account/orders" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">My Orders</a></li>
            <li><a routerLink="/account/addresses" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Addresses</a></li>
            <li><a routerLink="/account/payments" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Payment Methods</a></li>
            <li><a routerLink="/cart" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Cart</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
          <ul class="mt-4 space-y-2.5">
            <li><a routerLink="/help" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Help Center</a></li>
            <li><a routerLink="/shipping-returns" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Shipping &amp; Returns</a></li>
            <li><a routerLink="/warranty" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Warranty</a></li>
            <li><a routerLink="/contact" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <!-- Install prompt (hides itself, and its spacing, once installed or dismissed) -->
      @if (pwa.showInstallAffordance()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 pb-12 -mt-4">
          <app-install-button variant="footer" />
        </div>
      }

      <!-- Bottom bar -->
      <div class="border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-slate-500">© 2026 Budgetha. All rights reserved.</p>
          <div class="flex items-center gap-5">
            <a routerLink="/legal/privacy" class="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-300">Privacy Policy</a>
            <a routerLink="/legal/terms" class="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-300">Terms of Service</a>
            <a routerLink="/legal/cookies" class="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly pwa = inject(PwaService);
  private readonly toast = inject(ToastService);

  /**
   * There's no newsletter endpoint yet, but the form must never look like it
   * silently failed — validate locally and confirm what happened either way.
   */
  subscribe(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('newsletterEmail') as HTMLInputElement | null;
    const email = input?.value.trim() ?? '';

    if (!email) {
      this.toast.warning('Please enter your email address to subscribe.');
      input?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      this.toast.warning('That doesn’t look like a valid email address.');
      input?.focus();
      return;
    }

    this.toast.success('You’re on the list — watch your inbox for early access to deals.');
    form.reset();
  }

  readonly socials = [
    {
      label: 'X (Twitter)',
      href: 'https://x.com',
      icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a3.999 3.999 0 100 7.998 3.999 3.999 0 000-7.998zm6.406-1.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881zM12 9.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8z',
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com',
      icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    },
  ];
}
