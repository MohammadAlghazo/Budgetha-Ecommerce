import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

/**
 * Turns every failed HTTP call into one clear, human-readable toast.
 *
 * Requests can opt out of the toast (but still get the error rethrown) by
 * setting the `X-Skip-Error-Toast` header — useful where a component renders
 * its own inline error and a toast would be redundant.
 */
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
        // Don't hand /auth/login back to itself as a returnUrl.
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
  // Prefer a message the API actually sent — it is more specific than anything
  // we can infer from the status code alone.
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

/** Digs a usable string out of the many shapes an API error body can take. */
function extractApiMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body) return null;
  if (typeof body === 'string') return body.trim() || null;

  if (Array.isArray(body.errors) && body.errors.length) {
    return String(body.errors[0]);
  }

  // ASP.NET Core ValidationProblemDetails: { errors: { Field: ["msg", ...] } }
  if (body.errors && typeof body.errors === 'object') {
    const first = Object.values(body.errors as Record<string, unknown>)
      .flat()
      .find(v => typeof v === 'string' && v.trim());
    if (first) return String(first);
  }

  return body.message || body.detail || body.title || null;
}
