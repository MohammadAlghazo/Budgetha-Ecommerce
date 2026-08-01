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
  
  action?: ToastAction;
}

export interface ToastOptions {
  
  duration?: number;
  action?: ToastAction;
}


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
    
    const opts: ToastOptions = typeof options === 'number' ? { duration: options } : options;
    const duration = opts.duration ?? DEFAULT_DURATION[type];
    const id = this.nextId++;

    this.toasts.update(current => {
      
      const deduped = current.filter(t => !(t.message === message && t.type === type));
      const next = [{ id, message, type, action: opts.action }, ...deduped];
      const overflow = next.slice(MAX_VISIBLE);
      overflow.forEach(t => this.clearTimer(t.id));
      return next.slice(0, MAX_VISIBLE);
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
