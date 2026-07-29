import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';

/**
 * Last line of defence for anything the HTTP error interceptor doesn't cover:
 * uncaught exceptions in components, rejected promises, and failed lazy-route
 * chunk downloads. Without this, a runtime error leaves the user staring at a
 * half-rendered page with no idea what happened.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  /** Avoids flooding the screen when one broken render loop throws repeatedly. */
  private lastMessage = '';
  private lastShownAt = 0;

  handleError(error: unknown): void {
    // Always keep the real error in the console for debugging.
    console.error(error);

    // HTTP failures already produced a specific toast in the interceptor.
    if (this.unwrap(error) instanceof HttpErrorResponse) return;

    const message = this.describe(error);
    if (!message) return;

    const now = performance.now();
    if (message === this.lastMessage && now - this.lastShownAt < 5000) return;
    this.lastMessage = message;
    this.lastShownAt = now;

    this.toast.error(message);
  }

  /** Angular wraps errors thrown during change detection in an outer Error. */
  private unwrap(error: unknown): unknown {
    const nested = (error as { rejection?: unknown; cause?: unknown } | null);
    return nested?.rejection ?? nested?.cause ?? error;
  }

  private describe(error: unknown): string | null {
    const raw = this.unwrap(error);
    const text = raw instanceof Error ? `${raw.name}: ${raw.message}` : String(raw ?? '');

    // A failed dynamic import almost always means the deployed bundle changed
    // under a cached shell. Reloading picks up the new one.
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

    // In development, show the real error so it's obvious something broke.
    // In production, keep it friendly — the details are in the console.
    return isDevMode()
      ? `Unexpected error: ${text}`
      : 'Something unexpected happened. We’ve logged it — please try that again.';
  }
}
