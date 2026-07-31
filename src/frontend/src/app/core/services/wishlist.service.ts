import { Injectable, computed, effect, signal } from '@angular/core';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'budgetha_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _ids = signal<string[]>(this.load());

  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  constructor(private toast: ToastService) {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._ids())));
  }

  has(productId: string): boolean {
    return this._ids().includes(productId);
  }

  toggle(productId: string, productName?: string): void {
    if (this.has(productId)) {
      this._ids.update(ids => ids.filter(id => id !== productId));
      if (productName) this.toast.info(`${productName} removed from wishlist`);
    } else {
      this._ids.update(ids => [...ids, productId]);
      if (productName) this.toast.success(`${productName} saved to wishlist`);
    }
  }

  private load(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch { }
    return [];
  }
}
