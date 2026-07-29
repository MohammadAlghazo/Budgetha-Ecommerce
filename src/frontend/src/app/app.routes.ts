import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- Auth routes (declared BEFORE the shell so they resolve before the
  //     shell's `**` wildcard child, which would otherwise swallow them). ---
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  // Convenience redirects so /login and /register also work.
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

  // --- Main app shell ---
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'shop',
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
      },
      {
        path: 'products/:slug',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
      },
      {
        path: 'checkout/success/:number',
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
            loadComponent: () => import('./features/account/account-orders.component').then(m => m.AccountOrdersComponent),
          },
          {
            path: 'addresses',
            loadComponent: () => import('./features/account/account-addresses.component').then(m => m.AccountAddressesComponent),
          },
          {
            path: 'payments',
            loadComponent: () => import('./features/account/account-payments.component').then(m => m.AccountPaymentsComponent),
          },
          {
            path: 'settings',
            loadComponent: () => import('./features/account/account-settings.component').then(m => m.AccountSettingsComponent),
          },
        ],
      },
      { path: 'dashboard', redirectTo: 'account/orders' },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
