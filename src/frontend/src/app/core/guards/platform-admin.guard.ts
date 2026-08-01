import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const platformAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const roles = auth.user()?.roles ?? [];

  if (roles.includes('Admin') || roles.includes('SuperAdmin')) return true;

  toast.error('Administrator privileges are required.');
  return router.parseUrl('/admin/dashboard');
};
