import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  
  private lastMessage = '';
  private lastShownAt = 0;

  handleError(error: unknown): void {
    
    console.error(error);

    
    if (this.unwrap(error) instanceof HttpErrorResponse) return;

    const message = this.describe(error);
    if (!message) return;

    const now = performance.now();
    if (message === this.lastMessage && now - this.lastShownAt < 5000) return;
    this.lastMessage = message;
    this.lastShownAt = now;

    this.toast.error(message);
  }

  
  private unwrap(error: unknown): unknown {
    const nested = (error as { rejection?: unknown; cause?: unknown } | null);
    return nested?.rejection ?? nested?.cause ?? error;
  }

  private describe(error: unknown): string | null {
    const raw = this.unwrap(error);
    const text = raw instanceof Error ? `${raw.name}: ${raw.message}` : String(raw ?? '');

    
    
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

    
    
    return isDevMode()
      ? `Unexpected error: ${text}`
      : 'Something unexpected happened. We’ve logged it — please try that again.';
  }
}
