import { Component, inject, input } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';


@Component({
  selector: 'app-install-button',
  standalone: true,
  template: `
    @if (pwa.showInstallAffordance()) {
      @switch (variant()) {
        @case ('header') {
          <button
            type="button"
            (click)="pwa.install()"
            title="Install Budgetha as an app"
            class="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2
                   text-xs font-semibold text-violet-700 hover:bg-violet-100 hover:border-violet-300
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
                   transition-all duration-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13.5m0 0l4.5-4.5M12 16.5L7.5 12M3.75 18.75h16.5" />
            </svg>
            Install app
          </button>
        }

        @case ('footer') {
          <div class="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
            <div class="flex items-start gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </span>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-white">Get the Budgetha app</h4>
                <p class="mt-1 text-xs leading-relaxed text-slate-400">
                  Install it for faster loading, offline browsing, and one-tap access from your home screen.
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <button type="button" (click)="pwa.install()" class="btn-primary flex-1 py-2.5 text-xs">Install app</button>
              <button
                type="button"
                (click)="pwa.dismissInstall()"
                class="rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors duration-300">
                Not now
              </button>
            </div>
          </div>
        }
      }
    }
  `,
})
export class InstallButtonComponent {
  readonly pwa = inject(PwaService);
  readonly variant = input<'header' | 'footer'>('header');
}
