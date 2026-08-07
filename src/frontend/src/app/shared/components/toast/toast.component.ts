import { Component, inject } from '@angular/core';
import { Toast, ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <!-- aria-live so screen readers announce toasts without stealing focus.
         pointer-events are off on the stack and back on per card, so the
         container never blocks clicks on the page beneath it. -->
    <div
      class="fixed inset-x-4 bottom-6 z-[60] flex flex-col items-end gap-3 sm:inset-x-auto sm:end-6 sm:bottom-8 sm:max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications">
      <div aria-live="polite" aria-atomic="false" class="sr-only">
        @for (toast of toasts(); track toast.id) {
          <p>{{ toast.message }}</p>
        }
      </div>

      @for (toast of toasts(); track toast.id) {
        <div
          class="w-full pointer-events-auto rounded-2xl border bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur dark:bg-slate-900/95 dark:shadow-black/30
                 animate-[toastIn_0.28s_cubic-bezier(0.21,1.02,0.73,1)]"
          [class]="shell(toast.type)">
          <div class="flex items-start gap-3 p-4">
            <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" [class]="badge(toast.type)">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="icon(toast.type)" />
              </svg>
            </span>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">{{ toast.message }}</p>
              @if (toast.action; as action) {
                <button
                  type="button"
                  (click)="runAction(toast)"
                  class="mt-2 text-xs font-bold uppercase tracking-wide text-violet-600 hover:text-violet-500 transition-colors duration-200">
                  {{ action.label }}
                </button>
              }
            </div>

            <button
              type="button"
              (click)="dismiss(toast.id)"
              aria-label="Dismiss notification"
               class="-me-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
                     transition-colors duration-200">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="h-1 rounded-b-2xl" [class]="accent(toast.type)"></div>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(15px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      :host div { animation: none !important; }
    }
  `,
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  private static readonly SHELL: Record<ToastType, string> = {
    success: 'border-emerald-200/80',
    error: 'border-rose-200/80',
    warning: 'border-amber-200/80',
    info: 'border-violet-200/80',
  };

  private static readonly BADGE: Record<ToastType, string> = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-rose-100 text-rose-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-violet-100 text-violet-600',
  };

  private static readonly ACCENT: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-violet-600',
  };

  private static readonly ICON: Record<ToastType, string> = {
    success: 'M4.5 12.75l6 6 9-13.5',
    error: 'M6 18L18 6M6 6l12 12',
    warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  };

  protected shell(type: ToastType): string {
    return ToastComponent.SHELL[type] ?? ToastComponent.SHELL.info;
  }

  protected badge(type: ToastType): string {
    return ToastComponent.BADGE[type] ?? ToastComponent.BADGE.info;
  }

  protected accent(type: ToastType): string {
    return ToastComponent.ACCENT[type] ?? ToastComponent.ACCENT.info;
  }

  protected icon(type: ToastType): string {
    return ToastComponent.ICON[type] ?? ToastComponent.ICON.info;
  }

  protected runAction(toast: Toast): void {
    toast.action?.handler();
    this.dismiss(toast.id);
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
