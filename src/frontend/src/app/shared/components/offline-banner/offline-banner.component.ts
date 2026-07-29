import { Component, inject } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';

/**
 * Persistent strip shown while the browser reports no connection, so a shopper
 * understands why fresh prices or checkout might not be available — instead of
 * hitting silent failures.
 */
@Component({
  selector: 'app-offline-banner',
  standalone: true,
  template: `
    @if (!pwa.online()) {
      <div
        role="status"
        class="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-center text-xs font-medium text-amber-200">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75h.008v.008H12v-.008zM3 3l18 18M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c.512-.512 1.08-.95 1.688-1.312m10.1 1.312a7.5 7.5 0 00-2.39-1.6M1.924 8.674a13.5 13.5 0 013.16-2.226m14.992 2.226a13.46 13.46 0 00-7.65-3.44" />
        </svg>
        You’re offline — browsing cached pages. Checkout will resume once you reconnect.
      </div>
    }
  `,
})
export class OfflineBannerComponent {
  readonly pwa = inject(PwaService);
}
