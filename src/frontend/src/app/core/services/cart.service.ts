import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem, Product, PromoCode } from '../models/shop.models';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'budgetha_cart';
const PROMO_KEY = 'budgetha_promo';

export const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'SAVE20', type: 'percent', value: 20, description: '20% off your order' },
  { code: 'FREESHIP', type: 'shipping', value: 0, description: 'Free shipping' },
];

export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_SHIPPING = 6.99;
export const TAX_RATE = 0.08;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  private readonly _items = signal<CartItem[]>(this.load());
  private readonly _promo = signal<PromoCode | null>(this.loadPromo());
  private readonly _drawerOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly promo = this._promo.asReadonly();
  readonly drawerOpen = this._drawerOpen.asReadonly();

  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, i) => sum + i.price * i.quantity, 0));
  readonly discount = computed(() => {
    const promo = this._promo();
    if (!promo || promo.type !== 'percent') return 0;
    return (this.subtotal() * promo.value) / 100;
  });
  readonly shipping = computed(() => {
    if (this._items().length === 0) return 0;
    if (this._promo()?.type === 'shipping') return 0;
    return this.subtotal() - this.discount() >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  });
  readonly tax = computed(() => (this.subtotal() - this.discount()) * TAX_RATE);
  readonly total = computed(() => this.subtotal() - this.discount() + this.shipping() + this.tax());
  readonly amountToFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - (this.subtotal() - this.discount()))
  );

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      const promo = this._promo();
      if (promo) {
        localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    });

    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.syncWithBackend();
      } else {
        this._items.set(this.load());
      }
    }, { allowSignalWrites: true });
  }

  private syncWithBackend() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          const mappedItems: CartItem[] = cart.items.map((i: any) => ({
            id: i.id,
            productId: i.productId,
            name: i.productName,
            slug: '', // missing in backend dto, can add if needed
            brand: '',
            image: i.productImage || '',
            price: i.price,
            quantity: i.quantity,
            stock: i.stock,
            type: i.type === 0 ? 'Purchase' : 'Rental',
            rentalStartDate: i.rentalStartDate,
            rentalEndDate: i.rentalEndDate
          }));
          
          // Merge logic: If local storage had items and backend is empty, maybe push to backend?
          // For simplicity, let's just use backend state if it has items, otherwise push local to backend.
          const localItems = this.load();
          if (mappedItems.length === 0 && localItems.length > 0) {
             // Push local items to backend one by one
             this.pushLocalToBackend(localItems);
          } else {
             this._items.set(mappedItems);
          }
        }
      },
      error: (err) => console.error('Failed to sync cart', err)
    });
  }

  private pushLocalToBackend(localItems: CartItem[]) {
    const items = localItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    }));

    this.http.post(`${this.apiUrl}/sync`, { items }).subscribe({
      next: () => this.syncWithBackend(),
      error: (err) => console.error('Failed to bulk sync cart', err)
    });
  }

  add(product: Product, quantity = 1, color?: string, size?: string): void {
    if (this.auth.isAuthenticated()) {
      this.http.post(`${this.apiUrl}/items`, {
        productId: product.id,
        quantity: quantity,
        type: product.isAvailableForRent ? 1 : 0,
        rentalStartDate: null,
        rentalEndDate: null
      }).subscribe({
        next: () => {
          this.syncWithBackend();
          this.toast.success(`${product.name} added to cart`);
        },
        error: () => this.toast.error('Failed to add to cart')
      });
    } else {
      // Local logic
      this._items.update(items => {
        const existing = items.find(
          i => i.productId === product.id && i.color === color && i.size === size
        );
        if (existing) {
          return items.map(i =>
            i === existing ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) } : i
          );
        }
        return [
          ...items,
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            brand: product.brand,
            image: product.images?.[0] || '',
            price: product.price,
            quantity: Math.min(quantity, product.stock),
            stock: product.stock,
            color,
            size,
            type: product.isAvailableForRent ? 'Rental' : 'Purchase'
          },
        ];
      });
      this.toast.success(`${product.name} added to cart`);
    }
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.remove(item);
      return;
    }
    
    if (this.auth.isAuthenticated() && item.id) {
      this.http.put(`${this.apiUrl}/items/${item.id}`, {
        itemId: item.id,
        quantity: quantity
      }).subscribe({
        next: () => this.syncWithBackend(),
        error: () => this.toast.error('Failed to update quantity')
      });
    } else {
      this._items.update(items =>
        items.map(i =>
          i.productId === item.productId && i.color === item.color && i.size === item.size
            ? { ...i, quantity: Math.min(quantity, i.stock) }
            : i
        )
      );
    }
  }

  remove(item: CartItem): void {
    if (this.auth.isAuthenticated() && item.id) {
      this.http.delete(`${this.apiUrl}/items/${item.id}`).subscribe({
        next: () => {
          this.syncWithBackend();
          this.toast.success('Item removed');
        },
        error: () => this.toast.error('Failed to remove item')
      });
    } else {
      this._items.update(items =>
        items.filter(
          i => !(i.productId === item.productId && i.color === item.color && i.size === item.size)
        )
      );
      this.toast.success('Item removed');
    }
  }

  clear(): void {
    if (this.auth.isAuthenticated()) {
      this.http.delete(this.apiUrl).subscribe({
        next: () => {
          this._items.set([]);
          this._promo.set(null);
        },
        error: () => this.toast.error('Failed to clear cart')
      });
    } else {
      this._items.set([]);
      this._promo.set(null);
    }
  }

  applyPromo(code: string): boolean {
    const promo = PROMO_CODES.find(p => p.code === code.trim().toUpperCase());
    if (promo) {
      this._promo.set(promo);
      this.toast.success(`Promo applied — ${promo.description}`);
      return true;
    }
    return false;
  }

  removePromo(): void {
    this._promo.set(null);
  }

  openDrawer(): void {
    this._drawerOpen.set(true);
  }

  closeDrawer(): void {
    this._drawerOpen.set(false);
  }

  private load(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private loadPromo(): PromoCode | null {
    try {
      return JSON.parse(localStorage.getItem(PROMO_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
