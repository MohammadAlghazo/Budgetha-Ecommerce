### File: src/frontend/src/app/app.config.ts
```typescript
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { GlobalErrorHandler } from './core/errors/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    
    
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
```

### File: src/frontend/src/app/app.html
```html
<router-outlet />
<app-toast />
```

### File: src/frontend/src/app/app.routes.ts
```typescript
import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { sellerGuard } from './core/guards/seller.guard';

export const routes: Routes = [
  
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'users/:id', loadComponent: () => import('./features/admin/admin-user-profile.component').then(m => m.AdminUserProfileComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'add-product', loadComponent: () => import('./features/admin/admin-add-product.component').then(m => m.AdminAddProductComponent) },
      { path: 'edit-product/:id', loadComponent: () => import('./features/admin/admin-add-product.component').then(m => m.AdminAddProductComponent) },
      { path: 'categories', loadComponent: () => import('./features/admin/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'seller-requests', loadComponent: () => import('./features/admin/admin-seller-requests.component').then(m => m.AdminSellerRequestsComponent) },
      { path: 'announcements', loadComponent: () => import('./features/admin/admin-announcements.component').then(m => m.AdminAnnouncementsComponent) },
      { path: 'logs', loadComponent: () => import('./features/admin/admin-logs.component').then(m => m.AdminLogsComponent) }
    ]
  },



  
  
  {
    path: 'auth/login',
    title: 'Sign in · Budgetha',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    title: 'Create an account · Budgetha',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'auth/forgot-password',
    title: 'Reset your password · Budgetha',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    title: 'Choose a new password · Budgetha',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },

  
  
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'signin', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'sign-in', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'sign-up', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'forgot-password', redirectTo: 'auth/forgot-password', pathMatch: 'full' },
  { path: 'reset-password', redirectTo: 'auth/reset-password', pathMatch: 'full' },

  
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        title: 'Budgetha — Shop smarter, spend wiser',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'shop',
        title: 'Shop all products · Budgetha',
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
      },
      
      
      
      { path: 'products', redirectTo: 'shop', pathMatch: 'full' },
      { path: 'catalog', redirectTo: 'shop', pathMatch: 'full' },
      { path: 'deals', pathMatch: 'full', redirectTo: () => inject(Router).parseUrl('/shop?deals=1') },
      { path: 'wishlist', pathMatch: 'full', redirectTo: () => inject(Router).parseUrl('/shop?wishlist=1') },
      {
        path: 'products/:slug',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'cart',
        title: 'Your cart · Budgetha',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'checkout',
        title: 'Checkout · Budgetha',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
      },
      {
        path: 'checkout/success/:number',
        title: 'Order confirmed · Budgetha',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/order-success.component').then(m => m.OrderSuccessComponent),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadComponent: () => import('./features/account/account-layout.component').then(m => m.AccountLayoutComponent),
        children: [
          { path: '', redirectTo: 'orders', pathMatch: 'full' },
          {
            path: 'orders',
            title: 'My orders · Budgetha',
            loadComponent: () => import('./features/account/account-orders.component').then(m => m.AccountOrdersComponent),
          },
          {
            path: 'addresses',
            title: 'Saved addresses · Budgetha',
            loadComponent: () => import('./features/account/account-addresses.component').then(m => m.AccountAddressesComponent),
          },

          {
            path: 'settings',
            title: 'Account settings · Budgetha',
            loadComponent: () => import('./features/account/account-settings.component').then(m => m.AccountSettingsComponent),
          },
          
          
          { path: '**', redirectTo: 'orders' },
        ],
      },
      { path: 'dashboard', redirectTo: 'account/orders', pathMatch: 'full' },
      { path: 'orders', redirectTo: 'account/orders', pathMatch: 'full' },
      { path: 'profile', redirectTo: 'account/settings', pathMatch: 'full' },
      { path: 'settings', redirectTo: 'account/settings', pathMatch: 'full' },

      
      {
        path: 'help',
        title: 'Help Center · Budgetha',
        data: { key: 'help' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'shipping-returns',
        title: 'Shipping & Returns · Budgetha',
        data: { key: 'shipping-returns' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'warranty',
        title: 'Warranty · Budgetha',
        data: { key: 'warranty' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'contact',
        title: 'Contact us · Budgetha',
        data: { key: 'contact' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'legal/privacy',
        title: 'Privacy Policy · Budgetha',
        data: { key: 'legal/privacy' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'legal/terms',
        title: 'Terms of Service · Budgetha',
        data: { key: 'legal/terms' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'legal/cookies',
        title: 'Cookie Policy · Budgetha',
        data: { key: 'legal/cookies' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      
      { path: 'privacy', redirectTo: 'legal/privacy', pathMatch: 'full' },
      { path: 'terms', redirectTo: 'legal/terms', pathMatch: 'full' },
      { path: 'cookies', redirectTo: 'legal/cookies', pathMatch: 'full' },
      { path: 'support', redirectTo: 'help', pathMatch: 'full' },
      { path: 'faq', redirectTo: 'help', pathMatch: 'full' },
      { path: 'shipping', redirectTo: 'shipping-returns', pathMatch: 'full' },
      { path: 'returns', redirectTo: 'shipping-returns', pathMatch: 'full' },

      {
        path: '**',
        title: 'Page not found · Budgetha',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
```

### File: src/frontend/src/app/app.scss
```scss

```

### File: src/frontend/src/app/app.spec.ts
```typescript
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, budgetha-web');
  });
});
```

### File: src/frontend/src/app/app.ts
```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  
  
  private readonly pwa = inject(PwaService);
}
```

### File: src/frontend/src/app/core/errors/global-error-handler.ts
```typescript
import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  
  private lastMessage = '';
  private lastShownAt = 0;

  handleError(error: unknown): void {
    
    console.error(error);

    
    if (this.unwrap(error) instanceof HttpErrorResponse) return;

    const message = this.describe(error);
    if (!message) return;

    const now = performance.now();
    if (message === this.lastMessage && now - this.lastShownAt < 5000) return;
    this.lastMessage = message;
    this.lastShownAt = now;

    this.toast.error(message);
  }

  
  private unwrap(error: unknown): unknown {
    const nested = (error as { rejection?: unknown; cause?: unknown } | null);
    return nested?.rejection ?? nested?.cause ?? error;
  }

  private describe(error: unknown): string | null {
    const raw = this.unwrap(error);
    const text = raw instanceof Error ? `${raw.name}: ${raw.message}` : String(raw ?? '');

    
    
    if (/ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(text)) {
      return 'A newer version of Budgetha is available. Please refresh the page to continue.';
    }

    if (/NetworkError|Failed to fetch|Load failed/i.test(text)) {
      return navigator.onLine
        ? 'A network request failed. Please try again.'
        : 'You appear to be offline. Some features won’t work until you reconnect.';
    }

    if (/QuotaExceededError/i.test(text)) {
      return 'Your browser storage is full, so we couldn’t save that locally.';
    }

    
    
    return isDevMode()
      ? `Unexpected error: ${text}`
      : 'Something unexpected happened. We’ve logged it — please try that again.';
  }
}
```

### File: src/frontend/src/app/core/guards/admin.guard.ts
```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = authService.user();
  
  if (user && (user.roles?.includes('Admin') || user.roles?.includes('SuperAdmin') || user.roles?.includes('Seller'))) {
    return true;
  }

  toastService.error('Unauthorized access. Admin privileges required.');
  return router.parseUrl('/');
};
```

### File: src/frontend/src/app/core/guards/auth.guard.ts
```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';


export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  toast.info(explain(state.url), 6000);
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

function explain(url: string): string {
  if (url.startsWith('/checkout')) {
    return 'Please log in or create an account to proceed to checkout.';
  }
  if (url.startsWith('/account')) {
    return 'Please sign in to view your account.';
  }
  return 'Please sign in to continue.';
}
```

### File: src/frontend/src/app/core/guards/seller.guard.ts
```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const sellerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = authService.user();
  
  if (user && (user.roles?.includes('Seller') || user.roles?.includes('SuperAdmin'))) {
    return true;
  }

  toastService.error('Unauthorized access. Seller privileges required.');
  return router.parseUrl('/');
};
```

### File: src/frontend/src/app/core/interceptors/auth.interceptor.ts
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
```

### File: src/frontend/src/app/core/interceptors/error.interceptor.ts
```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const silent = req.headers.has('X-Skip-Error-Toast');
  const cleaned = silent ? req.clone({ headers: req.headers.delete('X-Skip-Error-Toast') }) : req;

  return next(cleaned).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = describe(error);

      if (error.status === 401) {
        auth.clearSession();
        const current = router.url;
        
        const returnUrl = current.startsWith('/auth/') ? null : current;
        router.navigate(['/auth/login'], { queryParams: { returnUrl } });
      }

      if (!silent) {
        toast.error(message);
      }

      return throwError(() => error);
    })
  );
};

function describe(error: HttpErrorResponse): string {
  
  
  const fromApi = extractApiMessage(error);

  switch (true) {
    case error.status === 0:
      return navigator.onLine
        ? 'We couldn’t reach Budgetha’s servers. Please try again in a moment.'
        : 'You appear to be offline. Check your connection and try again.';
    case error.status === 400:
    case error.status === 422:
      return fromApi ?? 'Some of the details you entered aren’t quite right. Please review and try again.';
    case error.status === 401:
      return fromApi ?? 'Your session has expired. Please sign in again to continue.';
    case error.status === 403:
      return fromApi ?? 'You don’t have permission to do that.';
    case error.status === 404:
      return fromApi ?? 'We couldn’t find what you were looking for.';
    case error.status === 409:
      return fromApi ?? 'That conflicts with something that already exists.';
    case error.status === 429:
      return 'Too many attempts. Please wait a moment before trying again.';
    case error.status >= 500:
      return 'Something went wrong on our end. We’re on it — please try again shortly.';
    default:
      return fromApi ?? 'Something went wrong. Please try again.';
  }
}


function extractApiMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body) return null;
  if (typeof body === 'string') return body.trim() || null;

  if (Array.isArray(body.errors) && body.errors.length) {
    return String(body.errors[0]);
  }

  
  if (body.errors && typeof body.errors === 'object') {
    const first = Object.values(body.errors as Record<string, unknown>)
      .flat()
      .find(v => typeof v === 'string' && v.trim());
    if (first) return String(first);
  }

  return body.message || body.detail || body.title || null;
}
```

### File: src/frontend/src/app/core/mocks/info-pages.ts
```typescript

export interface InfoSection {
  heading: string;
  body: string[];
}

export interface InfoPage {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  
  updated?: string;
}

export const INFO_PAGES: Record<string, InfoPage> = {
  help: {
    eyebrow: 'Support',
    title: 'Help Center',
    intro: 'Answers to the questions we hear most. If you can’t find what you need, our team is one message away.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'Every order gets a confirmation email within a few minutes of checkout, including your order number and an itemised receipt.',
          'You can follow an order end to end from My Orders in your account — from payment confirmed through to delivered.',
          'Orders can be changed or cancelled free of charge until they enter fulfilment, which is usually within one hour of being placed.',
        ],
      },
      {
        heading: 'Payments',
        body: [
          'We accept all major credit and debit cards. Your card is authorised at checkout and only charged when your order ships.',
          'Card details are handled by our payment processor and never stored on Budgetha’s servers.',
          'Promo codes apply to the item subtotal before shipping and tax. One code per order.',
        ],
      },
      {
        heading: 'Accounts',
        body: [
          'Creating an account saves your addresses and payment methods, and keeps your order history and wishlist in one place.',
          'Forgot your password? Use the reset link on the sign-in page and we’ll email you a secure link.',
          'You can update your details or close your account at any time from Account Settings.',
        ],
      },
    ],
  },

  'shipping-returns': {
    eyebrow: 'Support',
    title: 'Shipping & Returns',
    intro: 'What it costs, how long it takes, and how to send something back if it isn’t right.',
    sections: [
      {
        heading: 'Shipping options',
        body: [
          'Standard shipping is $6.99 and arrives in 3–5 business days.',
          'Orders over $75 ship free — the discount is applied automatically at checkout.',
          'Express shipping is available at checkout for delivery within 1–2 business days.',
          'Orders placed before 2pm on a business day are dispatched the same day.',
        ],
      },
      {
        heading: 'Tracking your delivery',
        body: [
          'You’ll get a tracking link by email as soon as your parcel leaves the warehouse.',
          'The same link is always available from My Orders in your account.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'Return anything unused and in its original packaging within 30 days of delivery.',
          'Start a return from My Orders and we’ll email you a prepaid label.',
          'Refunds are issued to the original payment method within 5 business days of the parcel reaching us.',
          'For hygiene reasons, earphones and personal-care items can only be returned if the seal is unbroken.',
        ],
      },
    ],
  },

  warranty: {
    eyebrow: 'Support',
    title: 'Warranty',
    intro: 'Every item sold on Budgetha is covered against manufacturing defects.',
    sections: [
      {
        heading: 'What’s covered',
        body: [
          'All products carry a minimum 12-month warranty against defects in materials and workmanship.',
          'Selected electronics carry a 24-month manufacturer warranty — the term is listed on the product page.',
          'Warranty cover is in addition to, and does not replace, your statutory consumer rights.',
        ],
      },
      {
        heading: 'What’s not covered',
        body: [
          'Accidental damage, liquid damage, and normal cosmetic wear such as scratches and fading.',
          'Damage caused by unauthorised repair or modification.',
          'Consumable parts with a limited working life, such as batteries and filters, beyond their rated cycles.',
        ],
      },
      {
        heading: 'Making a claim',
        body: [
          'Open the order in My Orders and choose Report an issue, or contact us with your order number.',
          'Photos of the fault help us resolve claims faster.',
          'Approved claims are resolved by repair, replacement, or refund — whichever suits you best.',
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Support',
    title: 'Contact Us',
    intro: 'Real people, quick replies. Here’s the fastest way to reach the right team.',
    sections: [
      {
        heading: 'Customer support',
        body: [
          'Email support@budgetha.example and we’ll reply within one business day.',
          'Support hours are Monday to Friday, 9am–6pm, and Saturday, 10am–4pm.',
          'Include your order number and we’ll skip straight to the useful part.',
        ],
      },
      {
        heading: 'Orders and deliveries',
        body: [
          'For anything about a specific order, the quickest route is Report an issue on the order in My Orders — it reaches us with all the context attached.',
        ],
      },
      {
        heading: 'Selling on Budgetha',
        body: [
          'Interested in listing your products? Write to partners@budgetha.example with a short introduction and a link to your catalogue.',
        ],
      },
      {
        heading: 'Press and media',
        body: ['Media enquiries go to press@budgetha.example.'],
      },
    ],
  },

  'legal/privacy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated 1 July 2026',
    intro: 'How Budgetha collects, uses, and protects your personal information.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'Account information you give us: your name, email address, delivery addresses, and order history.',
          'Payment information is collected and processed by our payment provider. We receive only a token and the last four digits of your card.',
          'Usage information such as pages viewed and searches run, which we use to improve the storefront.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To process and deliver your orders, and to provide support when something goes wrong.',
          'To keep your account secure and detect fraudulent activity.',
          'To improve our products and recommendations. You can opt out of marketing email at any time from Account Settings.',
        ],
      },
      {
        heading: 'Sharing',
        body: [
          'We share the minimum necessary with delivery partners and payment processors to complete your order.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can request a copy of your data, correct it, or ask us to delete it by writing to privacy@budgetha.example.',
          'We keep order records for as long as tax and accounting rules require, even after an account is closed.',
        ],
      },
    ],
  },

  'legal/terms': {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    updated: 'Last updated 1 July 2026',
    intro: 'The terms you agree to when you shop with or create an account on Budgetha.',
    sections: [
      {
        heading: 'Using Budgetha',
        body: [
          'You must be at least 18 years old, or have the consent of a parent or guardian, to place an order.',
          'You are responsible for keeping your account credentials confidential and for activity that happens under your account.',
          'Don’t misuse the service — no scraping, interference with the platform, or attempts to access other people’s accounts.',
        ],
      },
      {
        heading: 'Orders and pricing',
        body: [
          'An order is an offer to buy. The contract forms when we send your dispatch confirmation.',
          'We work hard to keep prices and stock accurate. Where an obvious error occurs, we may cancel the order and refund you in full.',
          'Prices include applicable tax unless stated otherwise at checkout.',
        ],
      },
      {
        heading: 'Cancellation and returns',
        body: [
          'Our returns terms are set out on the Shipping & Returns page and form part of these terms.',
          'Nothing here limits your statutory rights as a consumer.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'We provide the service with reasonable care and skill, but we don’t guarantee uninterrupted availability.',
          'We are not liable for indirect or consequential loss to the extent permitted by law.',
        ],
      },
    ],
  },

  'legal/cookies': {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    updated: 'Last updated 1 July 2026',
    intro: 'Cookies and local storage keep your basket, session, and preferences working across visits.',
    sections: [
      {
        heading: 'Essential',
        body: [
          'These keep you signed in, remember what’s in your cart and wishlist, and protect checkout against fraud.',
          'The site cannot function without them, so they can’t be switched off.',
        ],
      },
      {
        heading: 'Preferences',
        body: [
          'Remember choices such as recently viewed products and whether you dismissed the install prompt.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'Aggregated, non-identifying data about which pages are used and where people run into trouble.',
          'We use it to prioritise what to fix and build next.',
        ],
      },
      {
        heading: 'Managing cookies',
        body: [
          'Every browser lets you review and delete cookies and site data in its settings.',
          'Blocking essential cookies will stop sign-in and checkout from working.',
        ],
      },
    ],
  },
};
```

### File: src/frontend/src/app/core/mocks/mock-products.ts
```typescript

export const BRANDS = ['AudioPeak', 'Vertex', 'NordicWear', 'LumenHome', 'PixelPro', 'UrbanKit'];

```

### File: src/frontend/src/app/core/models/auth.models.ts
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
```

### File: src/frontend/src/app/core/models/shop.models.ts
```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  approvalStatus?: string;
  isAvailableForRent?: boolean;
  rentalPricePerDay?: number;
}

export interface Review {
  id: string | number;
  author: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  isAuthor?: boolean;
}

export interface RatingBucket {
  stars: number;
  count: number;
  percent: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  color?: string;
  size?: string;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'shipping';
  value: number;
  description: string;
}

export interface Address {
  id: number;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: number;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault: boolean;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: number;
  number: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentSummary: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface CatalogQuery {
  search: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  totalPages: number;
}
```

### File: src/frontend/src/app/core/services/account.service.ts
```typescript
import { Injectable, effect, signal } from '@angular/core';
import { Address, PaymentCard } from '../models/shop.models';

const ADDRESS_KEY = 'budgetha_addresses_v2';
const CARDS_KEY = 'budgetha_cards_v2';

const SEED_ADDRESSES: Address[] = [];

const SEED_CARDS: PaymentCard[] = [];

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly _addresses = signal<Address[]>(this.load(ADDRESS_KEY, SEED_ADDRESSES));
  private readonly _cards = signal<PaymentCard[]>(this.load(CARDS_KEY, SEED_CARDS));

  readonly addresses = this._addresses.asReadonly();
  readonly cards = this._cards.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(this._addresses()));
      localStorage.setItem(CARDS_KEY, JSON.stringify(this._cards()));
    });
  }

  defaultAddress(): Address | undefined {
    return this._addresses().find(a => a.isDefault) ?? this._addresses()[0];
  }

  saveAddress(address: Omit<Address, 'id'> & { id?: number }): void {
    this._addresses.update(list => {
      let next = list.slice();
      if (address.isDefault) {
        next = next.map(a => ({ ...a, isDefault: false }));
      }
      if (address.id) {
        return next.map(a => (a.id === address.id ? ({ ...address, id: address.id } as Address) : a));
      }
      const id = Math.max(0, ...next.map(a => a.id)) + 1;
      return [...next, { ...address, id } as Address];
    });
  }

  deleteAddress(id: number): void {
    this._addresses.update(list => {
      const next = list.filter(a => a.id !== id);
      if (next.length && !next.some(a => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }

  setDefaultAddress(id: number): void {
    this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id })));
  }

  defaultCard(): PaymentCard | undefined {
    return this._cards().find(c => c.isDefault) ?? this._cards()[0];
  }

  saveCard(card: Omit<PaymentCard, 'id'> & { id?: number }): void {
    this._cards.update(list => {
      let next = list.slice();
      if (card.isDefault) {
        next = next.map(c => ({ ...c, isDefault: false }));
      }
      if (card.id) {
        return next.map(c => (c.id === card.id ? ({ ...card, id: card.id } as PaymentCard) : c));
      }
      const id = Math.max(0, ...next.map(c => c.id)) + 1;
      return [...next, { ...card, id } as PaymentCard];
    });
  }

  deleteCard(id: number): void {
    this._cards.update(list => {
      const next = list.filter(c => c.id !== id);
      if (next.length && !next.some(c => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }

  setDefaultCard(id: number): void {
    this._cards.update(list => list.map(c => ({ ...c, isDefault: c.id === id })));
  }

  private load<T>(key: string, seed: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : seed;
    } catch {
      return seed;
    }
  }
}
```

### File: src/frontend/src/app/core/services/admin.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionHistoryDto } from '../../features/admin/admin-logs.component';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
}

export interface SellerStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
  isBanned?: boolean;
}

export interface AdminUserProfile extends AdminUser {
  products: any[];
}

export interface AdminProductResult {
  items: any[];
  total: number;
  totalPages: number;
}

export interface PagedUserResult {
  items: AdminUser[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;
  private readonly rolesUrl = `${environment.apiUrl}/roles`;
  private readonly productsUrl = `${environment.apiUrl}/products`;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getSellerStats(): Observable<SellerStats> {
    return this.http.get<SellerStats>(`${this.apiUrl}/seller-stats`);
  }

  getRecentUsers(count: number = 5): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/recent-users?count=${count}`);
  }

  getAllUsers(page: number = 1, pageSize: number = 20): Observable<PagedUserResult> {
    return this.http.get<PagedUserResult>(`${this.apiUrl}/users?page=${page}&pageSize=${pageSize}`);
  }

  getAllProducts(page: number = 1, pageSize: number = 50): Observable<AdminProductResult> {
    return this.http.get<AdminProductResult>(`${this.apiUrl}/products?page=${page}&pageSize=${pageSize}`);
  }

  
  assignRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/assign`, { userId, role });
  }

  removeRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/remove`, { userId, role });
  }

  
  approveProduct(productId: string, status: 'Approved' | 'Rejected'): Observable<any> {
    return this.http.patch(`${this.productsUrl}/${productId}/approve`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}`);
  }

  
  getUserProfile(userId: string): Observable<AdminUserProfile> {
    return this.http.get<AdminUserProfile>(`${this.apiUrl}/users/${userId}/profile`);
  }

  banUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/ban`, {});
  }

  unbanUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/unban`, {});
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getTransactionHistory(type: string, startDate?: string, endDate?: string): Observable<TransactionHistoryDto[]> {
    let params = new HttpParams().set('type', type);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionHistoryDto[]>(`${environment.apiUrl}/orders/history`, { params });
  }

  getAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/announcements`);
  }
}
```

### File: src/frontend/src/app/core/services/announcement.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Announcement {
  id: string;
  message: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  created: string;
}

export interface CreateAnnouncementDto {
  message: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAnnouncementDto extends CreateAnnouncementDto {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5272/api/announcements';

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  getActive(): Observable<Announcement | null> {
    return this.http.get<Announcement | null>(`${this.apiUrl}/active`);
  }

  create(dto: CreateAnnouncementDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAnnouncementDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### File: src/frontend/src/app/core/services/auth.service.ts
```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5272/api/auth';
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';

  
  
  
  
  private readonly token = signal<string | null>(null);
  private readonly currentUser = signal<AuthResponse | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());
  readonly user = this.currentUser.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredSession();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email } as ForgotPasswordRequest);
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, token, newPassword } as ResetPasswordRequest);
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, { idToken } as GoogleLoginRequest).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  
  clearSession(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch {
      
    }
    this.token.set(null);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private handleAuth(response: AuthResponse): void {
    try {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response));
    } catch {
      
    }
    this.token.set(response.token);
    this.currentUser.set(response);
  }

  private loadStoredSession(): void {
    let token: string | null = null;
    let stored: string | null = null;

    try {
      token = localStorage.getItem(this.tokenKey);
      stored = localStorage.getItem(this.userKey);
    } catch {
      return;
    }

    if (!token) {
      
      if (stored) this.clearSession();
      return;
    }

    this.token.set(token);

    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored) as AuthResponse);
      } catch {
        
        try { localStorage.removeItem(this.userKey); } catch {  }
        this.currentUser.set(null);
      }
    }
  }
}
```

### File: src/frontend/src/app/core/services/cart.service.ts
```typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Product, PromoCode } from '../models/shop.models';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'budgetha_cart';
const PROMO_KEY = 'budgetha_promo';

export const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'SAVE20', type: 'percent', value: 20, description: '20% off your order' },
  { code: 'FREESHIP', type: 'shipping', value: 0, description: 'Free shipping' },
];

export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_SHIPPING = 6.99;
export const TAX_RATE = 0.08;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.load());
  private readonly _promo = signal<PromoCode | null>(this.loadPromo());
  private readonly _drawerOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly promo = this._promo.asReadonly();
  readonly drawerOpen = this._drawerOpen.asReadonly();

  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, i) => sum + i.price * i.quantity, 0));
  readonly discount = computed(() => {
    const promo = this._promo();
    if (!promo || promo.type !== 'percent') return 0;
    return (this.subtotal() * promo.value) / 100;
  });
  readonly shipping = computed(() => {
    if (this._items().length === 0) return 0;
    if (this._promo()?.type === 'shipping') return 0;
    return this.subtotal() - this.discount() >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  });
  readonly tax = computed(() => (this.subtotal() - this.discount()) * TAX_RATE);
  readonly total = computed(() => this.subtotal() - this.discount() + this.shipping() + this.tax());
  readonly amountToFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - (this.subtotal() - this.discount()))
  );

  constructor(private toast: ToastService) {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      const promo = this._promo();
      if (promo) {
        localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    });
  }

  add(product: Product, quantity = 1, color?: string, size?: string): void {
    this._items.update(items => {
      const existing = items.find(
        i => i.productId === product.id && i.color === color && i.size === size
      );
      if (existing) {
        return items.map(i =>
          i === existing ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) } : i
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          image: product.images[0],
          price: product.price,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          color,
          size,
        },
      ];
    });
    this.toast.success(`${product.name} added to cart`);
    this.openDrawer();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.remove(item);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productId === item.productId && i.color === item.color && i.size === item.size
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  }

  remove(item: CartItem): void {
    this._items.update(items =>
      items.filter(
        i => !(i.productId === item.productId && i.color === item.color && i.size === item.size)
      )
    );
  }

  clear(): void {
    this._items.set([]);
    this._promo.set(null);
  }

  applyPromo(code: string): boolean {
    const promo = PROMO_CODES.find(p => p.code === code.trim().toUpperCase());
    if (promo) {
      this._promo.set(promo);
      this.toast.success(`Promo applied — ${promo.description}`);
      return true;
    }
    return false;
  }

  removePromo(): void {
    this._promo.set(null);
  }

  openDrawer(): void {
    this._drawerOpen.set(true);
  }

  closeDrawer(): void {
    this._drawerOpen.set(false);
  }

  private load(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private loadPromo(): PromoCode | null {
    try {
      return JSON.parse(localStorage.getItem(PROMO_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
```

### File: src/frontend/src/app/core/services/cloudinary.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly http = inject(HttpClient);
  
  
  private readonly uploadEndpoint = 'http://localhost:5272/api/images/upload';

  
  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<CloudinaryUploadResponse>(this.uploadEndpoint, formData);
  }
}
```

### File: src/frontend/src/app/core/services/order.service.ts
```typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { Address, CartItem, Order, OrderStatus, PromoCode } from '../models/shop.models';

const STORAGE_KEY = 'budgetha_orders_v2';

const SEED_ORDERS: Order[] = [];

export interface PlaceOrderInput {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  address: Address;
  paymentSummary: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(this.load());

  readonly orders = computed(() =>
    this._orders().slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  );

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._orders())));
  }

  getByNumber(orderNumber: string): Order | undefined {
    return this._orders().find(o => o.number === orderNumber);
  }

  placeOrder(input: PlaceOrderInput): Order {
    const id = Math.max(0, ...this._orders().map(o => o.id)) + 1;
    const order: Order = {
      id,
      number: `BGT-2026-${String(600 + id * 7).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Processing' as OrderStatus,
      items: input.items.map(i => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      })),
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
      shippingAddress: `${input.address.line1}${input.address.line2 ? ', ' + input.address.line2 : ''}, ${input.address.city}, ${input.address.state} ${input.address.zip}`,
      paymentSummary: input.paymentSummary,
    };
    this._orders.update(orders => [...orders, order]);
    return order;
  }

  private load(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  }
}
```

### File: src/frontend/src/app/core/services/product.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BRANDS } from '../mocks/mock-products';
import {
  CatalogQuery,
  CatalogResult,
  Category,
  Product,
  RatingBucket,
  Review,
} from '../models/shop.models';



@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5272/api';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(err => {
        console.error('Failed to fetch categories', err);
        return of([]);
      })
    );
  }

  createCategory(category: { name: string, slug: string, description?: string, imageUrl?: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, category: { id: string, name: string, slug: string, imageUrl?: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/categories/${id}`, category);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/brands`).pipe(
      catchError(err => {
        console.error('Failed to fetch brands', err);
        return of([]);
      })
    );
  }

  getAll(): Observable<Product[]> {
    return this.query({ page: 1, pageSize: 100, minPrice: 0, maxPrice: 1000000, minRating: 0 } as CatalogQuery).pipe(map(res => res?.items || []));
  }

  getFeatured(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isFeatured)));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isNew)));
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}`).pipe(
      catchError(err => {
        console.error(`Failed to fetch product ${slug}`, err);
        throw err; 
      })
    );
  }

  getRelated(product: Product, count = 4): Observable<Product[]> {
    return this.getAll().pipe(
      map(items => {
        const sameCategory = items.filter(p => p.id !== product.id && p.category === product.category);
        const others = items.filter(p => p.id !== product.id && p.category !== product.category);
        return [...sameCategory, ...others].slice(0, count);
      })
    );
  }

  priceBounds(): Observable<{ min: number; max: number }> {
    return this.getAll().pipe(
      map(items => {
        if (!items || items.length === 0) {
          return { min: 0, max: 1000 };
        }
        const prices = items.map(p => p.price);
        return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
      })
    );
  }

  query(q: CatalogQuery): Observable<CatalogResult> {
    let params: any = {
      page: q.page,
      pageSize: q.pageSize
    };
    if (q.search) params.search = q.search;
    if (q.minPrice) params.minPrice = q.minPrice;
    if (q.maxPrice) params.maxPrice = q.maxPrice;
    if (q.minRating) params.minRating = q.minRating;
    if (q.sort) params.sort = q.sort;

    let qs = new URLSearchParams(params).toString();
    if (q.categories && q.categories.length) {
      q.categories.forEach(c => qs += `&categories=${encodeURIComponent(c)}`);
    }
    if (q.brands && q.brands.length) {
      q.brands.forEach(b => qs += `&brands=${encodeURIComponent(b)}`);
    }

    return this.http.get<CatalogResult>(`${this.apiUrl}/products?${qs}`).pipe(
      catchError(err => {
        console.error('Failed to query products', err);
        return of({ items: [], total: 0, totalPages: 1 } as CatalogResult);
      })
    );
  }


}
```

### File: src/frontend/src/app/core/services/pwa.service.ts
```typescript
import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { ToastService } from './toast.service';


interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'budgetha:install-dismissed';


@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly toast = inject(ToastService);
  private readonly swUpdate = inject(SwUpdate, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  private readonly promptAvailable = signal(false);
  private readonly installed = signal(false);
  private readonly dismissed = signal(readDismissed());

  readonly online = signal(true);

  
  readonly canInstall = computed(() => this.promptAvailable() && !this.installed() && !this.dismissed());

  
  readonly showInstallAffordance = computed(() => !this.installed() && !this.dismissed());

  
  readonly isStandalone = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    this.online.set(navigator.onLine);
    this.isStandalone.set(detectStandalone());
    this.installed.set(detectStandalone());

    const onBeforeInstall = (event: Event) => {
      
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.promptAvailable.set(true);
    };

    const onInstalled = () => {
      this.deferredPrompt = null;
      this.promptAvailable.set(false);
      this.installed.set(true);
      this.toast.success('Budgetha is installed. Look for it alongside your other apps.');
    };

    const onOnline = () => {
      this.online.set(true);
      this.toast.success('You’re back online.');
    };

    const onOffline = () => {
      this.online.set(false);
      this.toast.warning('You’re offline. You can keep browsing pages you’ve already visited.', { duration: 0 });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    });

    this.watchForUpdates();
  }

  
  async install(): Promise<boolean> {
    const prompt = this.deferredPrompt;

    if (!prompt) {
      
      this.toast.info(installHint(), { duration: 8000 });
      return false;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;

      
      this.deferredPrompt = null;
      this.promptAvailable.set(false);

      if (outcome === 'accepted') return true;

      this.dismissInstall();
      return false;
    } catch {
      this.deferredPrompt = null;
      this.promptAvailable.set(false);
      this.toast.error('We couldn’t open the install dialog. Try your browser’s menu instead.');
      return false;
    }
  }

  
  dismissInstall(): void {
    this.dismissed.set(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      
    }
  }

  private watchForUpdates(): void {
    if (!this.swUpdate?.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.toast.info('A new version of Budgetha is ready.', {
          duration: 0,
          action: {
            label: 'Reload now',
            handler: () => this.swUpdate!.activateUpdate().then(() => document.location.reload()),
          },
        });
      });

    
    this.swUpdate.unrecoverable.subscribe(() => {
      this.toast.error('Budgetha needs to reload to recover from a caching problem.', {
        duration: 0,
        action: { label: 'Reload', handler: () => document.location.reload() },
      });
    });
  }
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return window.matchMedia?.('(display-mode: standalone)').matches === true || iosStandalone;
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function installHint(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'To install Budgetha: tap Share, then “Add to Home Screen”.';
  }
  if (/Firefox/i.test(ua)) {
    return 'To install Budgetha: open the Firefox menu and choose “Install”.';
  }
  return 'To install Budgetha: open your browser menu and choose “Install app”.';
}
```

### File: src/frontend/src/app/core/services/quick-view.service.ts
```typescript
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/shop.models';

@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly _product = signal<Product | null>(null);
  readonly product = this._product.asReadonly();

  open(product: Product): void {
    this._product.set(product);
  }

  close(): void {
    this._product.set(null);
  }
}
```

### File: src/frontend/src/app/core/services/review.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/shop.models';

export interface AddReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  reviewId: string;
  rating: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5272/api/reviews';

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}`);
  }

  addReview(dto: AddReviewDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  updateReview(id: string, dto: UpdateReviewDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### File: src/frontend/src/app/core/services/toast.service.ts
```typescript
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  
  action?: ToastAction;
}

export interface ToastOptions {
  
  duration?: number;
  action?: ToastAction;
}


const MAX_VISIBLE = 4;

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 4500,
  warning: 5000,
  error: 6500,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', options: ToastOptions | number = {}): number {
    
    const opts: ToastOptions = typeof options === 'number' ? { duration: options } : options;
    const duration = opts.duration ?? DEFAULT_DURATION[type];
    const id = this.nextId++;

    this.toasts.update(current => {
      
      const deduped = current.filter(t => !(t.message === message && t.type === type));
      const next = [...deduped, { id, message, type, action: opts.action }];
      const overflow = next.slice(0, Math.max(0, next.length - MAX_VISIBLE));
      overflow.forEach(t => this.clearTimer(t.id));
      return next.slice(-MAX_VISIBLE);
    });

    if (duration > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }

    return id;
  }

  success(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'warning', options);
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear(): void {
    this.timers.forEach(handle => clearTimeout(handle));
    this.timers.clear();
    this.toasts.set([]);
  }

  private clearTimer(id: number): void {
    const handle = this.timers.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.timers.delete(id);
    }
  }
}
```

### File: src/frontend/src/app/core/services/wishlist.service.ts
```typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'budgetha_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _ids = signal<string[]>(this.load());

  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  constructor(private toast: ToastService) {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._ids())));
  }

  has(productId: string): boolean {
    return this._ids().includes(productId);
  }

  toggle(productId: string, productName?: string): void {
    if (this.has(productId)) {
      this._ids.update(ids => ids.filter(id => id !== productId));
      if (productName) this.toast.info(`${productName} removed from wishlist`);
    } else {
      this._ids.update(ids => [...ids, productId]);
      if (productName) this.toast.success(`${productName} saved to wishlist`);
    }
  }

  private load(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch { }
    return [];
  }
}
```

### File: src/frontend/src/app/features/account/account-addresses.component.ts
```typescript
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ToastService } from '../../core/services/toast.service';
import { Address } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-addresses',
  imports: [ReactiveFormsModule, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="card overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Saved Addresses</h2>
            <p class="text-sm text-slate-400 mt-0.5">Manage your delivery destinations</p>
          </div>
          <button type="button" (click)="startAdd()" class="btn-primary px-4 py-2.5 text-sm gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
            Add Address
          </button>
        </div>

        @if (account.addresses().length === 0 && !formVisible()) {
          <app-empty-state
            icon="address"
            title="No saved addresses"
            message="Save an address to breeze through checkout — your default will be pre-filled automatically." />
        } @else {
          <div class="grid sm:grid-cols-2 gap-4 p-6">
            @for (address of account.addresses(); track address.id) {
              <div class="rounded-2xl border p-5 transition-all duration-300"
                   [class]="address.isDefault ? 'border-violet-300 bg-violet-50/40 ring-1 ring-violet-100' : 'border-slate-200 hover:border-slate-300'">
                <div class="flex items-start justify-between">
                  <span class="badge" [class]="address.isDefault ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'">
                    {{ address.label }}
                  </span>
                  @if (address.isDefault) {
                    <span class="text-[11px] font-bold text-violet-600 uppercase tracking-wider">Default</span>
                  }
                </div>
                <p class="mt-3 font-bold text-slate-900 text-sm">{{ address.fullName }}</p>
                <p class="mt-1 text-sm text-slate-500 leading-relaxed">
                  {{ address.line1 }}@if (address.line2) {<br />{{ address.line2 }}}<br />
                  {{ address.city }}, {{ address.state }} {{ address.zip }}<br />
                  {{ address.country }}
                </p>
                <p class="mt-1.5 text-xs text-slate-400">{{ address.phone }}</p>
                <div class="mt-4 flex items-center gap-3 text-xs font-semibold">
                  <button type="button" (click)="startEdit(address)" class="text-violet-600 hover:text-violet-500 transition-colors duration-300">Edit</button>
                  @if (!address.isDefault) {
                    <button type="button" (click)="account.setDefaultAddress(address.id)" class="text-slate-500 hover:text-slate-700 transition-colors duration-300">Set default</button>
                  }
                  <button type="button" (click)="remove(address)" class="text-rose-500 hover:text-rose-400 transition-colors duration-300 ml-auto">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Add / edit form -->
      @if (formVisible()) {
        <form [formGroup]="form" (ngSubmit)="save()" class="card p-6">
          <h3 class="text-base font-bold text-slate-900 mb-5">{{ editingId() ? 'Edit address' : 'New address' }}</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="addr-label" class="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
              <input id="addr-label" type="text" formControlName="label" placeholder="Home, Office…" class="input-field" [class.input-error]="invalid('label')" />
              @if (invalid('label')) { <p class="mt-1.5 text-xs text-red-500">Label is required.</p> }
            </div>
            <div>
              <label for="addr-name" class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input id="addr-name" type="text" formControlName="fullName" autocomplete="name" class="input-field" [class.input-error]="invalid('fullName')" />
              @if (invalid('fullName')) { <p class="mt-1.5 text-xs text-red-500">Full name is required.</p> }
            </div>
            <div class="sm:col-span-2">
              <label for="addr-line1" class="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
              <input id="addr-line1" type="text" formControlName="line1" autocomplete="address-line1" class="input-field" [class.input-error]="invalid('line1')" />
              @if (invalid('line1')) { <p class="mt-1.5 text-xs text-red-500">Street address is required.</p> }
            </div>
            <div class="sm:col-span-2">
              <label for="addr-line2" class="block text-sm font-medium text-slate-700 mb-1.5">Apartment, suite, etc. <span class="text-slate-400 font-normal">(optional)</span></label>
              <input id="addr-line2" type="text" formControlName="line2" autocomplete="address-line2" class="input-field" />
            </div>
            <div>
              <label for="addr-city" class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input id="addr-city" type="text" formControlName="city" autocomplete="address-level2" class="input-field" [class.input-error]="invalid('city')" />
              @if (invalid('city')) { <p class="mt-1.5 text-xs text-red-500">City is required.</p> }
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="addr-state" class="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input id="addr-state" type="text" formControlName="state" autocomplete="address-level1" class="input-field" [class.input-error]="invalid('state')" />
                @if (invalid('state')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
              </div>
              <div>
                <label for="addr-zip" class="block text-sm font-medium text-slate-700 mb-1.5">ZIP</label>
                <input id="addr-zip" type="text" formControlName="zip" autocomplete="postal-code" class="input-field" [class.input-error]="invalid('zip')" />
                @if (invalid('zip')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
              </div>
            </div>
            <div>
              <label for="addr-country" class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
              <select id="addr-country" formControlName="country" class="input-field">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>Australia</option>
                <option>United Arab Emirates</option>
                <option>Saudi Arabia</option>
                <option>Jordan</option>
              </select>
            </div>
            <div>
              <label for="addr-phone" class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input id="addr-phone" type="tel" formControlName="phone" autocomplete="tel" class="input-field" [class.input-error]="invalid('phone')" />
              @if (invalid('phone')) { <p class="mt-1.5 text-xs text-red-500">Phone is required.</p> }
            </div>
            <label class="sm:col-span-2 flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isDefault" class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30" />
              <span class="text-sm text-slate-600">Set as my default address</span>
            </label>
          </div>
          <div class="mt-6 flex gap-3">
            <button type="submit" class="btn-primary">{{ editingId() ? 'Save changes' : 'Add address' }}</button>
            <button type="button" (click)="cancel()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AccountAddressesComponent {
  readonly account = inject(AccountService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.group({
    label: ['', Validators.required],
    fullName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['United States', Validators.required],
    phone: ['', Validators.required],
    isDefault: [false],
  });

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  startAdd(): void {
    this.editingId.set(null);
    this.submitted.set(false);
    this.form.reset({ country: 'United States', isDefault: this.account.addresses().length === 0 });
    this.formVisible.set(true);
  }

  startEdit(address: Address): void {
    this.editingId.set(address.id);
    this.submitted.set(false);
    this.form.patchValue({ ...address, line2: address.line2 ?? '' });
    this.formVisible.set(true);
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.account.saveAddress({
      id: this.editingId() ?? undefined,
      label: v.label!,
      fullName: v.fullName!,
      line1: v.line1!,
      line2: v.line2 || undefined,
      city: v.city!,
      state: v.state!,
      zip: v.zip!,
      country: v.country!,
      phone: v.phone!,
      isDefault: !!v.isDefault,
    });
    this.toast.success(this.editingId() ? 'Address updated' : 'Address added');
    this.cancel();
  }

  remove(address: Address): void {
    this.account.deleteAddress(address.id);
    this.toast.info(`Address “${address.label}” deleted`);
  }

  cancel(): void {
    this.formVisible.set(false);
    this.editingId.set(null);
    this.submitted.set(false);
  }
}
```

### File: src/frontend/src/app/features/account/account-layout.component.ts
```typescript
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Account</h1>

      <div class="mt-8 grid lg:grid-cols-4 gap-8 items-start">
        <!-- ══ Sidebar ══ -->
        <aside class="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
          <!-- Profile card -->
          <div class="card p-5 flex items-center gap-4">
            <span class="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-lg font-bold flex items-center justify-center shrink-0">
              {{ initials() }}
            </span>
            <div class="min-w-0">
              <p class="font-bold text-slate-900 truncate">{{ fullName() }}</p>
              <p class="text-xs text-slate-400 truncate">{{ auth.user()?.email }}</p>
            </div>
          </div>

          <!-- Nav -->
          <nav class="card p-2" aria-label="Account">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-violet-50 text-violet-700 font-semibold"
                class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors duration-200">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                </svg>
                {{ item.label }}
              </a>
            }
            <button
              type="button"
              (click)="auth.logout()"
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors duration-200 mt-1 border-t border-slate-100">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </nav>
        </aside>

        <!-- ══ Content ══ -->
        <div class="lg:col-span-3 min-w-0">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AccountLayoutComponent {
  readonly auth = inject(AuthService);

  readonly navItems = [
    {
      label: 'Order History',
      path: '/account/orders',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
    },
    {
      label: 'Saved Addresses',
      path: '/account/addresses',
      icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    },

    {
      label: 'Account Settings',
      path: '/account/settings',
      icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ];

  readonly fullName = computed(() => {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}`.trim() || u.email : 'Guest';
  });

  readonly initials = computed(() => {
    const u = this.auth.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || u.email[0].toUpperCase();
  });
}
```

### File: src/frontend/src/app/features/account/account-orders.component.ts
```typescript
import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-orders',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet, EmptyStateComponent],
  template: `
    <div class="card overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Order History</h2>
          <p class="text-sm text-slate-400 mt-0.5">{{ orders().length }} orders placed</p>
        </div>
      </div>

      @if (orders().length === 0) {
        <app-empty-state
          icon="orders"
          title="No orders found"
          message="You haven't placed any orders yet. When you do, they'll show up here with live status tracking."
          ctaLabel="Start Shopping"
          ctaLink="/shop" />
      } @else {
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                <th class="px-6 py-3.5">Order</th>
                <th class="px-6 py-3.5">Date</th>
                <th class="px-6 py-3.5">Items</th>
                <th class="px-6 py-3.5">Total</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (order of orders(); track order.id) {
                <tr class="hover:bg-violet-50/40 transition-colors duration-200">
                  <td class="px-6 py-4 font-bold text-slate-900">{{ order.number }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ order.date | date: 'MMM d, y' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex -space-x-2.5">
                      @for (item of order.items.slice(0, 3); track item.productId) {
                        <img [src]="item.image" [alt]="item.name" class="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                      }
                      @if (order.items.length > 3) {
                        <span class="h-9 w-9 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[11px] font-bold text-slate-500">
                          +{{ order.items.length - 3 }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-slate-900">{{ order.total | currency }}</td>
                  <td class="px-6 py-4">
                    <span class="badge" [class]="statusClasses(order.status)">
                      <span class="h-1.5 w-1.5 rounded-full" [class]="dotClasses(order.status)"></span>
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      type="button"
                      (click)="toggleExpand(order.id)"
                      [attr.aria-expanded]="expandedId() === order.id"
                      class="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                      {{ expandedId() === order.id ? 'Hide' : 'View' }}
                    </button>
                  </td>
                </tr>
                @if (expandedId() === order.id) {
                  <tr>
                    <td colspan="6" class="bg-slate-50/60 px-6 py-5">
                      <ng-container *ngTemplateOutlet="orderDetail; context: { $implicit: order }"></ng-container>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden divide-y divide-slate-100">
          @for (order of orders(); track order.id) {
            <div class="p-5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-sm">{{ order.number }}</span>
                <span class="badge" [class]="statusClasses(order.status)">
                  <span class="h-1.5 w-1.5 rounded-full" [class]="dotClasses(order.status)"></span>
                  {{ order.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="text-slate-400">{{ order.date | date: 'MMM d, y' }}</span>
                <span class="font-bold text-slate-900">{{ order.total | currency }}</span>
              </div>
              <button
                type="button"
                (click)="toggleExpand(order.id)"
                class="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                {{ expandedId() === order.id ? 'Hide details' : 'View details' }}
              </button>
              @if (expandedId() === order.id) {
                <div class="mt-4">
                  <ng-container *ngTemplateOutlet="orderDetail; context: { $implicit: order }"></ng-container>
                </div>
              }
            </div>
          }
        </div>

        <!-- Shared order detail template -->
        <ng-template #orderDetail let-order>
          <div class="space-y-3">
            @for (item of order.items; track item.productId + (item.color ?? '')) {
              <div class="flex items-center gap-3.5">
                <img [src]="item.image" [alt]="item.name" class="h-14 w-14 rounded-xl object-cover bg-slate-100" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                  <p class="text-xs text-slate-400">
                    Qty {{ item.quantity }}{{ item.color ? ' · ' + item.color : '' }}{{ item.size ? ' · ' + item.size : '' }}
                  </p>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
              </div>
            }
            <div class="pt-3 border-t border-slate-200 grid sm:grid-cols-2 gap-3 text-xs text-slate-500">
              <p><span class="font-semibold text-slate-700">Ships to:</span> {{ order.shippingAddress }}</p>
              <p><span class="font-semibold text-slate-700">Payment:</span> {{ order.paymentSummary }}</p>
            </div>
          </div>
        </ng-template>
      }
    </div>
  `,
})
export class AccountOrdersComponent {
  private readonly orderService = inject(OrderService);

  readonly orders = this.orderService.orders;
  readonly expandedId = signal<number | null>(null);

  toggleExpand(id: number): void {
    this.expandedId.update(current => (current === id ? null : id));
  }

  statusClasses(status: OrderStatus): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
      case 'Shipped':
        return 'bg-sky-50 text-sky-700 ring-1 ring-sky-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 ring-1 ring-rose-100';
    }
  }

  dotClasses(status: OrderStatus): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500';
      case 'Shipped':
        return 'bg-sky-500';
      case 'Processing':
        return 'bg-amber-500 animate-pulse';
      case 'Cancelled':
        return 'bg-rose-500';
    }
  }
}
```

### File: src/frontend/src/app/features/account/account-settings.component.ts
```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Profile -->
      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Profile</h2>
        <p class="text-sm text-slate-400 mt-0.5">This information appears on your receipts and shipping labels</p>

        <div class="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
            <input id="firstName" type="text" formControlName="firstName" autocomplete="given-name" class="input-field"
                   [class.input-error]="invalid(profileForm, 'firstName')" />
            @if (invalid(profileForm, 'firstName')) { <p class="mt-1.5 text-xs text-red-500">First name is required.</p> }
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
            <input id="lastName" type="text" formControlName="lastName" autocomplete="family-name" class="input-field"
                   [class.input-error]="invalid(profileForm, 'lastName')" />
            @if (invalid(profileForm, 'lastName')) { <p class="mt-1.5 text-xs text-red-500">Last name is required.</p> }
          </div>
          <div class="sm:col-span-2">
            <label for="settings-email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input id="settings-email" type="email" formControlName="email" autocomplete="email" class="input-field bg-slate-100/70 cursor-not-allowed" readonly />
            <p class="mt-1.5 text-xs text-slate-400">Contact support to change the email tied to your account.</p>
          </div>
        </div>
        <button type="submit" class="btn-primary mt-6">Save changes</button>
      </form>

      <!-- Password -->
      <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Change Password</h2>
        <p class="text-sm text-slate-400 mt-0.5">Use at least 6 characters with a mix of letters and numbers</p>

        <div class="mt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Current password</label>
            <input id="currentPassword" type="password" formControlName="current" autocomplete="current-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'current')" />
            @if (invalid(passwordForm, 'current')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
            <input id="newPassword" type="password" formControlName="next" autocomplete="new-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'next')" />
            @if (invalid(passwordForm, 'next')) { <p class="mt-1.5 text-xs text-red-500">At least 6 characters.</p> }
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input id="confirmPassword" type="password" formControlName="confirm" autocomplete="new-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'confirm') || mismatch()" />
            @if (mismatch()) { <p class="mt-1.5 text-xs text-red-500">Passwords don't match.</p> }
          </div>
        </div>
        <button type="submit" class="btn-primary mt-6">Update password</button>
      </form>

      <!-- Notifications -->
      <div class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Notifications</h2>
        <p class="text-sm text-slate-400 mt-0.5">Choose what we email you about</p>
        <div class="mt-5 divide-y divide-slate-100">
          @for (pref of notificationPrefs(); track pref.key) {
            <div class="flex items-center justify-between py-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ pref.label }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ pref.description }}</p>
              </div>
              <button
                type="button"
                role="switch"
                [attr.aria-checked]="pref.enabled"
                [attr.aria-label]="'Toggle ' + pref.label"
                (click)="togglePref(pref.key)"
                class="relative h-6 w-11 rounded-full transition-colors duration-300 shrink-0"
                [class]="pref.enabled ? 'bg-violet-600' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300"
                      [class]="pref.enabled ? 'left-[1.375rem]' : 'left-0.5'"></span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Seller Account -->
      <div class="card p-6 border-indigo-100">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold text-slate-900">Seller Account</h2>
            @if (isSeller()) {
              <p class="text-sm text-slate-500 mt-1">You are already a registered seller! You can access the Seller Dashboard from the menu.</p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Seller Active
              </div>
            } @else if (sellerRequestStatus() === 'Pending') {
              <p class="text-sm text-slate-500 mt-1">Your request to become a seller is currently under review by our team.</p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Request Pending
              </div>
            } @else {
              <p class="text-sm text-slate-500 mt-1">Want to sell your own products? Apply for a seller account today and reach thousands of customers.</p>
              
              @if (isRequestingSeller()) {
                <div class="mt-4 space-y-3">
                  <textarea [(ngModel)]="sellerRequestReason" rows="3" placeholder="Tell us briefly about what you plan to sell..."
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none text-sm"></textarea>
                  <div class="flex items-center gap-3">
                    <button type="button" (click)="submitSellerRequest()" [disabled]="submittingSellerRequest()"
                            class="btn-primary py-2 px-5 text-sm">
                      {{ submittingSellerRequest() ? 'Submitting...' : 'Submit Request' }}
                    </button>
                    <button type="button" (click)="isRequestingSeller.set(false)" class="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                  </div>
                </div>
              } @else {
                <button type="button" (click)="isRequestingSeller.set(true)"
                        class="mt-4 inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5
                               text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all duration-300">
                  Request Seller Account
                </button>
              }
            }
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card p-6 border-rose-100">
        <h2 class="text-lg font-bold text-rose-600">Danger Zone</h2>
        <p class="text-sm text-slate-400 mt-0.5">Permanently delete your account and all associated data</p>
        <button type="button" (click)="requestDelete()"
                class="mt-5 inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3
                       text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-all duration-300">
          Delete my account
        </button>
      </div>
    </div>
  `,
})
export class AccountSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly http = inject(HttpClient);

  readonly profileSubmitted = signal(false);
  readonly passwordSubmitted = signal(false);

  readonly profileForm = this.fb.group({
    firstName: [this.auth.user()?.firstName ?? '', Validators.required],
    lastName: [this.auth.user()?.lastName ?? '', Validators.required],
    email: [{ value: this.auth.user()?.email ?? '', disabled: false }],
  });

  readonly passwordForm = this.fb.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  });

  readonly notificationPrefs = signal([
    { key: 'orders', label: 'Order updates', description: 'Shipping confirmations and delivery notifications', enabled: true },
    { key: 'deals', label: 'Deals & promotions', description: 'Weekly digest of price drops and exclusive codes', enabled: true },
    { key: 'wishlist', label: 'Wishlist alerts', description: 'When a saved item goes on sale or is back in stock', enabled: false },
  ]);

  readonly isSeller = signal(false);
  readonly sellerRequestStatus = signal<'None' | 'Pending' | 'Rejected'>('None');
  readonly isRequestingSeller = signal(false);
  sellerRequestReason = '';
  readonly submittingSellerRequest = signal(false);

  ngOnInit() {
    this.checkSellerStatus();
  }

  checkSellerStatus() {
    const roles = this.auth.user()?.roles || [];
    this.isSeller.set(roles.includes('Seller'));
  }

  submitSellerRequest() {
    this.submittingSellerRequest.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests`, { reason: this.sellerRequestReason }).subscribe({
      next: () => {
        this.toast.success('Your request to become a seller has been submitted!');
        this.sellerRequestStatus.set('Pending');
        this.isRequestingSeller.set(false);
        this.submittingSellerRequest.set(false);
      },
      error: () => {
        this.toast.error('Failed to submit request.');
        this.submittingSellerRequest.set(false);
      }
    });
  }

  invalid(form: FormGroup, control: string): boolean {
    const c = form.get(control);
    const submitted = form === this.profileForm ? this.profileSubmitted() : this.passwordSubmitted();
    return !!c && c.invalid && (c.touched || submitted);
  }

  mismatch(): boolean {
    const { next, confirm } = this.passwordForm.getRawValue();
    return !!confirm && next !== confirm && (this.passwordForm.get('confirm')!.touched || this.passwordSubmitted());
  }

  saveProfile(): void {
    this.profileSubmitted.set(true);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.toast.success('Profile updated');
  }

  changePassword(): void {
    this.passwordSubmitted.set(true);
    if (this.passwordForm.invalid || this.mismatch()) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordForm.reset();
    this.passwordSubmitted.set(false);
    this.toast.success('Password changed successfully');
  }

  togglePref(key: string): void {
    this.notificationPrefs.update(prefs =>
      prefs.map(p => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    );
  }

  requestDelete(): void {
    this.toast.info('Account deletion requires email confirmation — check your inbox.');
  }
}
```

### File: src/frontend/src/app/features/admin/admin-add-product.component.ts
```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { ProductService } from '../../core/services/product.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { Category } from '../../core/models/shop.models';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-add-product',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ isEditMode() ? 'Update your product listing details.' : 'Create a new product listing. It will be immediately published to the catalog.' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 md:p-8 space-y-8">
          
          <!-- Basic Info -->
          <div class="space-y-6">
            <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="name" class="block text-sm font-semibold text-slate-700">Product Name <span class="text-rose-500">*</span></label>
                <input type="text" id="name" formControlName="name" placeholder="e.g. Wireless Noise-Cancelling Headphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400">
              </div>

              <div class="space-y-2">
                <label for="categoryId" class="block text-sm font-semibold text-slate-700">Category <span class="text-rose-500">*</span></label>
                <select id="categoryId" formControlName="categoryId"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                  <option value="" disabled selected>Select a category</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="brand" class="block text-sm font-semibold text-slate-700">Brand <span class="text-rose-500">*</span></label>
                <input type="text" id="brand" formControlName="brand" placeholder="e.g. Sony, Samsung, Nike"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400">
              </div>
            </div>

            <div class="space-y-2">
              <label for="description" class="block text-sm font-semibold text-slate-700">Description <span class="text-rose-500">*</span></label>
              <textarea id="description" formControlName="description" rows="4" placeholder="Describe your product in detail..."
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none"></textarea>
            </div>
          </div>

          <!-- Pricing & Inventory -->
          <div class="space-y-6">
            <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Pricing & Inventory</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="price" class="block text-sm font-semibold text-slate-700">Price ($) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="price" formControlName="price" min="0" step="0.01" placeholder="0.00"
                         class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2">
                <label for="originalPrice" class="block text-sm font-semibold text-slate-700">Original Price ($) <span class="text-xs text-slate-500 font-normal">(Optional - for discounts)</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="originalPrice" formControlName="originalPrice" min="0" step="0.01" placeholder="0.00"
                         class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="stockQuantity" class="block text-sm font-semibold text-slate-700">Stock Quantity <span class="text-rose-500">*</span></label>
                <input type="number" id="stockQuantity" formControlName="stockQuantity" min="0" placeholder="0"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>
          </div>

          <!-- Rentals -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-base font-semibold text-slate-900">Rental Options</h3>
            </div>
            
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p class="font-semibold text-slate-800 text-sm">Available for Rent?</p>
                <p class="text-xs text-slate-500 mt-0.5">Allow users to rent this item instead of buying.</p>
              </div>
              <button type="button" (click)="toggleRentable()"
                      [class.bg-indigo-600]="form.get('isAvailableForRent')?.value"
                      [class.bg-slate-300]="!form.get('isAvailableForRent')?.value"
                      class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none">
                <span [class.translate-x-7]="form.get('isAvailableForRent')?.value"
                      [class.translate-x-1]="!form.get('isAvailableForRent')?.value"
                      class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow inline-block transition-transform duration-200"></span>
              </button>
            </div>

            @if (form.get('isAvailableForRent')?.value) {
              <div class="w-full md:w-1/2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label for="rentalPricePerDay" class="block text-sm font-semibold text-slate-700">Rental Price Per Day ($) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="rentalPricePerDay" formControlName="rentalPricePerDay" min="0" step="0.01" placeholder="0.00"
                         class="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>
            }
          </div>

          <!-- Product Images -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-base font-semibold text-slate-900">Product Images <span class="text-rose-500">*</span></h3>
              <p class="text-xs font-medium text-slate-500">{{ uploadedImages().length }} uploaded</p>
            </div>
            
            <!-- Upload Area -->
            <div class="relative group">
              <input type="file" multiple (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" [disabled]="isUploadingImage()">
              <div class="w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all"
                   [class.border-indigo-300]="!isUploadingImage()"
                   [class.bg-indigo-50]="!isUploadingImage()"
                   [class.border-slate-200]="isUploadingImage()"
                   [class.bg-slate-50]="isUploadingImage()"
                   [class.group-hover:border-indigo-400]="!isUploadingImage()"
                   [class.group-hover:bg-indigo-100]="!isUploadingImage()">
                
                @if (isUploadingImage()) {
                  <div class="flex flex-col items-center gap-3">
                    <svg class="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-sm font-semibold text-slate-600">Uploading to Cloudinary...</p>
                  </div>
                } @else {
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <p class="text-sm font-semibold text-indigo-900">Click or drag images here to upload</p>
                    <p class="text-xs text-indigo-500/80">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                }
              </div>
            </div>

            <!-- Image Gallery -->
            @if (uploadedImages().length > 0) {
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                @for (img of uploadedImages(); track img; let i = $index) {
                  <div class="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm p-1">
                    <img [src]="img" alt="Product Image" class="w-full h-full object-contain rounded-xl">
                    <!-- Delete Button -->
                    <button type="button" (click)="removeImage(i)" 
                            class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600 focus:outline-none">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <!-- Main Thumbnail Badge -->
                    @if (i === 0) {
                      <div class="absolute bottom-2 left-2 px-2 py-1 bg-indigo-600/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-sm">
                        Main Image
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-6 text-sm text-slate-500">
                <span class="text-rose-500 font-medium">Warning:</span> Please add at least one image to list this product.
              </div>
            }
          </div>

          <!-- Submit -->
          <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <a routerLink="/seller/products" class="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || isSubmitting || uploadedImages().length === 0"
                    class="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm shadow-indigo-200">
              @if (isSubmitting) {
                <span class="flex items-center gap-2">
                  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Saving...
                </span>
              } @else {
                {{ isEditMode() ? 'Save Changes' : 'Publish Product' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Editor Modal -->
    @if (editingFile()) {
      <div class="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="relative w-full h-[85vh] max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h3 class="text-lg font-bold text-slate-900">Advanced Image Editor</h3>
            <button type="button" (click)="closeEditor()" class="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
          </div>
          <div id="filerobot-editor-container" class="w-full flex-1 relative"></div>
        </div>
      </div>
    }
  `
})
export class AdminAddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cloudinary = inject(CloudinaryService);
  private productService = inject(ProductService);
  private sanitizer = inject(DomSanitizer);

  isSubmitting = false;
  isUploadingImage = signal(false);
  isEditMode = signal(false);
  editProductId = signal<string | null>(null);

  uploadedImages = signal<string[]>([]);
  categories = signal<Category[]>([]);
  editingFile = signal<File | null>(null);
  editorInstance: any = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    brand: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    originalPrice: [null as number | null, [Validators.min(0.01)]],
    stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]],
    categoryId: ['', [Validators.required]],
    isAvailableForRent: [false],
    rentalPricePerDay: [null as number | null]
  });

  ngOnInit() {
    this.productService.getCategories().subscribe(res => {
      this.categories.set(res);
    });
    
    // Check if in edit mode
    const urlParts = this.router.url.split('/');
    if (urlParts.includes('edit-product')) {
      const slug = urlParts[urlParts.length - 1];
      this.isEditMode.set(true);
      this.loadProductForEdit(slug);
    }
  }

  loadProductForEdit(slug: string) {
    this.productService.getBySlug(slug).subscribe({
      next: (product) => {
        this.editProductId.set(product.id);
        this.form.patchValue({
          name: product.name,
          brand: product.brand || '',
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          stockQuantity: product.stock,
          categoryId: product.categoryId,
          isAvailableForRent: product.isAvailableForRent,
          rentalPricePerDay: product.rentalPricePerDay
        });
        if (product.images) {
          this.uploadedImages.set(product.images);
        }
        if (product.isAvailableForRent) {
          this.form.get('rentalPricePerDay')?.setValidators([Validators.required, Validators.min(0.01)]);
          this.form.get('rentalPricePerDay')?.updateValueAndValidity();
        }
      },
      error: (err) => {
        this.toast.error('Failed to load product details.');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  toggleRentable(): void {
    const control = this.form.get('isAvailableForRent');
    const rentPriceControl = this.form.get('rentalPricePerDay');

    if (control) {
      control.setValue(!control.value);
      if (control.value) {
        rentPriceControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        rentPriceControl?.clearValidators();
        rentPriceControl?.setValue(null);
      }
      rentPriceControl?.updateValueAndValidity();
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editingFile.set(file);
      
      // Delay to let Angular render the container
      setTimeout(() => {
        this.initEditor(file);
      }, 100);
    }
    
    event.target.value = '';
  }

  initEditor(file: File) {
    const container = document.getElementById('filerobot-editor-container');
    if (!container) return;
    
    const imageUrl = URL.createObjectURL(file);
    
    // @ts-ignore
    const { TABS, TOOLS } = window.FilerobotImageEditor;
    
    const config = {
      source: imageUrl,
      onSave: (imageInfo: any, designState: any) => {
        if (imageInfo && imageInfo.imageBase64) {
          this.uploadEditedImage(imageInfo.imageBase64, file.name);
          this.closeEditor();
        } else if (imageInfo && imageInfo.imageCanvas) {
           const base64 = imageInfo.imageCanvas.toDataURL('image/jpeg');
           this.uploadEditedImage(base64, file.name);
           this.closeEditor();
        } else {
           this.toast.error("Could not capture edited image.");
        }
      },
      onClose: () => {
        this.closeEditor();
      },
      annotationsCommon: { fill: '#0f766e' },
      Text: { text: 'Budgetha' },
      theme: {
        colors: {
          primaryBg: '#ffffff',
          primaryBgHover: '#f8fafc',
          secondaryBg: '#f1f5f9',
          secondaryBgHover: '#e2e8f0',
          text: '#0f172a',
          textHover: '#000000',
          textMuted: '#64748b',
          textWarn: '#f87171',
          textError: '#ef4444',
          border: '#e2e8f0',
          borderLight: '#f1f5f9',
          borderActive: '#0f766e',
        },
      }
    };
    
    // @ts-ignore
    this.editorInstance = new window.FilerobotImageEditor(container, config);
    this.editorInstance.render({
      onClose: () => this.closeEditor()
    });
  }

  closeEditor() {
    if (this.editorInstance) {
      this.editorInstance.terminate();
      this.editorInstance = null;
    }
    this.editingFile.set(null);
  }

  // saveAndUpload() method removed because we now use onSave hook in the Filerobot config

  uploadEditedImage(base64: string, originalName: string) {
    fetch(base64)
      .then(res => res.blob())
      .then(blob => {
        const newFile = new File([blob], 'edited_' + originalName, { type: 'image/jpeg' });
        
        this.isUploadingImage.set(true);
        this.cloudinary.uploadImage(newFile).subscribe({
          next: (response) => {
            this.uploadedImages.update(images => [...images, response.url]);
            this.isUploadingImage.set(false);
            this.toast.success('Image edited and uploaded successfully!');
          },
          error: (err) => {
            console.error('Cloudinary upload error:', err);
            this.toast.error('Failed to upload edited image.');
            this.isUploadingImage.set(false);
          }
        });
      });
  }

  removeImage(index: number): void {
    this.uploadedImages.update(images => images.filter((_, i) => i !== index));
  }

  

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields correctly.');
      return;
    }

    if (this.uploadedImages().length === 0) {
      this.toast.error('Please add at least one product image.');
      return;
    }

    this.isSubmitting = true;
    const val = this.form.value;

    const categoryId = val.categoryId || '00000000-0000-0000-0000-000000000001';

    const payload = {
      name: val.name,
      brand: val.brand,
      description: val.description,
      price: val.price,
      originalPrice: val.originalPrice,
      stockQuantity: val.stockQuantity,
      categoryId: categoryId,
      imageUrls: this.uploadedImages(),
      isAvailableForRent: val.isAvailableForRent,
      rentalPricePerDay: val.rentalPricePerDay
    };

    if (this.isEditMode() && this.editProductId()) {
      this.http.put<void>(`${environment.apiUrl}/products/${this.editProductId()}`, payload).subscribe({
        next: () => {
          this.toast.success('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Failed to update product.');
          console.error(err);
        }
      });
    } else {
      this.http.post<string>(`${environment.apiUrl}/products`, payload).subscribe({
        next: () => {
          this.toast.success('Product added successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Failed to add product.');
          console.error(err);
        }
      });
    }
  }
}
```

### File: src/frontend/src/app/features/admin/admin-announcements.component.ts
```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-announcements',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Announcements</h1>
        <button type="button" class="btn-primary" (click)="openForm()">Create New</button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <div class="card p-6 border-violet-200 shadow-md">
          <h2 class="text-lg font-bold mb-4">{{ editingId() ? 'Edit Announcement' : 'New Announcement' }}</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Message *</label>
              <textarea formControlName="message" rows="2" class="input-field" placeholder="E.g. Free shipping on orders over $75..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Link URL (Optional)</label>
              <input type="text" formControlName="linkUrl" class="input-field" placeholder="/shop?deals=1" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Start Date (UTC, Optional)</label>
                <input type="datetime-local" formControlName="startDate" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">End Date (UTC, Optional)</label>
                <input type="datetime-local" formControlName="endDate" class="input-field" />
              </div>
            </div>

            <label class="flex items-center gap-2 mt-2">
              <input type="checkbox" formControlName="isActive" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <span class="text-sm text-slate-700">Is Active</span>
            </label>

            <div class="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button type="button" class="btn-secondary" (click)="cancelForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="form.invalid || isSubmitting()">
                {{ isSubmitting() ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 font-semibold">Message</th>
                <th class="px-6 py-4 font-semibold">Status</th>
                <th class="px-6 py-4 font-semibold">Start</th>
                <th class="px-6 py-4 font-semibold">End</th>
                <th class="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading announcements...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (item of announcements(); track item.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate" [title]="item.message">
                    {{ item.message }}
                  </td>
                  <td class="px-6 py-4">
                    @if (item.isActive) {
                      <span class="badge bg-green-100 text-green-700">Active</span>
                    } @else {
                      <span class="badge bg-slate-100 text-slate-600">Inactive</span>
                    }
                  </td>
                  <td class="px-6 py-4">{{ item.startDate ? (item.startDate | date:'short') : '-' }}</td>
                  <td class="px-6 py-4">{{ item.endDate ? (item.endDate | date:'short') : '-' }}</td>
                  <td class="px-6 py-4 text-right">
                    <button type="button" class="text-violet-600 hover:text-violet-900 font-medium mr-4" (click)="edit(item)">Edit</button>
                    <button type="button" class="text-red-600 hover:text-red-900 font-medium" (click)="delete(item.id)">Delete</button>
                  </td>
                </tr>
              }
              @if (announcements().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                    No announcements found.
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    @if (confirmAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Announcement</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this announcement?<br>This action cannot be undone.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeDelete()" 
                      class="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminAnnouncementsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private announcementService = inject(AnnouncementService);
  private toastService = inject(ToastService);

  announcements = signal<Announcement[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  isSubmitting = signal(false);
  isLoading = signal(true);
  confirmAction = signal<string | null>(null);

  form = this.fb.group({
    message: ['', Validators.required],
    linkUrl: [''],
    isActive: [true],
    startDate: [''],
    endDate: ['']
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.announcementService.getAll().subscribe({
      next: (data) => {
        this.announcements.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load announcements:', err);
        this.isLoading.set(false);
        this.announcements.set([]);
      }
    });
  }

  openForm() {
    this.form.reset({ isActive: true });
    this.editingId.set(null);
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  edit(item: Announcement) {
    this.editingId.set(item.id);
    this.form.patchValue({
      message: item.message,
      linkUrl: item.linkUrl,
      isActive: item.isActive,
      startDate: item.startDate ? item.startDate.substring(0, 16) : '', 
      endDate: item.endDate ? item.endDate.substring(0, 16) : ''
    });
    this.showForm.set(true);
  }

  delete(id: string) {
    this.confirmAction.set(id);
  }

  closeConfirmModal() {
    this.confirmAction.set(null);
  }

  executeDelete() {
    const id = this.confirmAction();
    if (!id) return;
    this.closeConfirmModal();

    this.announcementService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Announcement deleted successfully.');
        this.load();
      },
      error: () => this.toastService.error('Failed to delete announcement.')
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const val = this.form.value;
    const dto = {
      message: val.message!,
      linkUrl: val.linkUrl || undefined,
      isActive: val.isActive!,
      startDate: val.startDate ? new Date(val.startDate).toISOString() : undefined,
      endDate: val.endDate ? new Date(val.endDate).toISOString() : undefined,
    };

    const id = this.editingId();
    if (id) {
      this.announcementService.update(id, { ...dto, id }).subscribe({
        next: () => {
          this.toastService.success('Announcement updated successfully.');
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error('Failed to update announcement.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.announcementService.create(dto).subscribe({
        next: () => {
          this.toastService.success('Announcement created successfully.');
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error('Failed to create announcement.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
```

### File: src/frontend/src/app/features/admin/admin-categories.component.ts
```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/shop.models';
import { ToastService } from '../../core/services/toast.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Categories Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ categories().length }} total categories.
          </p>
        </div>
        <button (click)="openAdd()" *ngIf="!isAdding()"
                class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Category
        </button>
      </div>

      <!-- Add Category Form -->
      @if (isAdding()) {
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-[slideDown_0.3s_ease-out]">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900">{{ editId() ? 'Edit Category' : 'Create New Category' }}</h3>
            <button (click)="isAdding.set(false)" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Name *</label>
                <input type="text" formControlName="name" placeholder="e.g. Smartphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Slug *</label>
                <input type="text" formControlName="slug" placeholder="e.g. smartphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Image</label>
              
              <div class="flex items-start gap-4">
                @if (imageUrl()) {
                  <div class="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden relative group shrink-0 bg-slate-50">
                    <img [src]="imageUrl()" class="w-full h-full object-cover">
                    <button type="button" (click)="imageUrl.set(null)"
                            class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                } @else {
                  <div class="flex-1 w-full border-2 border-dashed border-slate-200 rounded-xl px-6 py-6 text-center hover:bg-slate-50 transition-colors">
                    <input type="file" id="categoryImage" class="hidden" accept="image/*" (change)="onFileSelected($event)">
                    <label for="categoryImage" class="cursor-pointer flex flex-col items-center">
                      <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <span class="text-sm font-semibold text-indigo-600">Click to upload</span>
                      <span class="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
                    </label>
                  </div>
                }
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" (click)="isAdding.set(false)"
                      class="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" [disabled]="form.invalid || isSubmitting()"
                      class="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2">
                @if (isSubmitting()) {
                  <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                } @else {
                  Save Category
                }
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Categories List -->
      @if (isLoading()) {
        <div class="py-12 text-center">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="text-sm text-slate-500 font-medium">Loading categories...</p>
          </div>
        </div>
      } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (category of categories(); track category.id) {
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group">
            <button (click)="editCategory(category)" class="absolute top-2 right-2 p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            @if (category.image) {
              <img [src]="category.image" class="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-slate-50">
            } @else {
              <div class="w-20 h-20 rounded-full mb-4 ring-4 ring-slate-50 flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600">
                <span class="text-3xl font-bold">{{ category.name[0] }}</span>
              </div>
            }
            <h3 class="text-lg font-bold text-slate-900">{{ category.name }}</h3>
            <p class="text-xs text-slate-400 mt-1 font-mono bg-slate-100 px-2 py-0.5 rounded">{{ category.slug }}</p>
            <p class="text-sm text-slate-500 mt-3">{{ category.productCount }} Products</p>
          </div>
        }
      </div>
      }

    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private cloudinaryService = inject(CloudinaryService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isAdding = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(true);
  imageUrl = signal<string | null>(null);
  editId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
  });

  ngOnInit() {
    this.loadCategories();
    
    
    this.form.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.form.get('slug')?.dirty) {
        const slug = name.toLowerCase()
                         .replace(/[^a-z0-9\s-]/g, '')
                         .replace(/\s+/g, '-')
                         .replace(/-+/g, '-');
        this.form.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  loadCategories() {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.isLoading.set(false);
        this.categories.set([]);
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please upload an image file');
      return;
    }
    
    this.isSubmitting.set(true);
    try {
      const res = await firstValueFrom(this.cloudinaryService.uploadImage(file));
      this.imageUrl.set(res.url);
      this.toastService.success('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      this.toastService.error('Failed to upload image');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  openAdd() {
    this.editId.set(null);
    this.form.reset();
    this.imageUrl.set(null);
    this.isAdding.set(true);
  }

  editCategory(category: Category) {
    this.editId.set(category.id);
    this.form.patchValue({
      name: category.name,
      slug: category.slug
    });
    this.imageUrl.set(category.image || null);
    this.isAdding.set(true);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    
    if (this.editId()) {
      const data = {
        id: this.editId()!,
        name: this.form.value.name!,
        slug: this.form.value.slug!,
        imageUrl: this.imageUrl() || undefined
      };
      this.productService.updateCategory(this.editId()!, data).subscribe({
        next: () => {
          this.toastService.success('Category updated successfully');
          this.isAdding.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to update category');
        },
        complete: () => this.isSubmitting.set(false)
      });
    } else {
      const data = {
        name: this.form.value.name!,
        slug: this.form.value.slug!,
        imageUrl: this.imageUrl() || undefined
      };
      this.productService.createCategory(data).subscribe({
        next: () => {
          this.toastService.success('Category created successfully');
          this.isAdding.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to create category');
        },
        complete: () => this.isSubmitting.set(false)
      });
    }
  }
}
```

### File: src/frontend/src/app/features/admin/admin-dashboard.component.ts
```typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AdminService, AdminStats, AdminUser, SellerStats } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe, DecimalPipe, CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Welcome Banner -->
      <div class="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-900 p-6 text-white flex items-center justify-between shadow-lg overflow-hidden relative">
        <div class="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div class="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2"></div>
        <div class="relative z-10">
          <p class="text-teal-200 text-sm font-medium mb-1">Welcome back,</p>
          <h1 class="text-2xl font-bold">{{ authService.user()?.firstName }} {{ authService.user()?.lastName }}</h1>
          <p class="text-teal-300 text-sm mt-1">
            @if (isSuperAdmin()) {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                Super Administrator — Full system access
              </span>
            } @else if (isAdminOrSuperAdmin()) {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-teal-300 inline-block"></span>
                Administrator — Product & content management
              </span>
            } @else {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                Store Seller — Manage your products
              </span>
            }
          </p>
        </div>
        <div class="relative z-10 hidden sm:flex gap-3">
          @if (isAdminOrSuperAdmin()) {
            <a routerLink="/admin/users" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition-colors backdrop-blur-sm border border-white/10">
              Manage Users
            </a>
          }
          <a routerLink="/admin/products" class="px-4 py-2 bg-white text-teal-800 text-sm font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm">
            View Products
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      @if (isAdminOrSuperAdmin()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Total Users -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalUsers | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Users</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full" style="width: 70%"></div>
          </div>
        </div>

        <!-- Total Products -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Listed</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalProducts | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Products</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full" style="width: 55%"></div>
          </div>
        </div>

        <!-- Padding space instead of Pending -->
        <!-- Total Orders -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Orders</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalOrders | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Orders</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-rose-400 to-rose-200 rounded-full" style="width: 40%"></div>
          </div>
        </div>
        </div>
      } @else {
        <!-- Seller Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Total Products -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalProducts | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Total Products</p>
          </div>

          <!-- Total Sales (Items Sold) -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalSales | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Items Sold</p>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalRevenue | currency }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Total Revenue</p>
          </div>

          <!-- Total Orders -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalOrders | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Unique Orders</p>
          </div>
        </div>
      }

      <!-- Charts Row -->
      @if (isAdminOrSuperAdmin()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Bar Chart — Registration Activity -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900">Platform Activity</h3>
              <p class="text-sm text-slate-500 mt-0.5">Overview of key metrics</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-teal-500 inline-block"></span>Users</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-indigo-500 inline-block"></span>Products</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-rose-400 inline-block"></span>Orders</span>
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div class="relative">
            <svg viewBox="0 0 600 200" class="w-full" style="overflow: visible;">
              <!-- Y-axis grid lines -->
              <line x1="40" y1="10" x2="40" y2="170" stroke="#e2e8f0" stroke-width="1"/>
              <line x1="40" y1="10" x2="590" y2="10" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="52.5" x2="590" y2="52.5" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="95" x2="590" y2="95" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="137.5" x2="590" y2="137.5" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="170" x2="590" y2="170" stroke="#e2e8f0" stroke-width="1"/>

              <!-- Y axis labels -->
              <text x="32" y="13" text-anchor="end" font-size="9" fill="#94a3b8">100%</text>
              <text x="32" y="55.5" text-anchor="end" font-size="9" fill="#94a3b8">75%</text>
              <text x="32" y="98" text-anchor="end" font-size="9" fill="#94a3b8">50%</text>
              <text x="32" y="140.5" text-anchor="end" font-size="9" fill="#94a3b8">25%</text>
              <text x="32" y="173" text-anchor="end" font-size="9" fill="#94a3b8">0%</text>

              <!-- Users bar (teal) -->
              <rect x="52" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalUsers, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalUsers, maxStat())"
                    fill="url(#tealGrad)" class="transition-all duration-700"/>
              <!-- Products bar (indigo) -->
              <rect x="84" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalProducts, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalProducts, maxStat())"
                    fill="url(#indigoGrad)" class="transition-all duration-700"/>
              <!-- Orders bar (rose) -->
              <rect x="116" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalOrders, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalOrders, maxStat())"
                    fill="url(#roseGrad)" class="transition-all duration-700"/>

              <!-- X-axis label -->
              <text x="88" y="188" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">Current Stats</text>


              <!-- Gradients -->
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0d9488"/>
                  <stop offset="100%" stop-color="#5eead4"/>
                </linearGradient>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#a5b4fc"/>
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f43f5e"/>
                  <stop offset="100%" stop-color="#fda4af"/>
                </linearGradient>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#fde68a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Legend numbers -->
          <div class="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div class="text-center">
              <p class="text-lg font-bold text-teal-700">{{ stats()?.totalUsers ?? 0 }}</p>
              <p class="text-xs text-slate-400">Users</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-indigo-600">{{ stats()?.totalProducts ?? 0 }}</p>
              <p class="text-xs text-slate-400">Products</p>
            </div>

            <div class="text-center">
              <p class="text-lg font-bold text-rose-500">{{ stats()?.totalOrders ?? 0 }}</p>
              <p class="text-xs text-slate-400">Orders</p>
            </div>
          </div>
        </div>

        <!-- Donut Chart — System Status -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div class="mb-4">
            <h3 class="text-base font-bold text-slate-900">System Health</h3>
            <p class="text-sm text-slate-500 mt-0.5">Platform distribution</p>
          </div>

          <!-- SVG Donut -->
          <div class="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 160 160" class="w-40 h-40">
              <!-- Background track -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="20"/>
              <!-- Users segment (teal) - 0 to products/total -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#0d9488" stroke-width="20"
                      stroke-dasharray="377" stroke-dashoffset="0"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalUsers ?? 1, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Products segment (indigo) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#6366f1" stroke-width="20"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalProducts ?? 0, totalPlatformItems())"
                      [attr.stroke-dashoffset]="donutOffset(stats()?.totalUsers ?? 0, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Orders segment (rose) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f43f5e" stroke-width="20"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalOrders ?? 0, totalPlatformItems())"
                      [attr.stroke-dashoffset]="donutOffset2(stats()?.totalUsers ?? 0, stats()?.totalProducts ?? 0, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Center text -->
              <text x="80" y="75" text-anchor="middle" font-size="22" font-weight="700" fill="#0f172a">{{ totalPlatformItems() }}</text>
              <text x="80" y="90" text-anchor="middle" font-size="9" fill="#94a3b8">Total Records</text>
            </svg>
          </div>

          <!-- Legend -->
          <div class="space-y-2.5 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Users</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalUsers ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Products</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalProducts ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Orders</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalOrders ?? 0 }}</span>
            </div>
          </div>
        </div>
        </div>
      }

      <!-- Recent Users Table + Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        @if (isAdminOrSuperAdmin()) {
          <!-- Recent Users -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">Recent Users</h3>
            <a routerLink="/admin/users" class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">View all →</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">User</th>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Roles</th>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-slate-700">
                @for (user of recentUsers(); track user.id) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-6 py-3.5">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {{ user.firstName[0] }}{{ user.lastName[0] }}
                        </div>
                        <div>
                          <p class="font-semibold text-slate-800 text-sm">{{ user.firstName }} {{ user.lastName }}</p>
                          <p class="text-xs text-slate-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-3.5">
                      <div class="flex gap-1 flex-wrap">
                        @for (role of user.roles; track role) {
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
                                [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                                [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"
                                [class.bg-amber-100]="role === 'Seller'" [class.text-amber-700]="role === 'Seller'"
                                [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                            {{ role }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-3.5 text-slate-400 text-xs">{{ user.createdAt | date:'MMM d, y' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="px-6 py-10 text-center text-slate-400 text-sm">No users yet</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        }

        <!-- Quick Actions & System Info -->
        <div class="space-y-4" [class.lg:col-span-3]="!isAdminOrSuperAdmin()">

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 class="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div class="space-y-2" [class.grid]="!isAdminOrSuperAdmin()" [class.grid-cols-2]="!isAdminOrSuperAdmin()" [class.gap-4]="!isAdminOrSuperAdmin()">
              
              @if (isAdminOrSuperAdmin()) {
                <a routerLink="/admin/users"
                   class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                  <div class="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <svg class="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">Manage Users</p>
                    <p class="text-xs text-slate-400">View & assign roles</p>
                  </div>
                  <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
              }

              <a routerLink="/admin/products"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">Review Products</p>
                  <p class="text-xs text-slate-400">
                    All products are active
                  </p>
                </div>
                <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>

              <a routerLink="/"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">Visit Store</p>
                  <p class="text-xs text-slate-400">Go to customer view</p>
                </div>
                <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>

          <!-- Role Permissions Summary -->
          @if (isAdminOrSuperAdmin()) {
            <div class="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
              <h3 class="text-sm font-bold mb-3 text-slate-900">Your Permissions</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  <span class="text-slate-600 font-medium">View & manage users</span>
                </div>

                <div class="flex items-center gap-2 text-sm">
                  @if (isSuperAdmin()) {
                    <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span class="text-slate-600 font-medium">Assign Admin roles</span>
                  } @else {
                    <svg class="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span class="text-slate-400">Assign roles (SuperAdmin)</span>
                  }
                </div>
                <div class="flex items-center gap-2 text-sm">
                  @if (isSuperAdmin()) {
                    <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span class="text-slate-600 font-medium">Delete products</span>
                  } @else {
                    <svg class="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span class="text-slate-400">Delete products (SuperAdmin)</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly stats = signal<AdminStats | null>(null);
  readonly sellerStats = signal<SellerStats | null>(null);
  readonly recentUsers = signal<AdminUser[]>([]);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly isAdminOrSuperAdmin = computed(() =>
    this.authService.user()?.roles?.some(r => r === 'Admin' || r === 'SuperAdmin') ?? false
  );

  readonly totalPlatformItems = computed(() => {
    const s = this.stats();
    if (!s) return 1;
    return (s.totalUsers + s.totalProducts + s.totalOrders) || 1;
  });

  readonly maxStat = computed(() => {
    const s = this.stats();
    if (!s) return 1;
    return Math.max(s.totalUsers, s.totalProducts, s.totalOrders, s.pendingProducts, 1);
  });

  readonly pendingPercent = computed(() => {
    const s = this.stats();
    if (!s || !s.totalProducts) return 0;
    return Math.round((s.pendingProducts / s.totalProducts) * 100);
  });

  
  barHeight(value: number | undefined, max: number): number {
    if (!value || !max) return 4;
    return Math.max(4, Math.round((value / max) * 160));
  }

  
  private readonly CIRC = 2 * Math.PI * 60;

  donutSegment(value: number, total: number): string {
    const frac = total > 0 ? value / total : 0;
    const seg = frac * this.CIRC;
    return `${seg} ${this.CIRC - seg}`;
  }

  donutOffset(prevValue: number, total: number): number {
    const frac = total > 0 ? prevValue / total : 0;
    return -(frac * this.CIRC);
  }

  donutOffset2(v1: number, v2: number, total: number): number {
    const frac = total > 0 ? (v1 + v2) / total : 0;
    return -(frac * this.CIRC);
  }

  ngOnInit(): void {
    if (this.isAdminOrSuperAdmin()) {
      this.adminService.getStats().subscribe({
        next: stats => this.stats.set(stats),
        error: () => this.stats.set(null)
      });
      this.adminService.getRecentUsers(5).subscribe({
        next: users => this.recentUsers.set(users || []),
        error: () => this.recentUsers.set([])
      });
    } else {
      this.adminService.getSellerStats().subscribe({
        next: stats => this.sellerStats.set(stats),
        error: () => this.sellerStats.set(null)
      });
    }
  }
}
```

### File: src/frontend/src/app/features/admin/admin-layout.component.ts
```typescript
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
            <span class="text-lg font-bold text-white tracking-tight">{{ isAdminOrSuperAdmin() ? 'Admin Panel' : 'Seller Panel' }}</span>
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
                } @else if (isAdminOrSuperAdmin()) {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-teal-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
                    Admin
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                    Seller
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

          <a routerLink="/admin/logs" (click)="mobileMenuOpen.set(false)"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <span class="text-sm font-medium">Transaction Logs</span>
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
```

### File: src/frontend/src/app/features/admin/admin-logs.component.ts
```typescript
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
```

### File: src/frontend/src/app/features/admin/admin-products.component.ts
```typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, AdminProductResult } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Products Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ productsResult()?.total ?? 0 }} total products.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a routerLink="/admin/add-product" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Product
          </a>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading products...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (product of filteredProducts(); track product.id) {
                <tr class="hover:bg-slate-50/60 transition-colors" [class.opacity-50]="processingId() === product.id">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        @if (product.images && product.images.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        }
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 max-w-[200px] truncate" [title]="product.name">{{ product.name }}</p>
                        <p class="text-xs text-slate-400">{{ product.category }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ product.price | currency }}</td>
                  <td class="px-6 py-4">
                    <span [class.text-rose-600]="product.stock < 10"
                          [class.font-semibold]="product.stock < 10"
                          [class.text-slate-700]="product.stock >= 10">
                      {{ product.stock }}
                      @if (product.stock < 10) {
                        <span class="text-xs text-rose-400 ml-1">(Low)</span>
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Edit -->
                      @if (canManageProducts()) {
                        <a [routerLink]="['/admin/edit-product', product.slug]"
                           class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          Edit
                        </a>

                        <!-- Delete -->
                        <button (click)="confirmDelete(product)"
                                [disabled]="processingId() === product.id"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      <p class="text-sm">No products found</p>
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

    <!-- Delete Confirmation Modal -->
    @if (productToDelete()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="productToDelete.set(null)"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="p-6">
            <div class="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Delete Product?</h3>
            <p class="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to permanently delete
              <span class="font-semibold text-slate-800">"{{ productToDelete()?.name }}"</span>?
              This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button (click)="productToDelete.set(null)"
                      class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                Cancel
              </button>
              <button (click)="deleteProduct()"
                      class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProductsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly productsResult = signal<AdminProductResult | null>(null);
  readonly processingId = signal<string | null>(null);
  readonly productToDelete = signal<any>(null);
  readonly isLoading = signal(true);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly canManageProducts = computed(() => {
    const roles = this.authService.user()?.roles ?? [];
    return roles.includes('SuperAdmin') || roles.includes('Seller');
  });

  readonly filteredProducts = computed(() => {
    return this.productsResult()?.items ?? [];
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.adminService.getAllProducts().subscribe({
      next: (result) => {
        this.productsResult.set(result);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      }
    });
  }

  confirmDelete(product: any): void {
    this.productToDelete.set(product);
  }

  deleteProduct(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.processingId.set(product.id);
    this.adminService.deleteProduct(product.id).subscribe({
      next: () => {
        const current = this.productsResult();
        if (current) {
          const updated = current.items.filter((p: any) => p.id !== product.id);
          this.productsResult.set({ ...current, items: updated, total: current.total - 1 });
        }
        this.productToDelete.set(null);
        this.processingId.set(null);
      },
      error: () => {
        this.productToDelete.set(null);
        this.processingId.set(null);
      }
    });
  }
}
```

### File: src/frontend/src/app/features/admin/admin-seller-requests.component.ts
```typescript
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
```

### File: src/frontend/src/app/features/admin/admin-user-profile.component.ts
```typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService, AdminUserProfile } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-user-profile',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
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
                    [class.text-rose-600]="!profile()!.isBanned" [class.bg-rose-50]="!profile()!.isBanned" [class.hover:bg-rose-100]="!profile()!.isBanned"
                    [class.text-emerald-600]="profile()!.isBanned" [class.bg-emerald-50]="profile()!.isBanned" [class.hover:bg-emerald-100]="profile()!.isBanned"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              {{ profile()!.isBanned ? 'Unban User' : 'Ban User' }}
            </button>
            <button (click)="deleteUser()"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-all shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
          <!-- Profile Card -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <div class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-teal-200 mb-6 relative">
                {{ profile()!.firstName[0] }}{{ profile()!.lastName[0] }}
                @if (profile()!.isBanned) {
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center text-white" title="User is Banned">
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

              <div class="mt-8 pt-6 border-t border-slate-100 text-left space-y-4">
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

          <!-- User's Products -->
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
                        @if (product.images?.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <div class="w-full h-full flex items-center justify-center text-slate-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-slate-900 truncate">{{ product.name }}</h4>
                        <p class="text-xs text-slate-500 mt-0.5 truncate">{{ product.category }}</p>
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
        </div>
      } @else {
        <div class="text-center py-12">
          <h4 class="text-lg font-bold text-slate-900">User not found</h4>
          <p class="text-slate-500 mt-1">The user might have been deleted or the ID is incorrect.</p>
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
              Are you sure you want to <strong>{{ confirmAction()?.type }}</strong> {{ profile()?.firstName }}?
              @if (confirmAction()?.type === 'delete') {
                <br>This action cannot be undone.
              }
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeConfirmAction()" 
                      class="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-colors shadow-sm"
                      [class.bg-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.hover:bg-rose-700]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.bg-emerald-600]="confirmAction()?.type === 'unban'"
                      [class.hover:bg-emerald-700]="confirmAction()?.type === 'unban'">
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
    if (!action || !user) return;

    const { type } = action;
    this.closeConfirmModal();

    if (type === 'ban' || type === 'unban') {
      const action$ = type === 'unban'
        ? this.adminService.unbanUser(user.id)
        : this.adminService.banUser(user.id);

      action$.subscribe({
        next: () => {
          this.toastService.success(`User successfully ${type}ned.`);
          this.loadProfile(user.id);
        },
        error: () => this.toastService.error(`Failed to ${type} user.`)
      });
    } else if (type === 'delete') {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.toastService.success(`User deleted permanently.`);
          this.router.navigate(['/admin/users']);
        },
        error: () => this.toastService.error('Failed to delete user.')
      });
    }
  }
}
```

### File: src/frontend/src/app/features/admin/admin-users.component.ts
```typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

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

                              [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                          {{ role }}
                        </span>
                      }
                      @if (user.roles.length === 0) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">User</span>
                      }
                      @if (user.isBanned) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-700 ml-1">
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
                                  [class.from-rose-600]="!user.isBanned" [class.to-rose-700]="!user.isBanned" [class.hover:from-rose-700]="!user.isBanned"
                                  [class.from-emerald-600]="user.isBanned" [class.to-emerald-700]="user.isBanned" [class.hover:from-emerald-700]="user.isBanned"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r px-3 py-1.5 rounded-lg transition-all shadow-sm">
                            {{ user.isBanned ? 'Unban' : 'Ban' }}
                          </button>

                          <button (click)="deleteUser(user)"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
                        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
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
                        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
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
                      class="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-colors shadow-sm"
                      [class.bg-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.hover:bg-rose-700]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.bg-emerald-600]="confirmAction()?.type === 'unban'"
                      [class.hover:bg-emerald-700]="confirmAction()?.type === 'unban'">
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

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly loadingMore = signal(false);
  readonly currentPage = signal(1);
  readonly hasMore = signal(false);
  
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
    if (!action) return;

    const { type, user } = action;
    this.closeConfirmModal();

    if (type === 'ban' || type === 'unban') {
      const newStatus = type === 'ban';
      this.users.update(users => users.map(u => u.id === user.id ? { ...u, isBanned: newStatus } : u));
      
      const action$ = type === 'unban'
        ? this.adminService.unbanUser(user.id)
        : this.adminService.banUser(user.id);

      action$.subscribe({
        next: () => {
            this.toastService.success(`User successfully ${type}ned.`);
        },
        error: () => {
          this.users.update(users => users.map(u => u.id === user.id ? user : u));
          this.toastService.error(`Failed to ${type} user.`);
        }
      });
    } else if (type === 'delete') {
      const previousUsers = this.users();
      this.users.set(previousUsers.filter(u => u.id !== user.id));
      
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
            this.toastService.success(`User deleted permanently.`);
        },
        error: () => {
          this.users.set(previousUsers);
          this.toastService.error('Failed to delete user.');
        }
      });
    }
  }
}
```

### File: src/frontend/src/app/features/auth/forgot-password/forgot-password.component.ts
```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-slate-50">
      <div class="w-full max-w-[420px]">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <!-- Logo -->
          <div class="flex items-center justify-center sm:justify-start gap-2 mb-8 sm:-ml-2">
            <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
            <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
          </div>

          @if (!submitted()) {
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
              <p class="mt-2 text-sm text-slate-500">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  autocomplete="email"
                  class="input-field"
                  [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                  placeholder="you@example.com" />
                @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
                  <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
                }
                @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
                  <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
                }
              </div>

              <button type="submit" [disabled]="loading()" class="btn-primary w-full">
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Sending...
                } @else {
                  Send reset link
                }
              </button>
            </form>
          } @else {
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p class="text-sm text-slate-500 mb-6">
                If an account with that email exists, we've sent a password reset link.
              </p>
              <a routerLink="/auth/reset-password"
                 class="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors">
                Have a reset token? Reset your password
              </a>
            </div>
          }

          <p class="mt-6 text-center text-sm text-slate-500">
            Remember your password?
            <a routerLink="/auth/login" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  submitted = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.loading.set(false);
        
        this.submitted.set(true);
      }
    });
  }
}
```

### File: src/frontend/src/app/features/auth/login/login.component.html
```html
<div class="min-h-screen flex">
  <!-- ── Left Brand Panel ── -->
  <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
    <!-- Background Image -->
    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Shopping" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
    
    <!-- Gradient Overlay (Animated) -->
    <div class="absolute inset-0 bg-gradient-to-br from-teal-950/95 via-teal-900/80 to-slate-900/95 bg-[length:200%_200%] animate-gradient-slow"></div>

    <div class="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full text-white">
      <!-- Logo -->
      <div class="flex items-center gap-4 -ml-2">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-900/40 overflow-hidden shrink-0">
          <img src="/images/logo.png" alt="Budgetha" class="h-14 w-auto object-contain" />
        </div>
        <span class="text-4xl font-black tracking-tighter text-white" style="font-family: 'Outfit', sans-serif;">Budgetha</span>
      </div>

      <!-- Hero copy -->
      <div class="space-y-6 mt-12">
        <h2 class="text-5xl font-bold leading-tight font-sans">
          Discover a new way<br />
          to <span class="text-teal-300">shop online.</span>
        </h2>
        <p class="text-xl text-teal-50/80 max-w-md leading-relaxed font-light">
          Compare prices, find exclusive deals, and check out securely across hundreds of premium vendors.
        </p>
      </div>

      <!-- UI Cards Animated Slider (3D Coverflow) -->
      <app-auth-slider></app-auth-slider>

      <!-- Features snippet -->
      <div class="mt-auto border-t border-white/10 pt-8 pb-4">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-sm text-teal-300 font-bold tracking-wider uppercase">Why choose Budgetha?</span>
        </div>
        <p class="text-lg font-medium text-white/90 leading-snug">
          Experience a smarter way to shop with confidence. Compare prices instantly, discover authentic products, and connect with trusted vendors across our platform.
        </p>
      </div>
    </div>
  </div>

  <!-- ── Right Form Panel ── -->
  <div class="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-pan-bg">
    
    <!-- Optional: Super soft glowing orb in background of right panel to make it even more magical -->
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white relative z-10">
      <!-- Mobile logo (visible < lg) -->
      <div class="lg:hidden flex items-center justify-center gap-2 mb-10">
        <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
        <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
        <p class="mt-2 text-slate-500">Sign in to your account to continue</p>
      </div>

      <!-- Login form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="input-field"
            [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
            placeholder="you@example.com" />
          @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
          }
          @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
            <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
          }
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <a routerLink="/auth/forgot-password" class="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors">
              Forgot password?
            </a>
          </div>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              autocomplete="current-password"
              class="input-field pr-11"
              [class.input-error]="form.get('password')?.touched && form.get('password')?.invalid"
              placeholder="Enter your password" />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (showPassword()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                }
              </svg>
            </button>
          </div>
          @if (form.get('password')?.touched && form.get('password')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Password is required.</p>
          }
          @if (form.get('password')?.touched && form.get('password')?.hasError('minlength')) {
            <p class="mt-1.5 text-xs text-red-500">Password must be at least 6 characters.</p>
          }
        </div>

        <!-- Submit -->
        <button type="submit" [disabled]="loading()" class="btn-primary w-full bg-teal-700 hover:bg-teal-800 focus:ring-teal-500/50">
          @if (loading()) {
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Signing in…
          } @else {
            Sign in
          }
        </button>
      </form>

      <!-- Social divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-white/90 px-4 text-slate-400 uppercase tracking-wider">Or continue with</span>
        </div>
      </div>

      <!-- Social buttons -->
      <div>
        <button type="button" (click)="googleLogin()" class="btn-social w-full justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p class="mt-8 text-center text-sm text-slate-500">
        Don&rsquo;t have an account?
        <a routerLink="/auth/register" [queryParams]="linkQuery" class="font-semibold text-teal-600 hover:text-teal-700 transition-colors">Create one</a>
      </p>
    </div>
  </div>
</div>
```

### File: src/frontend/src/app/features/auth/login/login.component.scss
```scss
:host {
  display: block;
}
```

### File: src/frontend/src/app/features/auth/login/login.component.ts
```typescript
import { Component, signal, NgZone, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

import { AuthSliderComponent } from '../../../shared/components/auth-slider/auth-slider.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthSliderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  showPassword = signal(false);
  
  private get returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    
    if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
    if (target.startsWith('/auth/')) return '/';
    return target;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  
  get linkQuery(): { returnUrl: string | null } {
    const target = this.returnUrl;
    return { returnUrl: target === '/' ? null : target };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fix the highlighted fields before continuing.');
      return;
    }

    this.loading.set(true);
    this.authService.login(this.form.value).subscribe({
      next: response => {
        this.loading.set(false);
        this.toastService.success(`Welcome back${response?.firstName ? ', ' + response.firstName : ''}!`);
        
        const u = this.authService.user();
        let target = this.returnUrl;
        const isAdminRoute = target.startsWith('/admin');
        const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
        
        if (isAdminRoute && !hasAdminPrivileges) {
          target = '/';
        }
        
        this.router.navigateByUrl(target);
      },
      error: () => {
        
        
        this.loading.set(false);
      }
    });
  }

  googleLogin(): void {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In isn’t available right now. Please sign in with your email instead.');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this.ngZone.run(() => {
          this.loading.set(true);
          this.authService.googleLogin(response.credential).subscribe({
            next: () => {
              this.loading.set(false);
              this.toastService.success('Signed in with Google.');
              
              const u = this.authService.user();
              let target = this.returnUrl;
              const isAdminRoute = target.startsWith('/admin');
              const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
              
              if (isAdminRoute && !hasAdminPrivileges) {
                target = '/';
              }
              
              this.router.navigateByUrl(target);
            },
            error: () => {
              this.loading.set(false);
            }
          });
        });
      }
    });

    google.accounts.id.prompt();
  }
}
```

### File: src/frontend/src/app/features/auth/register/register.component.html
```html
<div class="min-h-screen flex">
  <!-- ── Left Brand Panel ── -->
  <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
    <!-- Background Image -->
    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Shopping" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
    
    <!-- Gradient Overlay (Animated) -->
    <div class="absolute inset-0 bg-gradient-to-br from-teal-950/95 via-teal-900/80 to-slate-900/95 bg-[length:200%_200%] animate-gradient-slow"></div>

    <div class="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full text-white">
      <!-- Logo -->
      <div class="flex items-center gap-4 -ml-2">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-900/40 overflow-hidden shrink-0">
          <img src="/images/logo.png" alt="Budgetha" class="h-14 w-auto object-contain" />
        </div>
        <span class="text-4xl font-black tracking-tighter text-white" style="font-family: 'Outfit', sans-serif;">Budgetha</span>
      </div>

      <!-- Hero copy -->
      <div class="space-y-6 mt-12">
        <h2 class="text-5xl font-bold leading-tight font-sans">
          Start your<br />
          <span class="text-teal-300">shopping journey.</span>
        </h2>
        <p class="text-xl text-teal-50/80 max-w-md leading-relaxed font-light">
          Create your free account and unlock access to hundreds of verified vendors and exclusive member deals.
        </p>
      </div>

      <!-- UI Cards Animated Slider (3D Coverflow) -->
      <app-auth-slider></app-auth-slider>

      <!-- Features snippet -->
      <div class="mt-auto border-t border-white/10 pt-8 pb-4">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-sm text-teal-300 font-bold tracking-wider uppercase">Why choose Budgetha?</span>
        </div>
        <p class="text-lg font-medium text-white/90 leading-snug">
          Experience a smarter way to shop with confidence. Compare prices instantly, discover authentic products, and connect with trusted vendors across our platform.
        </p>
      </div>
    </div>
  </div>

  <!-- ── Right Form Panel ── -->
  <div class="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-pan-bg">
    
    <!-- Optional: Super soft glowing orb in background of right panel to make it even more magical -->
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Form Container -->
    <div class="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white relative z-10">
      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center justify-center gap-2 mb-10">
        <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
        <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
        <p class="mt-2 text-slate-500">Join Budgetha and start shopping smarter</p>
      </div>

      <!-- Register form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Name row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              autocomplete="given-name"
              class="input-field bg-white/50 focus:bg-white"
              [class.input-error]="form.get('firstName')?.touched && form.get('firstName')?.invalid"
              placeholder="John" />
            @if (form.get('firstName')?.touched && form.get('firstName')?.hasError('required')) {
              <p class="mt-1.5 text-xs text-red-500">Required.</p>
            }
            @if (form.get('firstName')?.touched && form.get('firstName')?.hasError('minlength')) {
              <p class="mt-1.5 text-xs text-red-500">At least 2 characters.</p>
            }
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              autocomplete="family-name"
              class="input-field bg-white/50 focus:bg-white"
              [class.input-error]="form.get('lastName')?.touched && form.get('lastName')?.invalid"
              placeholder="Doe" />
            @if (form.get('lastName')?.touched && form.get('lastName')?.hasError('required')) {
              <p class="mt-1.5 text-xs text-red-500">Required.</p>
            }
            @if (form.get('lastName')?.touched && form.get('lastName')?.hasError('minlength')) {
              <p class="mt-1.5 text-xs text-red-500">At least 2 characters.</p>
            }
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="input-field bg-white/50 focus:bg-white"
            [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
            placeholder="you@example.com" />
          @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
          }
          @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
            <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
          }
        </div>

        <!-- Password + strength meter -->
        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              autocomplete="new-password"
              class="input-field pr-11 bg-white/50 focus:bg-white"
              [class.input-error]="form.get('password')?.touched && form.get('password')?.invalid"
              placeholder="Create a strong password" />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (showPassword()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                }
              </svg>
            </button>
          </div>
          <!-- Strength meter -->
          @if (form.get('password')?.value) {
            <div class="mt-2.5 space-y-1.5">
              <div class="flex gap-1.5">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div class="h-1 flex-1 rounded-full transition-all duration-300"
                       [ngClass]="i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'">
                  </div>
                }
              </div>
              <p class="text-xs" [ngClass]="passwordStrength.score <= 1 ? 'text-red-500' : passwordStrength.score <= 3 ? 'text-amber-600' : 'text-emerald-600'">
                {{ passwordStrength.label }}
              </p>
            </div>
          }
          @if (form.get('password')?.touched && form.get('password')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Password is required.</p>
          }
          @if (form.get('password')?.touched && form.get('password')?.hasError('minlength')) {
            <p class="mt-1.5 text-xs text-red-500">Password must be at least 6 characters.</p>
          }
        </div>

        <!-- Confirm password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
          <div class="relative">
            <input
              id="confirmPassword"
              [type]="showConfirmPassword() ? 'text' : 'password'"
              formControlName="confirmPassword"
              autocomplete="new-password"
              class="input-field pr-11 bg-white/50 focus:bg-white"
              [class.input-error]="form.get('confirmPassword')?.touched && form.get('confirmPassword')?.invalid"
              placeholder="Repeat your password" />
            <button
              type="button"
              (click)="toggleConfirmPassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (showConfirmPassword()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                }
              </svg>
            </button>
          </div>
          @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Please confirm your password.</p>
          }
          @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('passwordMismatch')) {
            <p class="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
          }
        </div>

        <!-- Terms -->
        <p class="text-xs text-slate-400 leading-relaxed">
          By creating an account, you agree to our
          <a routerLink="/legal/terms" class="text-teal-600 hover:text-teal-700 font-medium">Terms of Service</a>
          and
          <a routerLink="/legal/privacy" class="text-teal-600 hover:text-teal-700 font-medium">Privacy Policy</a>.
        </p>

        <!-- Submit -->
        <button type="submit" [disabled]="loading()" class="btn-primary w-full bg-teal-700 hover:bg-teal-800 focus:ring-teal-500/50">
          @if (loading()) {
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Creating account…
          } @else {
             Create account
          }
        </button>
      </form>

      <!-- Social divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-white/90 px-4 text-slate-400 uppercase tracking-wider">Or sign up with</span>
        </div>
      </div>

      <!-- Social buttons -->
      <div>
        <button type="button" (click)="googleLogin()" class="btn-social w-full justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p class="mt-8 text-center text-sm text-slate-500">
        Already have an account?
        <a routerLink="/auth/login" [queryParams]="linkQuery" class="font-semibold text-teal-600 hover:text-teal-700 transition-colors">Sign in</a>
      </p>
    </div>
  </div>
</div>
```

### File: src/frontend/src/app/features/auth/register/register.component.scss
```scss
:host {
  display: block;
}
```

### File: src/frontend/src/app/features/auth/register/register.component.ts
```typescript
import { Component, signal, NgZone, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

import { AuthSliderComponent } from '../../../shared/components/auth-slider/auth-slider.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthSliderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  
  private get returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
    if (target.startsWith('/auth/')) return '/';
    return target;
  }

  
  get linkQuery(): { returnUrl: string | null } {
    const target = this.returnUrl;
    return { returnUrl: target === '/' ? null : target };
  }

  get passwordStrength(): { score: number; label: string; color: string } {
    const password = this.form?.get('password')?.value || '';
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 5, label: 'Excellent', color: 'bg-emerald-600' };
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fix the highlighted fields before continuing.');
      return;
    }

    const { confirmPassword, ...payload } = this.form.value;

    this.loading.set(true);
    this.authService.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        
        
        this.toastService.success('Your account is ready. Welcome to Budgetha!');
        
        const u = this.authService.user();
        let target = this.returnUrl;
        const isAdminRoute = target.startsWith('/admin');
        const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
        
        if (isAdminRoute && !hasAdminPrivileges) {
          target = '/';
        }
        
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  googleLogin(): void {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In isn’t available right now. Please sign up with your email instead.');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this.ngZone.run(() => {
          this.loading.set(true);
          this.authService.googleLogin(response.credential).subscribe({
            next: () => {
              this.loading.set(false);
              this.toastService.success('Signed up with Google.');
              
              const u = this.authService.user();
              let target = this.returnUrl;
              const isAdminRoute = target.startsWith('/admin');
              const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
              
              if (isAdminRoute && !hasAdminPrivileges) {
                target = '/';
              }
              
              this.router.navigateByUrl(target);
            },
            error: () => {
              this.loading.set(false);
            }
          });
        });
      }
    });

    google.accounts.id.prompt();
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...(confirmPassword.errors ?? {}), passwordMismatch: true });
    return { passwordMismatch: true };
  }

  
  if (confirmPassword.hasError('passwordMismatch')) {
    const { passwordMismatch, ...rest } = confirmPassword.errors ?? {};
    confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
  }
  return null;
}
```

### File: src/frontend/src/app/features/auth/reset-password/reset-password.component.ts
```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-slate-50">
      <div class="w-full max-w-[420px]">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <!-- Logo -->
          <div class="flex items-center justify-center sm:justify-start gap-2 mb-8 sm:-ml-2">
            <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
            <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
          </div>

          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Reset your password</h1>
            <p class="mt-2 text-sm text-slate-500">Enter the reset token from your email and choose a new password.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                class="input-field"
                [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                placeholder="you@example.com" />
              @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
              }
              @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
                <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
              }
            </div>

            <!-- Token -->
            <div>
              <label for="token" class="block text-sm font-medium text-slate-700 mb-1.5">Reset token</label>
              <input
                id="token"
                type="text"
                formControlName="token"
                class="input-field"
                [class.input-error]="form.get('token')?.touched && form.get('token')?.invalid"
                placeholder="Paste your reset token here" />
              @if (form.get('token')?.touched && form.get('token')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Reset token is required.</p>
              }
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <div class="relative">
                <input
                  id="newPassword"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="newPassword"
                  autocomplete="new-password"
                  class="input-field pr-11"
                  [class.input-error]="form.get('newPassword')?.touched && form.get('newPassword')?.invalid"
                  placeholder="Enter new password" />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showPassword()) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    }
                  </svg>
                </button>
              </div>
              @if (form.get('newPassword')?.touched && form.get('newPassword')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">New password is required.</p>
              }
              @if (form.get('newPassword')?.touched && form.get('newPassword')?.hasError('minlength')) {
                <p class="mt-1.5 text-xs text-red-500">Password must be at least 8 characters.</p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
              <input
                id="confirmPassword"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                autocomplete="new-password"
                class="input-field"
                [class.input-error]="form.get('confirmPassword')?.touched && form.get('confirmPassword')?.invalid"
                placeholder="Repeat new password" />
              @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Please confirm your new password.</p>
              }
              @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('passwordMismatch')) {
                <p class="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
              }
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Resetting...
              } @else {
                Reset password
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-slate-500">
            Remember your password?
            <a routerLink="/auth/login" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, token, newPassword } = this.form.value;
    this.authService.resetPassword(email, token, newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Password has been reset successfully. Please sign in.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Password reset failed. The token may be invalid or expired.');
      }
    });
  }
}
```

### File: src/frontend/src/app/features/cart/cart.component.ts
```typescript
import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, FormsModule, EmptyStateComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>

      @if (cart.items().length === 0) {
        <div class="card mt-8 max-w-2xl mx-auto">
          <app-empty-state
            icon="cart"
            title="Your cart is empty"
            message="Looks like you haven't added anything to your cart yet. Explore our catalog and find something you'll love."
            ctaLabel="Start Shopping"
            ctaLink="/shop" />
        </div>
      } @else {
        <div class="mt-8 grid lg:grid-cols-3 gap-8 items-start">
          <!-- ══ Item list ══ -->
          <div class="lg:col-span-2 card divide-y divide-slate-100">
            <div class="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span class="col-span-6">Product</span>
              <span class="col-span-3 text-center">Quantity</span>
              <span class="col-span-2 text-right">Subtotal</span>
              <span class="col-span-1"></span>
            </div>

            @for (item of cart.items(); track trackItem(item)) {
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-5 items-center">
                <!-- Product -->
                <div class="col-span-12 sm:col-span-6 flex items-center gap-4">
                  <a [routerLink]="['/products', item.slug]" class="shrink-0">
                    <img [src]="item.image" [alt]="item.name" class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-contain mix-blend-multiply bg-slate-100 p-2" />
                  </a>
                  <div class="min-w-0">
                    <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ item.brand }}</span>
                    <a [routerLink]="['/products', item.slug]" class="block text-sm font-semibold text-slate-900 hover:text-violet-600 transition-colors duration-300 leading-snug">
                      {{ item.name }}
                    </a>
                    @if (item.color || item.size) {
                      <p class="mt-1 text-xs text-slate-400">
                        {{ item.color }}{{ item.color && item.size ? ' · Size ' : item.size ? 'Size ' : '' }}{{ item.size }}
                      </p>
                    }
                    <p class="mt-1 text-sm font-bold text-slate-700 sm:hidden">{{ item.price | currency }}</p>
                    <p class="hidden sm:block mt-1 text-sm text-slate-500">{{ item.price | currency }} each</p>
                  </div>
                </div>

                <!-- Quantity -->
                <div class="col-span-7 sm:col-span-3 flex sm:justify-center">
                  <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button type="button" (click)="cart.updateQuantity(item, item.quantity - 1)" [attr.aria-label]="'Decrease quantity of ' + item.name" class="qty-btn h-8 w-8">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                    </button>
                    <span class="w-10 text-center text-sm font-bold text-slate-900" aria-live="polite">{{ item.quantity }}</span>
                    <button type="button" (click)="cart.updateQuantity(item, item.quantity + 1)" [disabled]="item.quantity >= item.stock" [attr.aria-label]="'Increase quantity of ' + item.name" class="qty-btn h-8 w-8">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                </div>

                <!-- Subtotal -->
                <div class="col-span-4 sm:col-span-2 text-right">
                  <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
                </div>

                <!-- Remove -->
                <div class="col-span-1 flex justify-end">
                  <button
                    type="button"
                    (click)="cart.remove(item)"
                    [attr.aria-label]="'Remove ' + item.name + ' from cart'"
                    class="icon-btn h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50">
                    <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            }

            <div class="px-6 py-4 flex items-center justify-between">
              <a routerLink="/shop" class="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue shopping
              </a>
              <button type="button" (click)="cart.clear()" class="text-sm font-medium text-slate-400 hover:text-rose-500 transition-colors duration-300">
                Clear cart
              </button>
            </div>
          </div>

          <!-- ══ Order summary ══ -->
          <aside class="card p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

            <!-- Promo code -->
            <div class="mt-5">
              @if (cart.promo(); as promo) {
                <div class="flex items-center justify-between rounded-xl bg-emerald-50 ring-1 ring-emerald-100 px-4 py-3">
                  <div>
                    <p class="text-sm font-bold text-emerald-700">{{ promo.code }}</p>
                    <p class="text-xs text-emerald-600">{{ promo.description }}</p>
                  </div>
                  <button type="button" (click)="cart.removePromo()" aria-label="Remove promo code" class="icon-btn h-8 w-8 text-emerald-500 hover:text-rose-500 hover:bg-rose-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              } @else {
                <form (submit)="applyPromo($event)" class="flex gap-2">
                  <input
                    type="text"
                    name="promo"
                    [(ngModel)]="promoInput"
                    placeholder="Promo code"
                    aria-label="Promo code"
                    class="input-field py-2.5 uppercase placeholder:normal-case"
                    [class.input-error]="promoError()" />
                  <button type="submit" class="btn-secondary px-4 py-2.5 whitespace-nowrap">Apply</button>
                </form>
                @if (promoError()) {
                  <p class="mt-1.5 text-xs text-red-500">That code isn't valid. Try WELCOME10 or SAVE20.</p>
                }
              }
            </div>

            <!-- Totals -->
            <dl class="mt-6 space-y-3.5 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Subtotal ({{ cart.count() }} items)</dt>
                <dd class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</dd>
              </div>
              @if (cart.discount() > 0) {
                <div class="flex justify-between">
                  <dt class="text-emerald-600">Discount</dt>
                  <dd class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</dd>
                </div>
              }
              <div class="flex justify-between">
                <dt class="text-slate-500">Shipping</dt>
                <dd class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                  {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Estimated tax</dt>
                <dd class="font-semibold text-slate-900">{{ cart.tax() | currency }}</dd>
              </div>
              <div class="flex justify-between border-t border-slate-100 pt-4 text-base">
                <dt class="font-bold text-slate-900">Total</dt>
                <dd class="font-extrabold text-slate-900">{{ cart.total() | currency }}</dd>
              </div>
            </dl>

            <a routerLink="/checkout" class="btn-primary w-full mt-6 py-4 text-base">
              Proceed to Checkout
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Secure 256-bit SSL encrypted checkout
            </div>
          </aside>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  readonly cart = inject(CartService);

  promoInput = '';
  readonly promoError = signal(false);

  trackItem(item: CartItem): string {
    return `${item.productId}-${item.color ?? ''}-${item.size ?? ''}`;
  }

  applyPromo(event: Event): void {
    event.preventDefault();
    if (!this.promoInput.trim()) return;
    const ok = this.cart.applyPromo(this.promoInput);
    this.promoError.set(!ok);
    if (ok) this.promoInput = '';
  }
}
```

### File: src/frontend/src/app/features/catalog/catalog.component.ts
```typescript
import { Component, computed, inject, signal, effect } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CatalogResult, Product, SortOption } from '../../core/models/shop.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-catalog',
  imports: [CurrencyPipe, NgTemplateOutlet, RouterLink, ProductCardComponent, EmptyStateComponent, StarRatingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
      <!-- Breadcrumb + heading -->
      <nav class="text-xs text-slate-400 flex items-center gap-1.5" aria-label="Breadcrumb">
        <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
        <span>/</span>
        <span class="text-slate-600 font-medium">Shop</span>
      </nav>
      <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {{ pageTitle() }}
          </h1>
          <p class="mt-1 text-sm text-slate-500">{{ result().total }} {{ result().total === 1 ? 'product' : 'products' }} found</p>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-3">
          <!-- Mobile filter toggle -->
          <button
            type="button"
            (click)="filtersOpen.set(true)"
            class="lg:hidden btn-secondary px-4 py-2.5 text-sm gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filters
            @if (activeFilterCount() > 0) {
              <span class="badge bg-violet-600 text-white">{{ activeFilterCount() }}</span>
            }
          </button>

          <!-- Sort -->
          <div class="relative">
            <select
              [value]="sort()"
              (change)="setSort($event)"
              aria-label="Sort products"
              class="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer
                     transition-all duration-300">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <!-- View toggle -->
          <div class="hidden sm:inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              (click)="view.set('grid')"
              aria-label="Grid view"
              [attr.aria-pressed]="view() === 'grid'"
              class="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
              [class]="view() === 'grid' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="view.set('list')"
              aria-label="List view"
              [attr.aria-pressed]="view() === 'list'"
              class="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
              [class]="view() === 'list' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex gap-8">
        <!-- ══ Sidebar filters (desktop) ══ -->
        <aside class="hidden lg:block w-64 shrink-0 space-y-6">
          <ng-container *ngTemplateOutlet="filterPanel"></ng-container>
        </aside>

        <!-- ══ Mobile filter drawer ══ -->
        @if (filtersOpen()) {
          <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" (click)="filtersOpen.set(false)" aria-hidden="true"></div>
          <aside class="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto p-5 lg:hidden animate-[slideInLeft_0.3s_ease-out]"
                 role="dialog" aria-modal="true" aria-label="Filters">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-slate-900">Filters</h2>
              <button type="button" (click)="filtersOpen.set(false)" aria-label="Close filters" class="icon-btn h-9 w-9 bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="space-y-6">
              <ng-container *ngTemplateOutlet="filterPanel"></ng-container>
            </div>
          </aside>
        }

        <!-- ══ Filter panel template (shared desktop/mobile) ══ -->
        <ng-template #filterPanel>
          <!-- Active filters / clear -->
          @if (activeFilterCount() > 0) {
            <div class="card p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-900">{{ activeFilterCount() }} active {{ activeFilterCount() === 1 ? 'filter' : 'filters' }}</span>
                <button type="button" (click)="clearFilters()" class="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                  Clear all
                </button>
              </div>
            </div>
          }

          <!-- Categories -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
            <div class="space-y-2.5">
              @for (category of categories(); track category.id) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    [checked]="selectedCategories().includes(category.slug)"
                    (change)="toggleCategory(category.slug)"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 transition-colors duration-200" />
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors duration-200 flex-1">{{ category.name }}</span>
                  <span class="text-xs text-slate-400">{{ category.productCount }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Price range -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
            <div class="relative h-6 mt-1">
              <div class="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-slate-100"></div>
              <div
                class="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-violet-500"
                [style.left.%]="minPercent()"
                [style.width.%]="maxPercent() - minPercent()"></div>
              <input
                type="range"
                class="range-slider top-1/2 -translate-y-1/2 z-10"
                [min]="bounds().min" [max]="bounds().max" [step]="5"
                [value]="minPrice()"
                (input)="setMinPrice($event)"
                aria-label="Minimum price" />
              <input
                type="range"
                class="range-slider top-1/2 -translate-y-1/2 z-20"
                [min]="bounds().min" [max]="bounds().max" [step]="5"
                [value]="maxPrice()"
                (input)="setMaxPrice($event)"
                aria-label="Maximum price" />
            </div>

            <div class="mt-4 flex items-center justify-between gap-3">
              <div class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center">
                <span class="block text-[10px] uppercase tracking-wider text-slate-400">Min</span>
                <span class="text-sm font-bold text-slate-900">{{ minPrice() | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
              </div>
              <span class="text-slate-300">—</span>
              <div class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center">
                <span class="block text-[10px] uppercase tracking-wider text-slate-400">Max</span>
                <span class="text-sm font-bold text-slate-900">{{ maxPrice() | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
              </div>
            </div>
          </div>

          <!-- Brands -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Brands</h3>
            <div class="space-y-2.5">
              @for (brand of brands(); track brand) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    [checked]="selectedBrands().includes(brand)"
                    (change)="toggleBrand(brand)"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 transition-colors duration-200" />
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors duration-200">{{ brand }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Rating -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Rating</h3>
            <div class="space-y-2">
              @for (threshold of [4, 3, 2]; track threshold) {
                <button
                  type="button"
                  (click)="minRating.set(minRating() === threshold ? 0 : threshold); page.set(1)"
                  class="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-200"
                  [class]="minRating() === threshold ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-slate-50'">
                  <app-star-rating [rating]="threshold" size="sm" />
                  <span class="text-sm text-slate-600">&amp; up</span>
                </button>
              }
            </div>
          </div>
        </ng-template>

        <!-- ══ Results ══ -->
        <div class="flex-1 min-w-0">
          @if (result().items.length === 0) {
            <div class="card">
              <app-empty-state
                [icon]="wishlistOnly() ? 'wishlist' : 'search'"
                [title]="wishlistOnly() ? 'Your wishlist is empty' : 'No products match your filters'"
                [message]="wishlistOnly() ? 'Save your favorite items here to review them later and purchase when you are ready.' : 'Try widening the price range, removing a brand filter, or searching for something else.'"
                [ctaLabel]="wishlistOnly() ? 'Explore products' : 'Clear all filters'"
                ctaLink="/shop" />
            </div>
          } @else {
            @if (view() === 'grid') {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (product of result().items; track product.id) {
                  <app-product-card [product]="product" layout="grid" />
                }
              </div>
            } @else {
              <div class="space-y-5">
                @for (product of result().items; track product.id) {
                  <app-product-card [product]="product" layout="list" />
                }
              </div>
            }

            <!-- Pagination -->
            @if (result().totalPages > 1) {
              <nav class="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  (click)="goToPage(page() - 1)"
                  [disabled]="page() === 1"
                  aria-label="Previous page"
                  class="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500
                         hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500
                         transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                @for (p of pages(); track p) {
                  <button
                    type="button"
                    (click)="goToPage(p)"
                    [attr.aria-current]="page() === p ? 'page' : null"
                    class="h-10 min-w-10 px-2 rounded-xl text-sm font-semibold flex items-center justify-center transition-all duration-300"
                    [class]="page() === p
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600'">
                    {{ p }}
                  </button>
                }

                <button
                  type="button"
                  (click)="goToPage(page() + 1)"
                  [disabled]="page() === result().totalPages"
                  aria-label="Next page"
                  class="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500
                         hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500
                         transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </nav>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  `,
})
export class CatalogComponent {
  private readonly productService = inject(ProductService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly brands = toSignal(this.productService.getBrands(), { initialValue: [] }); 
  
  
  readonly bounds = toSignal(this.productService.priceBounds(), { initialValue: { min: 0, max: 10000 } });

  readonly search = signal('');
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedBrands = signal<string[]>([]);
  readonly minPrice = signal(0);
  readonly maxPrice = signal(10000);
  readonly minRating = signal(0);
  readonly sort = signal<SortOption>('featured');
  readonly page = signal(1);
  readonly view = signal<'grid' | 'list'>('grid');
  readonly filtersOpen = signal(false);
  readonly dealsOnly = signal(false);
  readonly wishlistOnly = signal(false);

  
  
  
  
  
  
  
  readonly result = signal<CatalogResult>({ items: [], total: 0, totalPages: 1 });

  readonly pages = computed(() => Array.from({ length: this.result().totalPages }, (_, i) => i + 1));

  readonly activeFilterCount = computed(
    () =>
      this.selectedCategories().length +
      this.selectedBrands().length +
      (this.minRating() > 0 ? 1 : 0) +
      (this.minPrice() > this.bounds().min || this.maxPrice() < this.bounds().max ? 1 : 0) +
      (this.dealsOnly() ? 1 : 0)
  );

  readonly pageTitle = computed(() => {
    if (this.wishlistOnly()) return 'My Wishlist';
    if (this.dealsOnly()) return 'Today’s Deals';
    if (this.search()) return `Results for “${this.search()}”`;
    if (this.selectedCategories().length === 1) {
      return this.categories().find(c => c.slug === this.selectedCategories()[0])?.name ?? 'Shop';
    }
    return 'All Products';
  });

  readonly minPercent = computed(() => {
    const min = this.bounds().min;
    const max = this.bounds().max;
    if (max === min) return 0;
    const pct = ((this.minPrice() - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  });
  readonly maxPercent = computed(() => {
    const min = this.bounds().min;
    const max = this.bounds().max;
    if (max === min) return 100;
    const pct = ((this.maxPrice() - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.search.set(params.get('search') ?? '');
      const category = params.get('category');
      this.selectedCategories.set(category ? [category] : []);
      const brand = params.get('brand');
      this.selectedBrands.set(brand ? [brand] : []);
      this.dealsOnly.set(params.get('deals') === '1');
      this.wishlistOnly.set(params.get('wishlist') === '1');
      const sort = params.get('sort') as SortOption | null;
      if (sort && ['featured', 'newest', 'price-asc', 'price-desc', 'rating'].includes(sort)) {
        this.sort.set(sort);
      }
      this.page.set(1);
    });

    
    this.productService.priceBounds().pipe(takeUntilDestroyed()).subscribe(b => {
       this.minPrice.set(b.min);
       this.maxPrice.set(b.max);
    });

    
    effect(() => {
      const q = {
        search: this.search(),
        categories: this.selectedCategories(),
        brands: this.selectedBrands(),
        minPrice: this.minPrice(),
        maxPrice: this.maxPrice(),
        minRating: this.minRating(),
        sort: this.sort(),
        page: this.wishlistOnly() || this.dealsOnly() ? 1 : this.page(),
        pageSize: this.wishlistOnly() || this.dealsOnly() ? 100 : PAGE_SIZE,
      };
      this.productService.query(q).subscribe(res => {
        let items = res?.items || [];
        if (this.dealsOnly()) {
          items = items.filter(p => p.originalPrice && p.originalPrice > p.price);
        }
        if (this.wishlistOnly()) {
          const ids = this.wishlist.ids();
          items = items.filter(p => ids.includes(p.id));
        }
        
        let total = res.total;
        let totalPages = res.totalPages;
        
        if (this.wishlistOnly() || this.dealsOnly()) {
          total = items.length;
          totalPages = Math.ceil(total / PAGE_SIZE);
          
          const start = (this.page() - 1) * PAGE_SIZE;
          items = items.slice(start, start + PAGE_SIZE);
        }
        
        this.result.set({ items, total, totalPages });
      });
    });
  }

  toggleCategory(slug: string): void {
    this.selectedCategories.update(list =>
      list.includes(slug) ? list.filter(s => s !== slug) : [...list, slug]
    );
    this.page.set(1);
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.update(list =>
      list.includes(brand) ? list.filter(b => b !== brand) : [...list, brand]
    );
    this.page.set(1);
  }

  setMinPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.minPrice.set(Math.min(value, this.maxPrice() - 5));
    this.page.set(1);
  }

  setMaxPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.maxPrice.set(Math.max(value, this.minPrice() + 5));
    this.page.set(1);
  }

  setSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortOption);
    this.page.set(1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.result().totalPages) return;
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.minPrice.set(this.bounds().min);
    this.maxPrice.set(this.bounds().max);
    this.minRating.set(0);
    this.dealsOnly.set(false);
    this.page.set(1);
    this.router.navigate(['/shop']);
  }
}
```

### File: src/frontend/src/app/features/checkout/checkout.component.ts
```typescript
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AccountService } from '../../core/services/account.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Address } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

type PaymentMethod = 'paypal' | 'cod';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule, EmptyStateComponent, NgxPayPalModule],
  template: `
    @if (cart.items().length === 0) {
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="cart"
            title="Nothing to check out"
            message="Your cart is empty. Add a few items first, then come back to complete your order."
            ctaLabel="Start Shopping"
            ctaLink="/shop" />
        </div>
      </div>
    } @else {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <!-- Progress -->
        <nav class="flex items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm" aria-label="Checkout progress">
          <a routerLink="/cart" class="flex items-center gap-2 text-violet-600 font-semibold">
            <span class="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </span>
            Cart
          </a>
          <span class="w-8 sm:w-14 h-px bg-violet-300"></span>
          <span class="flex items-center gap-2 text-violet-700 font-bold">
            <span class="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            Checkout
          </span>
          <span class="w-8 sm:w-14 h-px bg-slate-200"></span>
          <span class="flex items-center gap-2 text-slate-400 font-medium">
            <span class="h-6 w-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
            Confirmation
          </span>
        </nav>

        <h1 class="mt-8 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Checkout</h1>

        <form [formGroup]="form" (ngSubmit)="placeOrder()" class="mt-8 grid lg:grid-cols-5 gap-8 items-start">
          <!-- ══ Left column ══ -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Contact -->
            <section class="card p-6">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">1</span>
                Contact Information
              </h2>
              <div class="mt-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input id="email" type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"
                         class="input-field" [class.input-error]="invalid('email')" />
                  @if (invalid('email')) {
                    <p class="mt-1.5 text-xs text-red-500">A valid email is required for your receipt.</p>
                  }
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
                  <input id="phone" type="tel" formControlName="phone" autocomplete="tel" placeholder="+1 (555) 000-0000"
                         class="input-field" [class.input-error]="invalid('phone')" />
                  @if (invalid('phone')) {
                    <p class="mt-1.5 text-xs text-red-500">Phone number is required for delivery updates.</p>
                  }
                </div>
              </div>
            </section>

            <!-- Shipping -->
            <section class="card p-6">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">2</span>
                  Delivery Address
                </h2>
                @if (savedAddresses.length) {
                  <div class="flex gap-2">
                    @for (address of savedAddresses; track address.id) {
                      <button type="button" (click)="useAddress(address)"
                              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600
                                     hover:border-violet-300 hover:text-violet-700 transition-all duration-300">
                        Use “{{ address.label }}”
                      </button>
                    }
                  </div>
                }
              </div>

              <div class="mt-5 grid sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input id="fullName" type="text" formControlName="fullName" autocomplete="name" placeholder="Jane Doe"
                         class="input-field" [class.input-error]="invalid('fullName')" />
                  @if (invalid('fullName')) {
                    <p class="mt-1.5 text-xs text-red-500">Full name is required.</p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label for="line1" class="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
                  <input id="line1" type="text" formControlName="line1" autocomplete="address-line1" placeholder="123 Main Street"
                         class="input-field" [class.input-error]="invalid('line1')" />
                  @if (invalid('line1')) {
                    <p class="mt-1.5 text-xs text-red-500">Street address is required.</p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label for="line2" class="block text-sm font-medium text-slate-700 mb-1.5">Apartment, suite, etc. <span class="text-slate-400 font-normal">(optional)</span></label>
                  <input id="line2" type="text" formControlName="line2" autocomplete="address-line2" placeholder="Apt 4B" class="input-field" />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input id="city" type="text" formControlName="city" autocomplete="address-level2" placeholder="Springfield"
                         class="input-field" [class.input-error]="invalid('city')" />
                  @if (invalid('city')) {
                    <p class="mt-1.5 text-xs text-red-500">City is required.</p>
                  }
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="state" class="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                    <input id="state" type="text" formControlName="state" autocomplete="address-level1" placeholder="IL"
                           class="input-field" [class.input-error]="invalid('state')" />
                    @if (invalid('state')) {
                      <p class="mt-1.5 text-xs text-red-500">Required.</p>
                    }
                  </div>
                  <div>
                    <label for="zip" class="block text-sm font-medium text-slate-700 mb-1.5">ZIP code</label>
                    <input id="zip" type="text" formControlName="zip" autocomplete="postal-code" placeholder="62704"
                           class="input-field" [class.input-error]="invalid('zip')" />
                    @if (invalid('zip')) {
                      <p class="mt-1.5 text-xs text-red-500">Valid ZIP required.</p>
                    }
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="country" class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <select id="country" formControlName="country" autocomplete="country-name" class="input-field">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Australia</option>
                    <option>United Arab Emirates</option>
                    <option>Saudi Arabia</option>
                    <option>Jordan</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Payment -->
            <section class="card p-6">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>

              <div class="mt-5 grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Payment method">
                <!-- PayPal option -->
                <button type="button" role="radio" [attr.aria-checked]="paymentMethod() === 'paypal'" (click)="paymentMethod.set('paypal')"
                        class="rounded-2xl border-2 p-4 text-left transition-all duration-300"
                        [class]="paymentMethod() === 'paypal' ? 'border-violet-600 bg-violet-50/60 shadow-md shadow-violet-100' : 'border-slate-200 hover:border-slate-300'">
                  <svg class="w-7 h-7 mb-2" viewBox="0 0 24 24" fill="none">
                    <path d="M7.076 21.337H4.13a.64.64 0 01-.633-.74L6.222 3.384a.77.77 0 01.76-.65h6.673c2.217 0 3.916.472 4.933 1.404.95.87 1.322 2.083 1.106 3.72-.023.15-.048.302-.078.458-.71 3.65-3.14 4.913-6.24 4.913h-1.58a.77.77 0 00-.76.65l-.81 5.148-.15 1.31z" [attr.fill]="paymentMethod() === 'paypal' ? '#003087' : '#94a3b8'"/>
                    <path d="M19.62 7.858c-.023.15-.048.302-.078.458-.71 3.65-3.14 4.913-6.24 4.913h-1.58a.77.77 0 00-.76.65l-1.04 6.6a.54.54 0 00.534.625h2.79a.673.673 0 00.665-.568l.027-.142.526-3.336.034-.183a.673.673 0 01.665-.569h.418c2.712 0 4.835-1.101 5.455-4.288.26-1.33.126-2.442-.56-3.223a2.68 2.68 0 00-.856-.637z" [attr.fill]="paymentMethod() === 'paypal' ? '#0070E0' : '#cbd5e1'"/>
                  </svg>
                  <p class="text-sm font-bold text-slate-900">PayPal</p>
                  <p class="text-xs text-slate-400 mt-0.5">Fast &amp; buyer protected</p>
                </button>

                <!-- COD option -->
                <button type="button" role="radio" [attr.aria-checked]="paymentMethod() === 'cod'" (click)="paymentMethod.set('cod')"
                        class="rounded-2xl border-2 p-4 text-left transition-all duration-300"
                        [class]="paymentMethod() === 'cod' ? 'border-violet-600 bg-violet-50/60 shadow-md shadow-violet-100' : 'border-slate-200 hover:border-slate-300'">
                  <svg class="w-7 h-7 mb-2" [class]="paymentMethod() === 'cod' ? 'text-violet-600' : 'text-slate-400'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <p class="text-sm font-bold text-slate-900">Cash on Delivery</p>
                  <p class="text-xs text-slate-400 mt-0.5">Pay when it arrives</p>
                </button>
              </div>

              @if (paymentMethod() === 'paypal') {
                <div class="mt-6">
                  <p class="text-sm text-slate-600 mb-4">Click the button below to log in to PayPal and complete your purchase securely.</p>
                  
                  @if (form.valid) {
                    <!-- Render PayPal Button -->
                    <ngx-paypal [config]="payPalConfig"></ngx-paypal>
                  } @else {
                    <div class="rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-700">
                      Please fill in your Contact Information and Delivery Address above to unlock the PayPal checkout.
                    </div>
                  }
                </div>
              } @else {
                <div class="mt-6 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 p-5 flex items-center gap-4">
                  <svg class="w-8 h-8 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <p class="text-sm text-slate-700 leading-relaxed">
                    Pay <span class="font-bold">{{ cart.total() | currency }}</span> in cash when your order arrives.
                    Please have the exact amount ready for the courier.
                  </p>
                </div>
                
                @if (form.invalid) {
                  <div class="mt-4 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-700">
                    Please fill in your Contact Information and Delivery Address above to place your order.
                  </div>
                }
              }
            </section>
          </div>

          <!-- ══ Right column: sticky summary ══ -->
          <aside class="lg:col-span-2 card p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

            <ul class="mt-5 space-y-4 max-h-72 overflow-y-auto pr-1">
              @for (item of cart.items(); track item.productId + (item.color ?? '') + (item.size ?? '')) {
                <li class="flex items-center gap-3.5">
                  <div class="relative shrink-0">
                    <img [src]="item.image" [alt]="item.name" class="h-16 w-16 rounded-xl object-contain mix-blend-multiply bg-slate-100 p-1" />
                    <span class="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                      {{ item.quantity }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">{{ item.color }}{{ item.color && item.size ? ' · ' : '' }}{{ item.size }}</p>
                  </div>
                  <span class="text-sm font-bold text-slate-900 shrink-0">{{ item.price * item.quantity | currency }}</span>
                </li>
              }
            </ul>

            <dl class="mt-6 space-y-3 text-sm border-t border-slate-100 pt-5">
              <div class="flex justify-between">
                <dt class="text-slate-500">Subtotal</dt>
                <dd class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</dd>
              </div>
              @if (cart.discount() > 0) {
                <div class="flex justify-between">
                  <dt class="text-emerald-600">Discount ({{ cart.promo()?.code }})</dt>
                  <dd class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</dd>
                </div>
              }
              <div class="flex justify-between">
                <dt class="text-slate-500">Shipping</dt>
                <dd class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                  {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Tax</dt>
                <dd class="font-semibold text-slate-900">{{ cart.tax() | currency }}</dd>
              </div>
              <div class="flex justify-between border-t border-slate-100 pt-4 text-lg">
                <dt class="font-bold text-slate-900">Total</dt>
                <dd class="font-extrabold text-slate-900">{{ cart.total() | currency }}</dd>
              </div>
            </dl>

            @if (submitted() && form.invalid) {
              <div class="mt-5 rounded-xl bg-red-50 ring-1 ring-red-100 px-4 py-3 flex items-start gap-2.5">
                <svg class="w-4.5 h-4.5 w-[18px] h-[18px] text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p class="text-xs text-red-600 leading-relaxed">Please fix the highlighted fields above.</p>
              </div>
            }

            @if (paymentMethod() === 'cod') {
              <button type="submit" [disabled]="placing() || form.invalid" class="btn-primary w-full mt-6 py-4 sm:py-5 text-base sm:text-lg shadow-lg shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                @if (placing()) {
                  <svg class="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Placing order…
                } @else {
                  Place Order — {{ cart.total() | currency }}
                }
              </button>
            }

            <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Protected by buyer guarantee · SSL encrypted
            </div>
          </aside>
        </form>
      </div>
    }
  `,
})
export class CheckoutComponent implements OnInit {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly account = inject(AccountService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public payPalConfig?: IPayPalConfig;

  readonly paymentMethod = signal<PaymentMethod>('paypal');
  readonly placing = signal(false);
  readonly submitted = signal(false);

  readonly savedAddresses = this.account.addresses();

  readonly form = this.fb.group({
    email: [this.auth.user()?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    fullName: [this.defaultName(), Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z\- ]{3,10}$/)]],
    country: ['United States', Validators.required],
  });

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb', 
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.cart.total().toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.cart.subtotal().toFixed(2)
                },
                tax_total: {
                  currency_code: 'USD',
                  value: this.cart.tax().toFixed(2)
                },
                shipping: {
                  currency_code: 'USD',
                  value: this.cart.shipping().toFixed(2)
                },
                discount: {
                  currency_code: 'USD',
                  value: this.cart.discount().toFixed(2)
                }
              }
            },
            items: this.cart.items().map(i => ({
              name: i.name,
              quantity: i.quantity.toString(),
              unit_amount: {
                currency_code: 'USD',
                value: i.price.toFixed(2),
              },
            }))
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        
        this.placing.set(true);
        actions.order.get().then((details: any) => {
          
        });
      },
      onClientAuthorization: (data) => {
        
        this.completeOrder('PayPal Transaction ID: ' + data.id);
      },
      onCancel: (data, actions) => {
        this.placing.set(false);
        this.toast.info('PayPal payment cancelled');
      },
      onError: err => {
        this.placing.set(false);
        this.toast.error('An error occurred during PayPal payment');
        console.log('PayPal Error', err);
      },
      onClick: (data, actions) => {
        
        this.submitted.set(true);
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.toast.error('Please complete your delivery address first.');
          
          
        }
      },
    };
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  useAddress(address: Address): void {
    this.form.patchValue({
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
    });
    this.toast.info(`Address “${address.label}” applied`);
  }

  placeOrder(): void {
    if (this.paymentMethod() !== 'cod') {
      return; 
    }

    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please complete the highlighted fields.');
      return;
    }

    this.placing.set(true);
    
    setTimeout(() => {
      this.completeOrder('Cash on Delivery');
    }, 900);
  }

  private completeOrder(paymentSummary: string): void {
    const v = this.form.getRawValue();
    const order = this.orders.placeOrder({
      items: this.cart.items(),
      subtotal: this.cart.subtotal(),
      shipping: this.cart.shipping(),
      tax: this.cart.tax(),
      discount: this.cart.discount(),
      total: this.cart.total(),
      address: {
        id: 0,
        label: 'Shipping',
        fullName: v.fullName!,
        line1: v.line1!,
        line2: v.line2 || undefined,
        city: v.city!,
        state: v.state!,
        zip: v.zip!,
        country: v.country!,
        phone: v.phone!,
        isDefault: false,
      },
      paymentSummary,
    });
    this.cart.clear();
    this.placing.set(false);
    this.router.navigate(['/checkout/success', order.number]);
  }

  private defaultName(): string {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}`.trim() : '';
  }
}
```

### File: src/frontend/src/app/features/checkout/order-success.component.ts
```typescript
import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-success',
  imports: [CurrencyPipe, DatePipe, RouterLink, EmptyStateComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      @if (order(); as o) {
        <!-- Success header -->
        <div class="text-center">
          <div class="relative inline-flex mb-6">
            <div class="absolute inset-0 bg-emerald-300/50 rounded-full blur-2xl scale-125"></div>
            <div class="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-[pop_0.4s_ease-out]">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Order confirmed!</h1>
          <p class="mt-3 text-slate-500 leading-relaxed max-w-md mx-auto">
            Thank you for shopping with Budgetha. A confirmation email is on its way — your order is being prepared right now.
          </p>
          <div class="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-50 ring-1 ring-violet-100 px-5 py-2">
            <span class="text-sm text-slate-500">Order number</span>
            <span class="text-sm font-bold text-violet-700 tracking-wide">{{ o.number }}</span>
          </div>
        </div>

        <!-- Order details card -->
        <div class="card mt-10 overflow-hidden">
          <div class="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/60">
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Order date</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ o.date | date: 'MMMM d, y' }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Payment</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ o.paymentSummary }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Ships to</p>
              <p class="mt-1 text-sm font-bold text-slate-900 truncate">{{ o.shippingAddress }}</p>
            </div>
          </div>

          <ul class="divide-y divide-slate-100">
            @for (item of o.items; track item.productId + (item.color ?? '') + (item.size ?? '')) {
              <li class="flex items-center gap-4 px-6 py-4">
                <img [src]="item.image" [alt]="item.name" class="h-16 w-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Qty {{ item.quantity }}{{ item.color ? ' · ' + item.color : '' }}{{ item.size ? ' · ' + item.size : '' }}
                  </p>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
              </li>
            }
          </ul>

          <dl class="border-t border-slate-100 px-6 py-5 space-y-2.5 text-sm bg-slate-50/40">
            <div class="flex justify-between"><dt class="text-slate-500">Subtotal</dt><dd class="font-semibold text-slate-900">{{ o.subtotal | currency }}</dd></div>
            @if (o.discount > 0) {
              <div class="flex justify-between"><dt class="text-emerald-600">Discount</dt><dd class="font-semibold text-emerald-600">-{{ o.discount | currency }}</dd></div>
            }
            <div class="flex justify-between"><dt class="text-slate-500">Shipping</dt><dd class="font-semibold text-slate-900">{{ o.shipping === 0 ? 'Free' : (o.shipping | currency) }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Tax</dt><dd class="font-semibold text-slate-900">{{ o.tax | currency }}</dd></div>
            <div class="flex justify-between pt-3 border-t border-slate-200 text-base"><dt class="font-bold text-slate-900">Total</dt><dd class="font-extrabold text-slate-900">{{ o.total | currency }}</dd></div>
          </dl>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/account/orders" class="btn-secondary w-full sm:w-auto">Track My Orders</a>
          <a routerLink="/shop" class="btn-primary w-full sm:w-auto">Continue Shopping</a>
        </div>
      } @else {
        <div class="card">
          <app-empty-state
            icon="orders"
            title="Order not found"
            message="We couldn't find that order. It may belong to a different account or the link is incorrect."
            ctaLabel="View My Orders"
            ctaLink="/account/orders" />
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  `,
})
export class OrderSuccessComponent {
  private readonly orders = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  private readonly orderNumber = toSignal(
    this.route.paramMap.pipe(map(params => params.get('number') ?? '')),
    { initialValue: '' }
  );

  readonly order = computed(() => this.orders.getByNumber(this.orderNumber()));
}
```

### File: src/frontend/src/app/features/home/home.component.ts
```typescript
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  template: `
    <!-- ══ Hero ══ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800">
      <!-- Decorative blurs -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 right-10 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-left">
          <span class="badge bg-white/10 text-teal-200 ring-1 ring-white/20 backdrop-blur px-4 py-1.5">
            Summer Sale — up to 40% off
          </span>
          <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Shop smarter.<br />
            <span class="bg-gradient-to-r from-teal-300 to-teal-100 bg-clip-text text-transparent">Spend wiser.</span>
          </h1>
          <p class="mt-6 text-lg text-teal-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Discover hand-picked deals from 200+ trusted vendors. Premium quality, honest prices, delivered to your door.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a routerLink="/shop" class="btn-primary bg-teal-600 hover:bg-teal-500 px-8 py-4 text-base shadow-lg shadow-teal-950/40">
              Shop the Collection
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a routerLink="/shop" [queryParams]="{ deals: 1 }"
               class="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white
                      ring-1 ring-white/30 hover:bg-white/10 transition-all duration-300">
              Browse Deals
            </a>
          </div>

          <!-- Trust stats -->
          <div class="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
            <div class="text-center lg:text-left">
              <div class="text-2xl font-bold text-white">50K+</div>
              <div class="text-xs text-teal-200/70 mt-1">Happy Shoppers</div>
            </div>
            <div class="text-center lg:text-left">
              <div class="text-2xl font-bold text-white">200+</div>
              <div class="text-xs text-teal-200/70 mt-1">Trusted Vendors</div>
            </div>
            <div class="text-center lg:text-left">
              <div class="text-2xl font-bold text-white">4.9★</div>
              <div class="text-xs text-teal-200/70 mt-1">Average Rating</div>
            </div>
          </div>
        </div>

        <!-- Hero product collage -->
        <div class="hidden lg:grid grid-cols-2 gap-5 relative">
          <div class="space-y-5 pt-10">
            <div class="card overflow-hidden rounded-3xl border-white/10 shadow-2xl shadow-teal-950/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" alt="Wireless headphones" class="aspect-[4/5] object-cover object-[75%_center] w-full" />
            </div>
            <div class="glass-card rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
              <div class="h-10 w-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Order delivered</p>
                <p class="text-xs text-teal-100/70">2,341 orders shipped today</p>
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <div class="glass-card rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
              <div class="h-10 w-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Rated 4.9/5</p>
                <p class="text-xs text-teal-100/70">from 12,000+ reviews</p>
              </div>
            </div>
            <div class="card overflow-hidden rounded-3xl border-white/10 shadow-2xl shadow-teal-950/50 rotate-[2deg] hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Running sneakers" class="aspect-[4/5] object-cover w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Value props ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
      <div class="card grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-lg shadow-slate-200/60">
        @for (prop of valueProps; track prop.title) {
          <div class="flex items-center gap-4 p-6">
            <div class="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="prop.icon" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">{{ prop.title }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ prop.text }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ══ Top categories ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          <p class="mt-1.5 text-sm text-slate-500">Browse our most popular departments</p>
        </div>
        <a routerLink="/shop" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        @for (category of categories(); track category.id) {
          <a
            [routerLink]="['/shop']"
            [queryParams]="{ category: category.slug }"
            class="group flex flex-col items-center text-center">
            <div class="relative w-full aspect-square max-w-[8.5rem] rounded-full overflow-hidden ring-4 ring-transparent
                        group-hover:ring-teal-200 shadow-md shadow-slate-200/80 transition-all duration-300">
              @if (category.image) {
                <img [src]="category.image" [alt]="category.name" loading="lazy"
                     class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              } @else {
                <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 group-hover:scale-110 transition-transform duration-500">
                  <span class="text-3xl font-bold">{{ category.name[0] }}</span>
                </div>
              }
              <div class="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors duration-300"></div>
            </div>
            <span class="mt-3 text-sm font-semibold text-slate-800 group-hover:text-teal-600 transition-colors duration-300">{{ category.name }}</span>
            <span class="text-xs text-slate-400">{{ category.productCount }} items</span>
          </a>
        }
      </div>
    </section>

    <!-- ══ Featured deals ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Featured Deals</h2>
          <p class="mt-1.5 text-sm text-slate-500">Hand-picked favorites at their best prices</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ deals: 1 }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          All deals
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        @for (product of featured(); track product.id) {
          <app-product-card [product]="product" layout="grid" />
        }
      </div>
    </section>

    <!-- ══ Promo banner ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 to-teal-800 px-8 py-12 sm:px-14 sm:py-16">
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-20 left-1/4 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl"></div>
        <div class="relative max-w-xl">
          <span class="badge bg-white/15 text-white ring-1 ring-white/25 px-3 py-1">Limited time</span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get 20% off your next order</h2>
          <p class="mt-3 text-teal-50/90 leading-relaxed">
            Apply code <span class="font-bold bg-white/15 rounded-md px-2 py-0.5 tracking-wider">SAVE20</span> at checkout on any order. New arrivals included.
          </p>
          <a routerLink="/shop" class="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-teal-700
                                       hover:bg-teal-50 shadow-lg shadow-teal-950/30 transition-all duration-300">
            Claim the Deal
          </a>
        </div>
      </div>
    </section>

    <!-- ══ New arrivals ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20 mb-4">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
          <p class="mt-1.5 text-sm text-slate-500">Fresh drops, just landed</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ sort: 'newest' }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        @for (product of newArrivals(); track product.id) {
          <app-product-card [product]="product" layout="grid" />
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly featured = toSignal(this.productService.getFeatured(), { initialValue: [] });
  readonly newArrivals = toSignal(this.productService.getNewArrivals(), { initialValue: [] });

  readonly valueProps = [
    {
      title: 'Free & Fast Shipping',
      text: 'Free on all orders over $75',
      icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    },
    {
      title: '30-Day Returns',
      text: 'No-questions-asked refunds',
      icon: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
    },
    {
      title: 'Secure Checkout',
      text: '256-bit SSL encrypted payments',
      icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    },
  ];
}
```

### File: src/frontend/src/app/features/info/info-page.component.ts
```typescript
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { INFO_PAGES, InfoPage } from '../../core/mocks/info-pages';


@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (content(); as page) {
      <div class="bg-gradient-to-b from-violet-50 to-white border-b border-slate-100">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb">
            <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
            <span aria-hidden="true">/</span>
            <span class="text-slate-500">{{ page.eyebrow }}</span>
          </nav>

          <p class="mt-6 text-xs font-bold uppercase tracking-widest text-violet-600">{{ page.eyebrow }}</p>
          <h1 class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{{ page.title }}</h1>
          @if (page.updated) {
            <p class="mt-2 text-xs text-slate-400">{{ page.updated }}</p>
          }
          <p class="mt-4 text-base sm:text-lg leading-relaxed text-slate-500">{{ page.intro }}</p>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div class="space-y-10">
          @for (section of page.sections; track section.heading) {
            <section>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">{{ section.heading }}</h2>
              <div class="mt-3 space-y-3">
                @for (paragraph of section.body; track paragraph) {
                  <p class="text-sm leading-relaxed text-slate-600">{{ paragraph }}</p>
                }
              </div>
            </section>
          }
        </div>

        <div class="card mt-12 p-6 sm:p-8 text-center">
          <h3 class="text-base font-bold text-slate-900">Still need a hand?</h3>
          <p class="mt-2 text-sm text-slate-500">Our support team replies within one business day.</p>
          <div class="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <a routerLink="/contact" class="btn-primary px-6">Contact support</a>
            <a routerLink="/shop" class="btn-secondary px-6">Continue shopping</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class InfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  
  private readonly key = toSignal(this.route.data.pipe(map(data => data['key'] as string)), {
    initialValue: this.route.snapshot.data['key'] as string,
  });

  protected readonly content = computed<InfoPage | null>(() => INFO_PAGES[this.key()] ?? null);
}
```

### File: src/frontend/src/app/features/not-found/not-found.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <p class="text-[7rem] sm:text-[9rem] font-black leading-none text-gradient select-none">404</p>
      <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Page not found</h1>
      <p class="mt-3 text-slate-500 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Let's get you back to the good stuff.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <a routerLink="/" class="btn-primary px-8">Back to Home</a>
        <a routerLink="/shop" class="btn-secondary px-8">Browse Products</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
```

### File: src/frontend/src/app/features/product-detail/product-detail.component.ts
```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, Review } from '../../core/models/shop.models';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';

type Tab = 'description' | 'specs' | 'reviews';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent, ProductCardComponent, EmptyStateComponent, FormsModule],
  template: `
    @if (product(); as p) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <!-- Breadcrumb -->
        <nav class="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
          <span>/</span>
          <a routerLink="/shop" class="hover:text-violet-600 transition-colors duration-300">Shop</a>
          <span>/</span>
          <a routerLink="/shop" [queryParams]="{ category: p.category }" class="hover:text-violet-600 transition-colors duration-300 capitalize">{{ categoryName() }}</a>
          <span>/</span>
          <span class="text-slate-600 font-medium truncate max-w-[16rem]">{{ p.name }}</span>
        </nav>

        <!-- ══ Main section ══ -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <!-- Gallery -->
          <div>
            <div class="card overflow-hidden aspect-square flex items-center justify-center p-6 bg-slate-50">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-contain mix-blend-multiply transition-opacity duration-300" />
            </div>
            <div class="mt-4 grid grid-cols-4 gap-3">
              @for (image of p.images; track image; let i = $index) {
                <button
                  type="button"
                  (click)="activeIndex.set(i)"
                  [attr.aria-label]="'View image ' + (i + 1)"
                  class="aspect-square rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-300 bg-slate-50 p-2 flex items-center justify-center"
                  [class]="activeIndex() === i ? 'ring-violet-600' : 'ring-transparent hover:ring-slate-300'">
                  <img [src]="image" [alt]="p.name + ' thumbnail ' + (i + 1)" class="h-full w-full object-contain mix-blend-multiply" />
                </button>
              }
            </div>
          </div>

          <!-- Buy panel -->
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              @if (p.isNew) {
                <span class="badge bg-violet-100 text-violet-700">New</span>
              }
              @if (discountPercent() > 0) {
                <span class="badge bg-rose-100 text-rose-600">Save {{ discountPercent() }}%</span>
              }
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{{ p.name }}</h1>

            <button type="button" (click)="activeTab.set('reviews'); scrollToTabs()" class="mt-3 flex items-center gap-2 w-fit group">
              <app-star-rating [rating]="averageRating()" size="md" />
              <span class="text-sm font-semibold text-slate-700">{{ averageRating() }}</span>
              <span class="text-sm text-slate-400 group-hover:text-violet-600 underline-offset-2 group-hover:underline transition-colors duration-300">
                {{ reviews().length }} reviews
              </span>
            </button>

            <div class="mt-5 flex items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-extrabold text-slate-900">{{ p.price | currency }}</span>
              @if (p.originalPrice) {
                <span class="text-lg text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
              }
            </div>

            <p class="mt-4 text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

            <!-- Stock indicator -->
            <div class="mt-4">
              @if (p.stock === 0) {
                <span class="badge bg-slate-100 text-slate-600">Out of stock</span>
              } @else if (p.stock <= 15) {
                <span class="badge bg-amber-100 text-amber-700 animate-pulse">Only {{ p.stock }} left in stock</span>
              } @else {
                <span class="badge bg-emerald-100 text-emerald-700">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  In stock, ready to ship
                </span>
              }
            </div>

            <!-- Color swatches -->
            @if (p.colors?.length) {
              <div class="mt-6">
                <span class="text-sm font-semibold text-slate-900">
                  Color: <span class="font-normal text-slate-500">{{ selectedColor() }}</span>
                </span>
                <div class="mt-3 flex gap-3">
                  @for (color of (p.colors || []); track color.name) {
                    <button
                      type="button"
                      (click)="selectedColor.set(color.name)"
                      [attr.aria-label]="'Select color ' + color.name"
                      [attr.aria-pressed]="selectedColor() === color.name"
                      class="h-10 w-10 rounded-full ring-2 ring-offset-2 transition-all duration-300 border border-slate-200"
                      [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                      [style.background-color]="color.hex"></button>
                  }
                </div>
              </div>
            }

            <!-- Size pills -->
            @if (p.sizes.length) {
              <div class="mt-6">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-900">Size: <span class="font-normal text-slate-500">{{ selectedSize() || 'Select a size' }}</span></span>
                  <button type="button" class="text-xs font-medium text-violet-600 hover:text-violet-500 underline underline-offset-2 transition-colors duration-300">Size guide</button>
                </div>
                <div class="mt-3 flex flex-wrap gap-2.5">
                  @for (size of p.sizes; track size) {
                    <button
                      type="button"
                      (click)="selectedSize.set(size)"
                      [attr.aria-pressed]="selectedSize() === size"
                      class="min-w-[3rem] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300"
                      [class]="selectedSize() === size
                        ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'">
                      {{ size }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Quantity + CTAs -->
            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
                <button type="button" (click)="decrement()" [disabled]="quantity() <= 1" aria-label="Decrease quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                </button>
                <span class="w-12 text-center text-base font-bold text-slate-900" aria-live="polite">{{ quantity() }}</span>
                <button type="button" (click)="increment()" [disabled]="quantity() >= p.stock" aria-label="Increase quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <button type="button" (click)="addToCart()" [disabled]="p.stock === 0" class="btn-primary flex-1 py-3.5 text-base gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {{ p.stock === 0 ? 'Out of stock' : 'Add to Cart — ' + (p.price * quantity() | currency) }}
              </button>

              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="h-[3.25rem] w-[3.25rem] rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0"
                [class]="inWishlist()
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200'">
                <svg class="w-6 h-6" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <!-- Trust rows -->
            <div class="mt-8 card divide-y divide-slate-100">
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free delivery</span> on orders over $75 · arrives in 2–4 business days</p>
              </div>
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free 30-day returns</span> — no questions asked</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ Tabs ══ -->
        <div class="mt-14" id="product-tabs">
          <div class="border-b border-slate-200 flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Product information">
            @for (tab of tabs; track tab.key) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === tab.key"
                (click)="activeTab.set(tab.key)"
                class="relative px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300"
                [class]="activeTab() === tab.key ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'">
                {{ tab.label }}
                @if (tab.key === 'reviews') {
                  <span class="ml-1.5 badge bg-slate-100 text-slate-500">{{ reviews().length }}</span>
                }
                @if (activeTab() === tab.key) {
                  <span class="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-violet-600"></span>
                }
              </button>
            }
          </div>

          <div class="py-8">
            @switch (activeTab()) {
              <!-- Description -->
              @case ('description') {
                <div class="grid lg:grid-cols-5 gap-10">
                  <div class="lg:col-span-3">
                    <h2 class="text-lg font-bold text-slate-900 mb-4">About this product</h2>
                    <p class="text-slate-600 leading-relaxed">{{ p.description }}</p>
                  </div>
                  <div class="lg:col-span-2">
                    <h3 class="text-lg font-bold text-slate-900 mb-4">Highlights</h3>
                    <ul class="space-y-3">
                      @for (feature of (p.features || []); track feature) {
                        <li class="flex items-start gap-3">
                          <span class="mt-0.5 h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                            <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                          <span class="text-sm text-slate-600 leading-relaxed">{{ feature }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <!-- Specifications -->
              @case ('specs') {
                <div class="card overflow-hidden max-w-3xl">
                  <table class="w-full text-sm">
                    <tbody>
                      @for (spec of (p.specs || []); track spec.label; let even = $even) {
                        <tr [class]="even ? 'bg-slate-50/70' : 'bg-white'">
                          <th scope="row" class="text-left font-semibold text-slate-700 px-6 py-3.5 w-1/3">{{ spec.label }}</th>
                          <td class="text-slate-600 px-6 py-3.5">{{ spec.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Reviews -->
              @case ('reviews') {
                <div class="grid lg:grid-cols-3 gap-10">
                  <!-- Ratings summary -->
                  <div class="lg:col-span-1">
                    <div class="card p-6 lg:sticky lg:top-24">
                      <div class="flex items-end gap-3">
                        <span class="text-5xl font-extrabold text-slate-900 leading-none">{{ averageRating() }}</span>
                        <div class="pb-1">
                          <app-star-rating [rating]="averageRating()" size="md" />
                          <p class="mt-1 text-xs text-slate-400">Based on {{ reviews().length }} reviews</p>
                        </div>
                      </div>

                      <!-- Star distribution -->
                      <div class="mt-6 space-y-2.5">
                        @for (bucket of ratingBuckets(); track bucket.stars) {
                          <div class="flex items-center gap-3">
                            <span class="text-xs font-medium text-slate-600 w-10 shrink-0">{{ bucket.stars }} star</span>
                            <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" [style.width.%]="bucket.percent"></div>
                            </div>
                            <span class="text-xs text-slate-400 w-9 text-right shrink-0">{{ bucket.percent }}%</span>
                          </div>
                        }
                      </div>

                      @if (authService.isAuthenticated()) {
                        <div class="mt-8 border-t border-slate-100 pt-6">
                          <h3 class="font-bold text-sm mb-3">Write a Review</h3>
                          <div class="flex items-center gap-1 mb-4">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button type="button" (click)="newReviewRating.set(star)" class="text-2xl transition-colors" [class]="star <= newReviewRating() ? 'text-amber-400' : 'text-slate-200'">★</button>
                            }
                          </div>
                          <textarea [(ngModel)]="newReviewComment" rows="3" class="w-full rounded-xl border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500 mb-3" placeholder="Share your thoughts..."></textarea>
                          <button type="button" (click)="submitReview()" [disabled]="isSubmittingReview()" class="btn-primary w-full disabled:opacity-50">Submit Review</button>
                        </div>
                      } @else {
                        <button type="button" routerLink="/login" class="btn-primary w-full mt-6">Log in to Review</button>
                      }
                    </div>
                  </div>

                  <!-- Review cards -->
                  <div class="lg:col-span-2 space-y-5">
                    @if (reviews().length === 0) {
                      <app-empty-state
                        icon="reviews"
                        title="No reviews yet"
                        message="Be the first to share your experience with this product — your review helps other shoppers decide." />
                    }
                    @for (review of reviews(); track review.id) {
                      <article class="card p-6">
                        @if (isEditingReview() === review.id) {
                          <div class="flex items-center gap-1 mb-4">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button type="button" (click)="editReviewRating.set(star)" class="text-2xl transition-colors" [class]="star <= editReviewRating() ? 'text-amber-400' : 'text-slate-200'">★</button>
                            }
                          </div>
                          <textarea [(ngModel)]="editReviewComment" rows="3" class="w-full rounded-xl border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500 mb-3"></textarea>
                          <div class="flex gap-2">
                            <button type="button" (click)="saveEdit()" class="btn-primary flex-1 py-2 text-sm">Save</button>
                            <button type="button" (click)="cancelEdit()" class="px-4 py-2 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                          </div>
                        } @else {
                          <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-3">
                              <span class="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                {{ review.initials }}
                              </span>
                              <div>
                                <p class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                  {{ review.author }}
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">{{ review.date }}</p>
                              </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                              <app-star-rating [rating]="review.rating" size="sm" />
                              <div class="flex items-center gap-2">
                                @if (review.isAuthor) {
                                  <button type="button" (click)="startEdit(review)" class="text-xs text-violet-600 font-medium hover:underline">Edit</button>
                                }
                                @if (review.isAuthor || isAdmin()) {
                                  <button type="button" (click)="deleteReview(review.id)" class="text-xs text-rose-500 font-medium hover:underline">Delete</button>
                                }
                              </div>
                            </div>
                          </div>
                          @if (review.title) {
                            <h3 class="mt-4 text-sm font-bold text-slate-900">{{ review.title }}</h3>
                          }
                          <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ review.comment }}</p>
                        }
                      </article>
                    }
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <!-- ══ Related products ══ -->
        <section class="mt-10">
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-6">You might also like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (related of relatedProducts(); track related.id) {
              <app-product-card [product]="related" layout="grid" />
            }
          </div>
        </section>
      </div>
    } @else {
      <!-- Product not found -->
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="search"
            title="Product not found"
            message="The product you're looking for may have been removed or the link is incorrect."
            ctaLabel="Back to Shop"
            ctaLink="/shop" />
        </div>
      </div>
    }

    <!-- Confirmation Modal -->
    @if (confirmDeleteReviewId()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Review</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this review?
              <br>This action cannot be undone.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeDeleteReview()" 
                      class="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly product = signal<Product | undefined>(undefined);
  readonly confirmDeleteReviewId = signal<string | number | null>(null);
  readonly activeIndex = signal(0);
  readonly selectedColor = signal('');
  readonly selectedSize = signal('');
  readonly quantity = signal(1);
  readonly activeTab = signal<Tab>('description');
  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly relatedProducts = signal<Product[]>([]);

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: 'Customer Reviews' },
  ];

  readonly activeImage = computed(() => {
    const p = this.product();
    return p && p.images && p.images.length ? p.images[Math.min(this.activeIndex(), p.images.length - 1)] : '';
  });

  readonly inWishlist = computed(() => {
    const p = this.product();
    return !!p && this.wishlist.ids().includes(p.id);
  });

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p?.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  readonly categoryName = computed(() => {
    const p = this.product();
    const cats = this.categories();
    return p
      ? cats.find(c => c.slug === p.category)?.name ?? p.category
      : '';
  });

  private readonly reviewService = inject(ReviewService);
  readonly authService = inject(AuthService);

  readonly reviews = signal<Review[]>([]);
  readonly isSubmittingReview = signal(false);
  readonly newReviewRating = signal(5);
  readonly newReviewComment = signal('');
  
  readonly isEditingReview = signal<string | number | null>(null);
  readonly editReviewRating = signal(5);
  readonly editReviewComment = signal('');

  readonly ratingBuckets = computed(() => {
    const revs = this.reviews();
    const total = revs.length;
    return [5, 4, 3, 2, 1].map(stars => {
      const count = revs.filter(r => r.rating === stars).length;
      return {
        stars,
        count,
        percent: total ? Math.round((count / total) * 100) : 0
      };
    });
  });
  
  readonly averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / revs.length).toFixed(1));
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const slug = params.get('slug') ?? '';
      if (slug) {
        this.productService.getBySlug(slug).subscribe(product => {
          this.product.set(product);
          this.activeIndex.set(0);
          this.quantity.set(1);
          this.activeTab.set('description');
          this.selectedColor.set(product?.colors?.[0]?.name ?? '');
          this.selectedSize.set(product?.sizes?.[0] ?? '');
          window.scrollTo({ top: 0 });

          if (product) {
            this.productService.getRelated(product).subscribe(related => {
              this.relatedProducts.set(related);
            });
            this.reviewService.getReviews(product.id.toString()).subscribe(revs => {
              this.reviews.set(revs);
            });
          } else {
             this.relatedProducts.set([]);
          }
        });
      }
    });
  }

  increment(): void {
    const stock = this.product()?.stock ?? 1;
    this.quantity.update(q => Math.min(q + 1, stock));
  }

  decrement(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p || p.stock === 0) return;
    this.cart.add(p, this.quantity(), this.selectedColor() || undefined, this.selectedSize() || undefined);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p.id, p.name);
  }

  scrollToTabs(): void {
    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
  }

  submitReview(): void {
    const p = this.product();
    if (!p) return;
    this.isSubmittingReview.set(true);
    this.reviewService.addReview({
      productId: p.id.toString(),
      rating: this.newReviewRating(),
      comment: this.newReviewComment()
    }).subscribe({
      next: () => {
        this.newReviewComment.set('');
        this.newReviewRating.set(5);
        this.isSubmittingReview.set(false);
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.isSubmittingReview.set(false)
    });
  }

  startEdit(review: Review): void {
    this.isEditingReview.set(review.id);
    this.editReviewRating.set(review.rating);
    this.editReviewComment.set(review.comment || '');
  }

  cancelEdit(): void {
    this.isEditingReview.set(null);
  }

  saveEdit(): void {
    const p = this.product();
    const id = this.isEditingReview();
    if (!p || !id) return;
    
    this.reviewService.updateReview(id.toString(), {
      reviewId: id.toString(),
      rating: this.editReviewRating(),
      comment: this.editReviewComment()
    }).subscribe({
      next: () => {
        this.isEditingReview.set(null);
        this.toastService.success('Review updated successfully.');
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.toastService.error('Failed to update review.')
    });
  }

  deleteReview(id: string | number): void {
    this.confirmDeleteReviewId.set(id);
  }

  closeConfirmModal(): void {
    this.confirmDeleteReviewId.set(null);
  }

  executeDeleteReview(): void {
    const id = this.confirmDeleteReviewId();
    if (!id) return;
    
    this.closeConfirmModal();

    const p = this.product();
    if (!p) return;
    
    this.reviewService.deleteReview(id.toString()).subscribe({
      next: () => {
        this.toastService.success('Review deleted successfully.');
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.toastService.error('Failed to delete review.')
    });
  }
  
  isAdmin(): boolean {
    return this.authService.user()?.roles?.includes('Admin') || this.authService.user()?.roles?.includes('SuperAdmin') || false;
  }
}
```

### File: src/frontend/src/app/layout/cart-drawer/cart-drawer.component.ts
```typescript
import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/shop.models';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe],
  template: `
    @if (cart.drawerOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        (click)="cart.closeDrawer()"
        aria-hidden="true"></div>

      <!-- Drawer panel -->
      <aside
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            Your Cart
            @if (cart.count() > 0) {
              <span class="badge bg-violet-100 text-violet-700">{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }}</span>
            }
          </h2>
          <button type="button" (click)="cart.closeDrawer()" aria-label="Close cart" class="icon-btn h-9 w-9 bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (cart.items().length === 0) {
          <!-- Empty state -->
          <div class="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-violet-200/60 rounded-full blur-2xl scale-110"></div>
              <div class="relative w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-50 rounded-full flex items-center justify-center ring-1 ring-violet-100">
                <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Your cart is empty</h3>
            <p class="mt-2 text-sm text-slate-500 leading-relaxed">Looks like you haven't added anything yet. Discover deals waiting for you.</p>
            <button type="button" (click)="goTo('/shop')" class="btn-primary mt-6">Start Shopping</button>
          </div>
        } @else {
          <!-- Free shipping progress -->
          @if (cart.amountToFreeShipping() > 0) {
            <div class="px-5 pt-4">
              <p class="text-xs text-slate-500 mb-2">
                You're <span class="font-semibold text-violet-700">{{ cart.amountToFreeShipping() | currency }}</span> away from <span class="font-semibold">free shipping</span>
              </p>
              <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" [style.width.%]="shippingProgress()"></div>
              </div>
            </div>
          } @else {
            <div class="px-5 pt-4">
              <p class="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Congratulations — your order ships free!
              </p>
            </div>
          }

          <!-- Items -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            @for (item of cart.items(); track trackItem(item)) {
              <div class="flex gap-4 group">
                <img [src]="item.image" [alt]="item.name" class="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                      <p class="mt-0.5 text-xs text-slate-400">
                        {{ item.color }}{{ item.color && item.size ? ' · ' : '' }}{{ item.size }}
                      </p>
                    </div>
                    <button
                      type="button"
                      (click)="cart.remove(item)"
                      [attr.aria-label]="'Remove ' + item.name"
                      class="icon-btn h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <div class="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
                      <button type="button" (click)="cart.updateQuantity(item, item.quantity - 1)" [attr.aria-label]="'Decrease quantity of ' + item.name" class="qty-btn h-7 w-7">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                      </button>
                      <span class="w-8 text-center text-sm font-semibold text-slate-900">{{ item.quantity }}</span>
                      <button type="button" (click)="cart.updateQuantity(item, item.quantity + 1)" [disabled]="item.quantity >= item.stock" [attr.aria-label]="'Increase quantity of ' + item.name" class="qty-btn h-7 w-7">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>
                    <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/60">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Subtotal</span>
              <span class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</span>
            </div>
            @if (cart.discount() > 0) {
              <div class="flex justify-between text-sm">
                <span class="text-emerald-600">Discount ({{ cart.promo()?.code }})</span>
                <span class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</span>
              </div>
            }
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Shipping</span>
              <span class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
              </span>
            </div>
            <div class="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{{ cart.total() | currency }}</span>
            </div>
            <p class="text-[11px] text-slate-400">Tax included: {{ cart.tax() | currency }}. Shipping calculated at checkout.</p>
            <div class="grid grid-cols-2 gap-3 pt-1">
              <button type="button" (click)="goTo('/cart')" class="btn-secondary py-3">View Cart</button>
              <button type="button" (click)="goTo('/checkout')" class="btn-primary py-3">Checkout</button>
            </div>
          </div>
        }
      </aside>
    }
  `,
  styles: `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  `,
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  trackItem(item: CartItem): string {
    return `${item.productId}-${item.color ?? ''}-${item.size ?? ''}`;
  }

  shippingProgress(): number {
    const subtotal = this.cart.subtotal() - this.cart.discount();
    return Math.min(100, (subtotal / 75) * 100);
  }

  goTo(path: string): void {
    this.cart.closeDrawer();
    this.router.navigate([path]);
  }
}
```

### File: src/frontend/src/app/layout/footer/footer.component.ts
```typescript
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
```

### File: src/frontend/src/app/layout/header/header.component.ts
```typescript
import { Component, HostListener, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { PwaService } from '../../core/services/pwa.service';
import { ToastService } from '../../core/services/toast.service';
import { InstallButtonComponent } from '../../shared/components/install-button/install-button.component';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule, InstallButtonComponent],
  template: `
    <!-- Announcement bar -->
    @if (announcement()) {
      <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 text-white text-center text-xs sm:text-sm font-medium py-2 px-4 transition-all duration-300">
        @if (announcement()?.linkUrl) {
          <a [href]="announcement()?.linkUrl" class="hover:underline">{{ announcement()?.message }}</a>
        } @else {
          {{ announcement()?.message }}
        }
      </div>
    }

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
            <form (submit)="$event.preventDefault()" class="hidden md:block relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                name="search"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
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
                  <div class="absolute right-0 mt-2 w-64 card p-2 bg-white shadow-xl shadow-slate-200/80 animate-[menuIn_0.15s_ease-out] z-50" (click)="$event.stopPropagation()">
                    <div class="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p class="text-sm font-semibold text-slate-900 truncate">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p>
                      <p class="text-xs text-slate-400 break-all">{{ auth.user()?.email }}</p>
                    </div>
                    @if (auth.user()?.roles?.includes('Admin') || auth.user()?.roles?.includes('SuperAdmin') || auth.user()?.roles?.includes('Seller')) {
                      <a
                        routerLink="/admin"
                        (click)="userMenuOpen.set(false)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors duration-200 mb-1 font-medium">
                        {{ auth.user()?.roles?.includes('Seller') && !auth.user()?.roles?.includes('Admin') && !auth.user()?.roles?.includes('SuperAdmin') ? 'Seller Dashboard' : 'Admin Dashboard' }}
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
        <form (submit)="$event.preventDefault()" class="md:hidden pb-3 relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-[calc(50%+0.375rem)] w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            name="search-mobile"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
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
export class HeaderComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly pwa = inject(PwaService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly toast = inject(ToastService);
  private readonly wishlist = inject(WishlistService);
  private readonly router = inject(Router);

  readonly announcement = signal<Announcement | null>(null);
  readonly mobileMenuOpen = signal(false);
  readonly userMenuOpen = signal(false);
  searchTerm = '';
  private searchSubject = new Subject<string>();

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
    { label: 'Account Settings', path: '/account/settings' },
  ];

  readonly initials = computed(() => {
    const u = this.auth.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || u.email[0].toUpperCase();
  });

  ngOnInit() {
    this.announcementService.getActive().subscribe(data => {
      this.announcement.set(data);
    });
    
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.router.navigate(['/shop'], { queryParams: { search: term || null } });
    });
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen.update(v => !v);
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
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
```

### File: src/frontend/src/app/layout/shell/shell.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component';
import { QuickViewComponent } from '../../shared/components/quick-view/quick-view.component';
import { OfflineBannerComponent } from '../../shared/components/offline-banner/offline-banner.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CartDrawerComponent, QuickViewComponent, OfflineBannerComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <app-offline-banner />
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-cart-drawer />
      <app-quick-view />
    </div>
  `,
})
export class ShellComponent {}
```

### File: src/frontend/src/app/shared/components/auth-slider/auth-slider.component.ts
```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-[340px] relative mx-auto mt-8 mb-12 h-[170px]">
      
      <!-- The Slider Track -->
      <div class="w-full h-full relative">
        <div *ngFor="let card of cards; let i = index" 
             class="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center" 
             [ngStyle]="getCardStyle(i)">
          
          <div class="relative backdrop-blur-2xl p-5 rounded-2xl shadow-2xl w-full h-full border flex flex-col justify-between"
               [ngClass]="card.bgClass">
            
            <div class="flex gap-4 items-start mb-2">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                   [ngClass]="card.iconBgClass">
                <i class="w-6 h-6 flex items-center justify-center" [ngClass]="card.iconColorClass" [innerHTML]="card.icon"></i>
              </div>
              <div>
                <div class="text-white font-bold text-lg leading-tight">{{ card.title }}</div>
                <div class="text-sm mt-1" [ngClass]="card.subtitleColorClass">{{ card.subtitle }}</div>
              </div>
            </div>
            
            <div class="flex justify-between items-end mt-auto">
              <div class="text-sm font-medium text-white/90 leading-snug" [innerHTML]="card.description"></div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Floating Buttons -->
      <button type="button" (click)="prevCard()" class="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95" style="z-index: 40;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <button type="button" (click)="nextCard()" class="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95" style="z-index: 40;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      <!-- Slider Dots -->
      <div class="absolute -bottom-8 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-4">
        <button type="button" *ngFor="let dot of cards; let i = index" 
                (click)="currentCardIndex.set(i)"
                class="h-2 rounded-full transition-all duration-300 ease-out"
                [class.bg-teal-400]="currentCardIndex() === i"
                [class.w-4]="currentCardIndex() === i"
                [class.w-2]="currentCardIndex() !== i"
                [class.bg-white]="currentCardIndex() !== i"
                [class.opacity-40]="currentCardIndex() !== i"
                [class.hover:opacity-70]="currentCardIndex() !== i">
        </button>
      </div>
    </div>
  `
})
export class AuthSliderComponent {
  currentCardIndex = signal(0);

  cards = [
    {
      title: 'Premium Quality',
      subtitle: 'Verified Products',
      description: 'We ensure all products meet the highest quality standards before reaching you.',
      bgClass: 'bg-white/10 border-white/20',
      iconBgClass: 'bg-teal-500/20 border-teal-500/30',
      iconColorClass: 'text-teal-300',
      subtitleColorClass: 'text-teal-200/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
    },
    {
      title: 'Lightning Fast',
      subtitle: 'Express Delivery',
      description: 'Get your orders delivered to your doorstep in record time.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-amber-500/20 border-amber-500/30',
      iconColorClass: 'text-amber-300',
      subtitleColorClass: 'text-amber-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
    },
    {
      title: 'Endless Variety',
      subtitle: 'From Electronics to Home',
      description: 'Explore thousands of items across multiple categories all in one place.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-blue-500/20 border-blue-500/30',
      iconColorClass: 'text-blue-300',
      subtitleColorClass: 'text-blue-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>'
    },
    {
      title: 'Built by',
      subtitle: 'Mohammad Alghazo',
      description: 'Budgetha is passionately crafted to deliver a seamless shopping experience.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-rose-500/20 border-rose-500/30',
      iconColorClass: 'text-rose-300',
      subtitleColorClass: 'text-rose-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>'
    },
    {
      title: 'Secure Payments',
      subtitle: '100% Protected',
      description: 'Your transactions are guarded with industry-leading encryption.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-emerald-500/20 border-emerald-500/30',
      iconColorClass: 'text-emerald-300',
      subtitleColorClass: 'text-emerald-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>'
    },
    {
      title: 'Connect with Me',
      subtitle: 'LinkedIn',
      description: 'Visit my LinkedIn profile to connect and see my professional background.',
      bgClass: 'bg-[#0a66c2]/20 border-[#0a66c2]/30',
      iconBgClass: 'bg-white/10 border-white/20',
      iconColorClass: 'text-white',
      subtitleColorClass: 'text-white/70',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
    },
    {
      title: 'Open Source',
      subtitle: 'GitHub',
      description: 'Check out the source code and other projects on my GitHub.',
      bgClass: 'bg-slate-800 border-slate-600',
      iconBgClass: 'bg-white/10 border-white/20',
      iconColorClass: 'text-white',
      subtitleColorClass: 'text-slate-400',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
    },
    {
      title: 'My Portfolio',
      subtitle: 'See My Work',
      description: 'Discover more about my skills, projects, and contact information.',
      bgClass: 'bg-indigo-900/80 border-indigo-500/30',
      iconBgClass: 'bg-indigo-500/20 border-indigo-500/30',
      iconColorClass: 'text-indigo-300',
      subtitleColorClass: 'text-indigo-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>'
    },
    {
      title: 'Reliable Sellers',
      subtitle: 'Trusted Partners',
      description: 'We carefully vet all sellers to ensure a trustworthy shopping environment.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-purple-500/20 border-purple-500/30',
      iconColorClass: 'text-purple-300',
      subtitleColorClass: 'text-purple-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
    },
    {
      title: '24/7 Support',
      subtitle: 'Always Here',
      description: 'Got questions? Contact the creator or our support team anytime.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-cyan-500/20 border-cyan-500/30',
      iconColorClass: 'text-cyan-300',
      subtitleColorClass: 'text-cyan-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
    }
  ];

  get totalCards() { return this.cards.length; }

  prevCard(): void {
    this.currentCardIndex.update(i => (i - 1 + this.totalCards) % this.totalCards);
  }

  nextCard(): void {
    this.currentCardIndex.update(i => (i + 1) % this.totalCards);
  }

  getCardStyle(index: number) {
    const diff = (index - this.currentCardIndex() + this.totalCards) % this.totalCards;
    
    if (diff === 0) {
      return { transform: 'translateX(0) scale(1)', zIndex: 30, opacity: 1, visibility: 'visible' };
    } else if (diff === 1) {
      return { transform: 'translateX(60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else if (diff === this.totalCards - 1) {
      return { transform: 'translateX(-60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else {
      return { transform: 'translateX(0) scale(0.7)', zIndex: 10, opacity: 0, visibility: 'hidden' };
    }
  }
}
```

### File: src/frontend/src/app/shared/components/empty-state/empty-state.component.ts
```typescript
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type EmptyStateIcon = 'cart' | 'search' | 'orders' | 'wishlist' | 'reviews' | 'address' | 'card';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-6">
      <div class="relative mb-6">
        <div class="absolute inset-0 bg-violet-200/60 rounded-full blur-2xl scale-110"></div>
        <div class="relative w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-50 rounded-full flex items-center justify-center ring-1 ring-violet-100">
          @switch (icon()) {
            @case ('cart') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            }
            @case ('search') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            @case ('orders') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            @case ('wishlist') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            }
            @case ('reviews') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
            @case ('address') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            }
            @case ('card') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
          }
        </div>
      </div>
      <h3 class="text-lg font-bold text-slate-900">{{ title() }}</h3>
      <p class="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">{{ message() }}</p>
      @if (ctaLabel() && ctaLink()) {
        <a [routerLink]="ctaLink()" class="btn-primary mt-6">{{ ctaLabel() }}</a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input<EmptyStateIcon>('search');
  readonly title = input('Nothing here yet');
  readonly message = input('');
  readonly ctaLabel = input('');
  readonly ctaLink = input('');
}
```

### File: src/frontend/src/app/shared/components/install-button/install-button.component.ts
```typescript
import { Component, inject, input } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';


@Component({
  selector: 'app-install-button',
  standalone: true,
  template: `
    @if (pwa.showInstallAffordance()) {
      @switch (variant()) {
        @case ('header') {
          <button
            type="button"
            (click)="pwa.install()"
            title="Install Budgetha as an app"
            class="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2
                   text-xs font-semibold text-violet-700 hover:bg-violet-100 hover:border-violet-300
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
                   transition-all duration-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13.5m0 0l4.5-4.5M12 16.5L7.5 12M3.75 18.75h16.5" />
            </svg>
            Install app
          </button>
        }

        @case ('footer') {
          <div class="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
            <div class="flex items-start gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </span>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-white">Get the Budgetha app</h4>
                <p class="mt-1 text-xs leading-relaxed text-slate-400">
                  Install it for faster loading, offline browsing, and one-tap access from your home screen.
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <button type="button" (click)="pwa.install()" class="btn-primary flex-1 py-2.5 text-xs">Install app</button>
              <button
                type="button"
                (click)="pwa.dismissInstall()"
                class="rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors duration-300">
                Not now
              </button>
            </div>
          </div>
        }
      }
    }
  `,
})
export class InstallButtonComponent {
  readonly pwa = inject(PwaService);
  readonly variant = input<'header' | 'footer'>('header');
}
```

### File: src/frontend/src/app/shared/components/offline-banner/offline-banner.component.ts
```typescript
import { Component, inject } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';


@Component({
  selector: 'app-offline-banner',
  standalone: true,
  template: `
    @if (!pwa.online()) {
      <div
        role="status"
        class="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-center text-xs font-medium text-amber-200">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75h.008v.008H12v-.008zM3 3l18 18M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c.512-.512 1.08-.95 1.688-1.312m10.1 1.312a7.5 7.5 0 00-2.39-1.6M1.924 8.674a13.5 13.5 0 013.16-2.226m14.992 2.226a13.46 13.46 0 00-7.65-3.44" />
        </svg>
        You’re offline — browsing cached pages. Checkout will resume once you reconnect.
      </div>
    }
  `,
})
export class OfflineBannerComponent {
  readonly pwa = inject(PwaService);
}
```

### File: src/frontend/src/app/shared/components/product-card/product-card.component.ts
```typescript
import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/shop.models';
import { CartService } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent],
  template: `
    @if (layout() === 'grid') {
      <!-- ── Grid card ── -->
      <article class="group card overflow-hidden hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div class="relative aspect-square overflow-hidden bg-slate-100">
          <a [routerLink]="['/products', product().slug]" class="block h-full p-4">
            <img
              [src]="product().images[0]"
              [alt]="product().name"
              loading="lazy"
              class="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
          </a>

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (discountPercent() > 0) {
              <span class="badge bg-rose-500 text-white shadow-sm">-{{ discountPercent() }}%</span>
            }
            @if (product().isNew) {
              <span class="badge bg-violet-600 text-white shadow-sm">New</span>
            }
            @if (product().stock === 0) {
              <span class="badge bg-slate-700 text-white shadow-sm">Sold out</span>
            }
            @if (product().approvalStatus && product().approvalStatus !== 'Approved') {
              <span class="badge" [class]="product().approvalStatus === 'Pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-rose-700 text-white shadow-sm'">
                {{ product().approvalStatus }}
              </span>
            }
          </div>

          <!-- Hover actions -->
          <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:translate-x-2 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-300">
            <button
              type="button"
              (click)="toggleWishlist()"
              [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
              class="icon-btn h-9 w-9 bg-white/95 shadow-md backdrop-blur"
              [class.text-rose-500]="inWishlist()">
              <svg class="w-4.5 h-4.5 w-[18px] h-[18px]" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="quickView()"
              aria-label="Quick view"
              class="icon-btn h-9 w-9 bg-white/95 shadow-md backdrop-blur">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Add to cart slide-up -->
          <div class="absolute inset-x-3 bottom-3 opacity-100 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300">
            <button
              type="button"
              (click)="addToCart()"
              [disabled]="product().stock === 0"
              class="w-full rounded-xl bg-slate-900/90 backdrop-blur text-white text-sm font-semibold py-2.5
                     hover:bg-violet-600 disabled:opacity-50 disabled:hover:bg-slate-900/90
                     transition-colors duration-300 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {{ product().stock === 0 ? 'Out of stock' : 'Add to cart' }}
            </button>
          </div>
        </div>

        <div class="p-4 flex flex-col flex-1">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ product().brand }}</span>
          <a [routerLink]="['/products', product().slug]" class="mt-1 font-semibold text-slate-900 leading-snug line-clamp-2 hover:text-violet-600 transition-colors duration-300">
            {{ product().name }}
          </a>
          <div class="mt-2 flex items-center gap-1.5">
            <app-star-rating [rating]="product().rating" size="sm" />
            <span class="text-xs text-slate-400">({{ product().reviewCount }})</span>
          </div>
          <div class="mt-auto pt-3 flex items-baseline gap-2">
            <span class="text-lg font-bold text-slate-900">{{ product().price | currency }}</span>
            @if (product().originalPrice) {
              <span class="text-sm text-slate-400 line-through">{{ product().originalPrice | currency }}</span>
            }
          </div>
        </div>
      </article>
    } @else {
      <!-- ── List card ── -->
      <article class="group card overflow-hidden hover:shadow-xl hover:shadow-violet-100/60 transition-all duration-300 flex flex-col sm:flex-row">
        <div class="relative sm:w-56 lg:w-64 shrink-0 aspect-square sm:aspect-auto overflow-hidden bg-slate-100">
          <a [routerLink]="['/products', product().slug]" class="block h-full p-4">
            <img
              [src]="product().images[0]"
              [alt]="product().name"
              loading="lazy"
              class="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
          </a>
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (discountPercent() > 0) {
              <span class="badge bg-rose-500 text-white shadow-sm">-{{ discountPercent() }}%</span>
            }
            @if (product().isNew) {
              <span class="badge bg-violet-600 text-white shadow-sm">New</span>
            }
            @if (product().approvalStatus && product().approvalStatus !== 'Approved') {
              <span class="badge" [class]="product().approvalStatus === 'Pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-rose-700 text-white shadow-sm'">
                {{ product().approvalStatus }}
              </span>
            }
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ product().brand }}</span>
          <a [routerLink]="['/products', product().slug]" class="mt-1 text-lg font-semibold text-slate-900 leading-snug hover:text-violet-600 transition-colors duration-300">
            {{ product().name }}
          </a>
          <div class="mt-2 flex items-center gap-1.5">
            <app-star-rating [rating]="product().rating" size="sm" />
            <span class="text-xs text-slate-400">{{ product().rating }} ({{ product().reviewCount }} reviews)</span>
          </div>
          <p class="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">{{ product().shortDescription }}</p>

          <div class="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-slate-900">{{ product().price | currency }}</span>
              @if (product().originalPrice) {
                <span class="text-sm text-slate-400 line-through">{{ product().originalPrice | currency }}</span>
              }
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="icon-btn h-10 w-10 border border-slate-200"
                [class.text-rose-500]="inWishlist()">
                <svg class="w-[18px] h-[18px]" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button
                type="button"
                (click)="addToCart()"
                [disabled]="product().stock === 0"
                class="btn-primary px-5 py-2.5">
                {{ product().stock === 0 ? 'Out of stock' : 'Add to cart' }}
              </button>
            </div>
          </div>
        </div>
      </article>
    }
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly layout = input<'grid' | 'list'>('grid');

  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly quickViewService = inject(QuickViewService);

  readonly inWishlist = computed(() => this.wishlist.ids().includes(this.product().id));
  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  addToCart(): void {
    const p = this.product();
    this.cart.add(p, 1, p.colors[0]?.name, p.sizes[0]);
  }

  toggleWishlist(): void {
    this.wishlist.toggle(this.product().id, this.product().name);
  }

  quickView(): void {
    this.quickViewService.open(this.product());
  }
}
```

### File: src/frontend/src/app/shared/components/quick-view/quick-view.component.ts
```typescript
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-quick-view',
  imports: [CurrencyPipe, StarRatingComponent],
  template: `
    @if (product(); as p) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        (click)="close()"
        aria-hidden="true"></div>

      <!-- Dialog -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none" role="dialog" aria-modal="true" [attr.aria-label]="'Quick view: ' + p.name">
        <div class="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.25s_ease-out]">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Image -->
            <div class="relative aspect-square bg-slate-100 md:rounded-l-2xl overflow-hidden flex items-center justify-center p-4">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-contain mix-blend-multiply" />
              @if (p.images.length > 1) {
                <div class="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  @for (image of p.images; track image; let i = $index) {
                    <button
                      type="button"
                      (click)="activeIndex.set(i)"
                      [attr.aria-label]="'Image ' + (i + 1)"
                      class="h-2 rounded-full transition-all duration-300"
                      [class]="activeIndex() === i ? 'w-6 bg-violet-600' : 'w-2 bg-white/80 hover:bg-white'"></button>
                  }
                </div>
              }
            </div>

            <!-- Details -->
            <div class="p-6 flex flex-col relative">
              <button
                type="button"
                (click)="close()"
                aria-label="Close quick view"
                class="absolute top-4 right-4 icon-btn h-9 w-9 bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              <h2 class="mt-1 text-xl font-bold text-slate-900 pr-10">{{ p.name }}</h2>
              <div class="mt-2 flex items-center gap-2">
                <app-star-rating [rating]="p.rating" size="sm" />
                <span class="text-xs text-slate-400">{{ p.rating }} · {{ p.reviewCount }} reviews</span>
              </div>

              <div class="mt-4 flex items-baseline gap-2">
                <span class="text-2xl font-bold text-slate-900">{{ p.price | currency }}</span>
                @if (p.originalPrice) {
                  <span class="text-base text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
                }
              </div>

              <p class="mt-4 text-sm text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

              @if (p.colors.length) {
                <div class="mt-5">
                  <span class="text-sm font-medium text-slate-700">Color: <span class="text-slate-500 font-normal">{{ selectedColor() }}</span></span>
                  <div class="mt-2 flex gap-2">
                    @for (color of p.colors; track color.name) {
                      <button
                        type="button"
                        (click)="selectedColor.set(color.name)"
                        [attr.aria-label]="color.name"
                        class="h-8 w-8 rounded-full ring-2 ring-offset-2 transition-all duration-300"
                        [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                        [style.background-color]="color.hex"></button>
                    }
                  </div>
                </div>
              }

              @if (p.sizes.length) {
                <div class="mt-5">
                  <span class="text-sm font-medium text-slate-700">Size</span>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (size of p.sizes; track size) {
                      <button
                        type="button"
                        (click)="selectedSize.set(size)"
                        class="min-w-[2.75rem] px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300"
                        [class]="selectedSize() === size
                          ? 'border-violet-600 bg-violet-50 text-violet-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'">
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>
              }

              <div class="mt-auto pt-6 flex gap-3">
                <button type="button" (click)="addToCart()" [disabled]="p.stock === 0" class="btn-primary flex-1">
                  {{ p.stock === 0 ? 'Out of stock' : 'Add to cart' }}
                </button>
                <button type="button" (click)="viewFullDetails()" class="btn-secondary">
                  Full details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  `,
})
export class QuickViewComponent {
  private readonly quickViewService = inject(QuickViewService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly product = this.quickViewService.product;
  readonly activeIndex = signal(0);
  readonly selectedColor = signal<string>('');
  readonly selectedSize = signal<string>('');

  readonly activeImage = computed(() => {
    const p = this.product();
    if (!p) return '';
    return p.images[Math.min(this.activeIndex(), p.images.length - 1)];
  });

  constructor() {
    
    effect(() => {
      const p = this.product();
      this.activeIndex.set(0);
      this.selectedColor.set(p?.colors[0]?.name ?? '');
      this.selectedSize.set(p?.sizes[0] ?? '');
    });
  }

  close(): void {
    this.quickViewService.close();
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(
      p,
      1,
      this.selectedColor() || p.colors[0]?.name,
      this.selectedSize() || p.sizes[0]
    );
    this.close();
  }

  viewFullDetails(): void {
    const p = this.product();
    if (!p) return;
    this.close();
    this.router.navigate(['/products', p.slug]);
  }
}
```

### File: src/frontend/src/app/shared/components/star-rating/star-rating.component.ts
```typescript
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="relative inline-flex" [attr.aria-label]="rating() + ' out of 5 stars'" role="img">
      <!-- Empty layer -->
      <div class="flex gap-0.5 text-slate-200">
        @for (star of stars; track star) {
          <svg [class]="sizeClass()" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        }
      </div>
      <!-- Filled layer clipped to rating percentage -->
      <div class="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400" [style.width.%]="fillPercent()">
        @for (star of stars; track star) {
          <svg [class]="sizeClass() + ' shrink-0'" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        }
      </div>
    </div>
  `,
})
export class StarRatingComponent {
  readonly rating = input(0);
  readonly size = input<'sm' | 'md' | 'lg'>('sm');

  readonly stars = [1, 2, 3, 4, 5];
  readonly fillPercent = computed(() => Math.max(0, Math.min(100, (this.rating() / 5) * 100)));
  readonly sizeClass = computed(
    () => ({ sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' })[this.size()]
  );
}
```

### File: src/frontend/src/app/shared/components/toast/toast.component.ts
```typescript
import { Component, inject } from '@angular/core';
import { Toast, ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <!-- aria-live so screen readers announce toasts without stealing focus.
         pointer-events are off on the stack and back on per card, so the
         container never blocks clicks on the page beneath it. -->
    <div
      class="fixed inset-x-4 top-20 z-[60] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:top-24 sm:max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications">
      <div aria-live="polite" aria-atomic="false" class="sr-only">
        @for (toast of toasts(); track toast.id) {
          <p>{{ toast.message }}</p>
        }
      </div>

      @for (toast of toasts(); track toast.id) {
        <div
          class="w-full pointer-events-auto rounded-2xl border bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur
                 animate-[toastIn_0.28s_cubic-bezier(0.21,1.02,0.73,1)]"
          [class]="shell(toast.type)">
          <div class="flex items-start gap-3 p-4">
            <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" [class]="badge(toast.type)">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="icon(toast.type)" />
              </svg>
            </span>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium leading-snug text-slate-800">{{ toast.message }}</p>
              @if (toast.action; as action) {
                <button
                  type="button"
                  (click)="runAction(toast)"
                  class="mt-2 text-xs font-bold uppercase tracking-wide text-violet-600 hover:text-violet-500 transition-colors duration-200">
                  {{ action.label }}
                </button>
              }
            </div>

            <button
              type="button"
              (click)="dismiss(toast.id)"
              aria-label="Dismiss notification"
              class="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
                     transition-colors duration-200">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="h-1 rounded-b-2xl" [class]="accent(toast.type)"></div>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      :host div { animation: none !important; }
    }
  `,
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  private static readonly SHELL: Record<ToastType, string> = {
    success: 'border-emerald-200/80',
    error: 'border-rose-200/80',
    warning: 'border-amber-200/80',
    info: 'border-violet-200/80',
  };

  private static readonly BADGE: Record<ToastType, string> = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-rose-100 text-rose-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-violet-100 text-violet-600',
  };

  private static readonly ACCENT: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-violet-600',
  };

  private static readonly ICON: Record<ToastType, string> = {
    success: 'M4.5 12.75l6 6 9-13.5',
    error: 'M6 18L18 6M6 6l12 12',
    warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  };

  protected shell(type: ToastType): string {
    return ToastComponent.SHELL[type] ?? ToastComponent.SHELL.info;
  }

  protected badge(type: ToastType): string {
    return ToastComponent.BADGE[type] ?? ToastComponent.BADGE.info;
  }

  protected accent(type: ToastType): string {
    return ToastComponent.ACCENT[type] ?? ToastComponent.ACCENT.info;
  }

  protected icon(type: ToastType): string {
    return ToastComponent.ICON[type] ?? ToastComponent.ICON.info;
  }

  protected runAction(toast: Toast): void {
    toast.action?.handler();
    this.dismiss(toast.id);
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
```

### File: src/frontend/src/environments/environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  googleClientId: '617748704610-fkb78ghi924ucdutur23971k003gsmg8.apps.googleusercontent.com'
};
```

### File: src/frontend/src/environments/environment.ts
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5272/api',
  googleClientId: '617748704610-fkb78ghi924ucdutur23971k003gsmg8.apps.googleusercontent.com'
};
```

### File: src/frontend/src/google.d.ts
```typescript
declare namespace google {
  namespace accounts {
    namespace id {
      interface IdConfiguration {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        context?: string;
      }

      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      function initialize(config: IdConfiguration): void;
      function prompt(momentListener?: (notification: any) => void): void;
      function renderButton(parent: HTMLElement, options: any): void;
      function disableAutoSelect(): void;
    }
  }
}
```

### File: src/frontend/src/index.html
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Budgetha — Shop smarter, spend wiser</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="Discover the best deals from 200+ trusted vendors in one beautiful storefront. Browse, save, and check out in seconds.">

  <!-- PWA -->
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#0f766e">
  <meta name="color-scheme" content="light">
  <meta name="application-name" content="Budgetha">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Budgetha">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" sizes="192x192" href="icons/icon-192x192.png">
  <link rel="apple-touch-icon" sizes="152x152" href="icons/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="144x144" href="icons/icon-144x144.png">
  <link rel="icon" type="image/png" sizes="512x512" href="icons/icon-512x512.png">
  <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-96x96.png">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <!-- Social preview -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Budgetha">
  <meta property="og:title" content="Budgetha — Shop smarter, spend wiser">
  <meta property="og:description" content="Discover the best deals from 200+ trusted vendors in one beautiful storefront.">
  <meta property="og:image" content="icons/icon-512x512.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
  <script src="https://accounts.google.com/gsi/client" async="" defer=""></script>
  <script src="https://scaleflex.cloudimg.io/v7/plugins/filerobot-image-editor/latest/filerobot-image-editor.min.js"></script>
</head>
<body>
  <app-root></app-root>
  <noscript>Please enable JavaScript to continue using this application.</noscript>
</body>
</html>
```

### File: src/frontend/src/main.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

### File: src/frontend/src/styles.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .animate-gradient-slow {
    animation: gradientShift 15s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-pan-bg {
    animation: panBg 40s linear infinite;
  }

  @keyframes panBg {
    0% { background-position: 0px 0px; }
    100% { background-position: 100px 100px; }
  }
}

/* ── Global resets ── */

* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

::selection {
  background-color: #ddd6fe;
  color: #4c1d95;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
  color: #1e293b;
}

/* ── Component classes ── */

@layer components {
  .input-field {
    @apply w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900
           placeholder:text-slate-400
           focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
           transition-all duration-200;
  }

  .input-error {
    @apply border-red-300 bg-red-50/30 focus:ring-red-500/20 focus:border-red-500;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3
           text-sm font-semibold text-white shadow-sm shadow-violet-600/25
           hover:bg-violet-500 hover:shadow-md hover:shadow-violet-600/30
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-violet-600
           transition-all duration-300;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3
           text-sm font-semibold text-slate-700 shadow-sm
           hover:bg-slate-50 hover:border-slate-300
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           disabled:opacity-60 disabled:cursor-not-allowed
           transition-all duration-300;
  }

  .btn-social {
    @apply inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5
           text-sm font-medium text-slate-700
           hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           transition-all duration-300;
  }

  .card {
    @apply bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50;
  }

  .badge {
    @apply inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold;
  }

  .icon-btn {
    @apply inline-flex items-center justify-center rounded-full text-slate-500
           hover:text-violet-600 hover:bg-violet-50
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           transition-all duration-300;
  }

  .qty-btn {
    @apply inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600
           hover:bg-white hover:text-violet-600 hover:shadow-sm
           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none
           transition-all duration-200;
  }
}

/* ── Utility classes ── */

.text-gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #c026d3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Dual-thumb price range slider */
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  outline: none;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #7c3aed;
  box-shadow: 0 1px 4px rgba(124, 58, 237, 0.35);
  cursor: pointer;
  transition: transform 0.2s;
}
.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.range-slider::-moz-range-thumb {
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #7c3aed;
  box-shadow: 0 1px 4px rgba(124, 58, 237, 0.35);
  cursor: pointer;
  transition: transform 0.2s;
}
.range-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}
```

