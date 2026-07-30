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
