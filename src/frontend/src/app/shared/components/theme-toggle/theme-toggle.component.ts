import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="theme.cycleMode()"
      class="theme-toggle inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2.5 text-slate-600 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-teal-700 dark:hover:bg-teal-950/60 dark:hover:text-teal-300"
      [attr.aria-label]="ariaLabel()"
      [attr.title]="ariaLabel()"
      [attr.data-mode]="theme.mode()">
      @switch (theme.mode()) {
        @case ('light') {
          <svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3.5" />
            <path stroke-linecap="round" d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.72 5.28l-1.42 1.42M6.7 17.3l-1.42 1.42M18.72 18.72l-1.42-1.42M6.7 6.7L5.28 5.28" />
          </svg>
        }
        @case ('dark') {
          <svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.4 15.2A8.7 8.7 0 018.8 3.6 8.7 8.7 0 1020.4 15.2z" />
          </svg>
        }
        @default {
          <svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path stroke-linecap="round" d="M8 21h8M12 17v4" />
          </svg>
        }
      }
      <span class="hidden text-xs font-semibold sm:inline">{{ label() }}</span>
      <span class="sr-only">Current theme: {{ label() }}</span>
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
  readonly label = computed(() => {
    const mode = this.theme.mode();
    return mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System';
  });
  readonly ariaLabel = computed(() =>
    `Theme: ${this.label()}. Activate to switch to ${this.nextLabel()}.`
  );

  private nextLabel(): string {
    const mode = this.theme.mode();
    return mode === 'light' ? 'Dark' : mode === 'dark' ? 'System' : 'Light';
  }
}
