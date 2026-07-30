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
