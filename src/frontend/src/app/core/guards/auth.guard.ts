import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  toast.warning('Please log in or create an account to proceed to checkout.');
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
