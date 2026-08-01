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
            <div class="theme-preserve-light w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
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
          <p class="text-xs text-slate-500">© 2026 Mohammad Alghazo. All rights reserved.</p>
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
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mohammad-alghazo-106506288/',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/MohammadAlghazo',
      icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    },
    {
      label: 'Portfolio',
      href: 'https://mohammadalghazo.pages.dev/',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/962772913081',
      icon: 'M11.979 0C5.352 0 .001 5.376.001 11.978c0 2.277.625 4.496 1.796 6.368l-1.792 6.551 6.643-1.758c1.787 1.042 3.842 1.586 5.925 1.586 6.623 0 11.985-5.375 11.985-11.977C23.978 5.376 18.601 0 11.979 0zM12 21.056c-1.865 0-3.69-.512-5.283-1.472l-.379-.228-3.921 1.037 1.045-3.856-.251-.403a9.789 9.789 0 0 1-1.512-5.263C1.699 6.425 6.182 2.022 12 2.022c5.819 0 10.301 4.403 10.301 9.849S17.819 21.056 12 21.056zm5.666-7.854c-.31-.156-1.837-.923-2.12-.1029-.284-.106-.492-.156-.698.156-.206.312-.801.995-.98 1.198-.182.202-.363.228-.674.072-2.13-.996-3.23-1.921-4.482-4.043-.182-.311-.02-.48.136-.636.14-.14.31-.362.464-.543.155-.181.206-.311.31-.518.103-.207.052-.389-.026-.544-.078-.156-.698-1.711-.956-2.345-.252-.619-.508-.535-.698-.544-.181-.009-.389-.011-.595-.011-.207 0-.543.078-.828.389-.284.311-1.087 1.077-1.087 2.622s1.112 3.036 1.267 3.243c.155.207 2.186 3.42 5.371 4.707 2.217.896 3.045.96 4.148.814 1.103-.147 3.504-1.442 3.996-2.836.491-1.393.491-2.585.344-2.836-.147-.251-.543-.404-.854-.56z',
    },
  ];
}
