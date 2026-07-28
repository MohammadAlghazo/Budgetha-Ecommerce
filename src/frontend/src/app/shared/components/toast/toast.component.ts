import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      @for (toast of toasts(); track toast.id) {
        <div
          class="px-5 py-4 rounded-xl shadow-lg border backdrop-blur-sm animate-slide-in"
          [class]="typeClasses(toast.type)"
          (click)="dismiss(toast.id)">
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ icon(toast.type) }}</span>
            <p class="text-sm font-medium leading-snug">{{ toast.message }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  protected toasts;

  constructor(private toastService: ToastService) {
    this.toasts = this.toastService.toasts;
  }

  protected typeClasses(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-emerald-50/95 border-emerald-200 text-emerald-800',
      error: 'bg-red-50/95 border-red-200 text-red-800',
      warning: 'bg-amber-50/95 border-amber-200 text-amber-800',
      info: 'bg-sky-50/95 border-sky-200 text-sky-800'
    };
    return map[type] || map['info'];
  }

  protected icon(type: string): string {
    const map: Record<string, string> = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return map[type] || map['info'];
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
