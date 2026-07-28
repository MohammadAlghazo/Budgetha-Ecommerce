import { Injectable, computed, effect, signal } from '@angular/core';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'budgetha_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _ids = signal<number[]>(this.load());

  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  constructor(private toast: ToastService) {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._ids())));
  }

  has(productId: number): boolean {
    return this._ids().includes(productId);
  }

  toggle(productId: number, productName?: string): void {
    if (this.has(productId)) {
      this._ids.update(ids => ids.filter(id => id !== productId));
      if (productName) this.toast.info(`${productName} removed from wishlist`);
    } else {
      this._ids.update(ids => [...ids, productId]);
      if (productName) this.toast.success(`${productName} saved to wishlist`);
    }
  }

  private load(): number[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
