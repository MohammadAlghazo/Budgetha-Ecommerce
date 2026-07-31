import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const silent = req.headers.has('X-Skip-Error-Toast');
  const cleaned = silent ? req.clone({ headers: req.headers.delete('X-Skip-Error-Toast') }) : req;

  return next(cleaned).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = describe(error);

      if (error.status === 401 && !req.url.includes('auth/login') && !req.url.includes('auth/refresh')) {
        const token = auth.getToken();
        const user = auth.user();
        if (token && user?.refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshTokenSubject.next(null);

            return auth.refreshToken(token, user.refreshToken).pipe(
              switchMap((authResponse) => {
                isRefreshing = false;
                refreshTokenSubject.next(authResponse.token);
                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${authResponse.token}` }
                }));
              }),
              catchError((err) => {
                isRefreshing = false;
                auth.clearSession();
                router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
                return throwError(() => err);
              })
            );
          } else {
            return refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(jwt => {
                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${jwt}` }
                }));
              })
            );
          }
        } else {
          auth.clearSession();
          const current = router.url;
          const returnUrl = current.startsWith('/auth/') ? null : current;
          router.navigate(['/auth/login'], { queryParams: { returnUrl } });
        }
      } else if (error.status === 401) {
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
