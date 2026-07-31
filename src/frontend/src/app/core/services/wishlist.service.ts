import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'budgetha_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly apiUrl = `${environment.apiUrl}/wishlists`;
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  private readonly _ids = signal<string[]>(this.load());

  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._ids())));

    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.syncWithBackend();
      } else {
        this._ids.set(this.load());
      }
    }, { allowSignalWrites: true });
  }

  private syncWithBackend() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (items) => {
        if (items) {
          const remoteIds = items.map(i => i.productId);
          
          // Merge logic: push local to backend if local has items and backend is empty
          const localIds = this.load();
          if (remoteIds.length === 0 && localIds.length > 0) {
             this.pushLocalToBackend(localIds);
          } else {
             this._ids.set(remoteIds);
          }
        }
      },
      error: (err) => console.error('Failed to sync wishlist', err)
    });
  }

  private pushLocalToBackend(localIds: string[]) {
    localIds.forEach(id => {
      this.http.post(this.apiUrl, { productId: id }).subscribe();
    });
    setTimeout(() => this.syncWithBackend(), 1000);
  }

  has(productId: string): boolean {
    return this._ids().includes(productId);
  }

  toggle(productId: string, productName?: string): void {
    const exists = this.has(productId);

    if (this.auth.isAuthenticated()) {
      if (exists) {
        this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
          next: () => {
            this._ids.update(ids => ids.filter(id => id !== productId));
            if (productName) this.toast.info(`${productName} removed from wishlist`);
          },
          error: () => this.toast.error('Failed to remove from wishlist')
        });
      } else {
        this.http.post(this.apiUrl, { productId }).subscribe({
          next: () => {
            this._ids.update(ids => [...ids, productId]);
            if (productName) this.toast.success(`${productName} saved to wishlist`);
          },
          error: () => this.toast.error('Failed to add to wishlist')
        });
      }
    } else {
      if (exists) {
        this._ids.update(ids => ids.filter(id => id !== productId));
        if (productName) this.toast.info(`${productName} removed from wishlist`);
      } else {
        this._ids.update(ids => [...ids, productId]);
        if (productName) this.toast.success(`${productName} saved to wishlist`);
      }
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
