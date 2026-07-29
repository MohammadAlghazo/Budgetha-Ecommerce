import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  /** Optional inline button, e.g. "Reload" on a new-version notice. */
  action?: ToastAction;
}

export interface ToastOptions {
  /** Milliseconds before auto-dismiss. Pass 0 to require a manual dismiss. */
  duration?: number;
  action?: ToastAction;
}

/** Newest toasts push older ones out rather than filling the whole screen. */
const MAX_VISIBLE = 4;

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 4500,
  warning: 5000,
  error: 6500,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', options: ToastOptions | number = {}): number {
    // `options` accepts a bare number so older `show(msg, type, 4000)` calls keep working.
    const opts: ToastOptions = typeof options === 'number' ? { duration: options } : options;
    const duration = opts.duration ?? DEFAULT_DURATION[type];
    const id = this.nextId++;

    this.toasts.update(current => {
      // Collapse an identical message that's already on screen instead of stacking it.
      const deduped = current.filter(t => !(t.message === message && t.type === type));
      const next = [...deduped, { id, message, type, action: opts.action }];
      const overflow = next.slice(0, Math.max(0, next.length - MAX_VISIBLE));
      overflow.forEach(t => this.clearTimer(t.id));
      return next.slice(-MAX_VISIBLE);
    });

    if (duration > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }

    return id;
  }

  success(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'warning', options);
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear(): void {
    this.timers.forEach(handle => clearTimeout(handle));
    this.timers.clear();
    this.toasts.set([]);
  }

  private clearTimer(id: number): void {
    const handle = this.timers.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.timers.delete(id);
    }
  }
}
