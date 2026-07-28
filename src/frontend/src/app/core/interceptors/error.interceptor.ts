import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      if (error.status === 0) {
        message = 'Unable to connect to the server. Please check your connection.';
      } else if (error.status === 401) {
        message = 'Your session has expired. Please sign in again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 422 || error.status === 400) {
        message = error.error?.message || error.error?.title || 'Invalid request. Please check your input.';
      } else if (error.status >= 500) {
        message = 'A server error occurred. Please try again later.';
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};
