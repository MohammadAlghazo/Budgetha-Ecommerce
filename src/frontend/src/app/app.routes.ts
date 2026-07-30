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
