import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem, Product, PromoCode } from '../models/shop.models';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'budgetha_cart';
const PROMO_KEY = 'budgetha_promo';

export const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'SAVE20', type: 'percent', value: 20, description: '20% off your order' },
];

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  private readonly _items = signal<CartItem[]>(this.load());
  private readonly _promo = signal<PromoCode | null>(this.loadPromo());
  private readonly _drawerOpen = signal(false);
  private authenticatedCartLoaded = false;

  readonly items = this._items.asReadonly();
  readonly promo = this._promo.asReadonly();
  readonly drawerOpen = this._drawerOpen.asReadonly();

  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, i) => sum + i.price * i.quantity, 0));
  readonly discount = computed(() => {
    const promo = this._promo();
    if (!promo || promo.type !== 'percent' || promo.scope === 'Seller') return 0;
    const percentageDiscount = (this.subtotal() * promo.value) / 100;
    return promo.maxDiscountAmount == null
      ? percentageDiscount
      : Math.min(percentageDiscount, promo.maxDiscountAmount);
  });
  readonly total = computed(() => Math.max(0, this.subtotal() - this.discount()));
  readonly hasRental = computed(() => this._items().some(item => item.type === 'Rental'));

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated() && !this.authenticatedCartLoaded) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      }
      const promo = this._promo();
      if (promo) {
        localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    });

    effect(() => {
      if (this.auth.isAuthenticated()) {
        if (!this.authenticatedCartLoaded) {
          this.authenticatedCartLoaded = true;
          this.mergeGuestCartIntoBackend();
        }
      } else {
        this.authenticatedCartLoaded = false;
        this._items.set(this.load());
      }
    }, { allowSignalWrites: true });
  }

  private syncWithBackend() {
    this.fetchFromBackend();
  }

  private mergeGuestCartIntoBackend() {
    const localItems = this.load();
    if (localItems.length > 0) {
      this.pushLocalToBackend(localItems);
    } else {
      this.fetchFromBackend();
    }
  }

  private fetchFromBackend() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          const mappedItems: CartItem[] = cart.items.map((i: any) => ({
            id: i.id,
            productId: i.productId,
            variantId: i.variantId,
            name: i.productName,
            slug: i.productSlug,
            brand: i.brand || 'Generic',
            image: i.productImage || '',
            price: i.price,
            quantity: i.quantity,
            stock: i.stock,
            type: typeof i.type === 'string'
              ? (i.type.toLowerCase() === 'rental' ? 'Rental' : 'Purchase')
              : (i.type === 1 ? 'Rental' : 'Purchase'),
            rentalStartDate: i.rentalStartDate,
            rentalEndDate: i.rentalEndDate,
            color: i.color,
            size: i.size
          }));
          this._items.set(mappedItems);
        } else {
          this._items.set([]);
        }
      },
      error: (err) => console.error('Failed to sync cart', err)
    });
  }

  private pushLocalToBackend(localItems: CartItem[]) {
    const items = localItems.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      type: item.type === 'Rental' ? 1 : 0,
      rentalStartDate: item.rentalStartDate ?? null,
      rentalEndDate: item.rentalEndDate ?? null
    }));

    this.http.post(`${this.apiUrl}/sync`, { items }).subscribe({
      next: () => {
        localStorage.removeItem(STORAGE_KEY);
        this.fetchFromBackend();
      },
      error: (err) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localItems));
        console.error('Failed to bulk sync cart', err);
      }
    });
  }

  add(
    product: Product,
    quantity = 1,
    color?: string,
    size?: string,
    type: 'Purchase' | 'Rental' = 'Purchase',
    rentalStartDate?: string,
    rentalEndDate?: string,
    variantId?: string
  ): void {
    const variant = product.variants?.find(v => v.id === variantId && v.isActive);
    if (product.variants?.some(v => v.isActive) && !variant) {
      this.toast.error('Select an available product variant');
      return;
    }
    if (type === 'Rental' && (!rentalStartDate || !rentalEndDate || rentalEndDate <= rentalStartDate)) {
      this.toast.error('Rental end date must be after the start date');
      return;
    }
    const stock = variant?.stockQuantity ?? product.stock;
    const days = type === 'Rental' && rentalStartDate && rentalEndDate
      ? (Date.parse(rentalEndDate) - Date.parse(rentalStartDate)) / 86400000
      : 1;
    const price = type === 'Rental'
      ? (variant?.rentalPricePerDay ?? product.rentalPricePerDay ?? variant?.price ?? product.price) * days
      : variant?.price ?? product.price;
    if (this.auth.isAuthenticated()) {
      const optimisticItem: CartItem = {
        id: `optimistic-${Date.now()}`,
        productId: product.id,
        variantId: variant?.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand || 'Generic',
        image: product.images?.[0] || '',
        price,
        quantity,
        stock,
        color: variant?.color ?? color,
        size: variant?.size ?? size,
        type,
        rentalStartDate,
        rentalEndDate,
      };
      this._items.update(items => {
        const existing = items.find(
          i => i.productId === product.id && i.variantId === variant?.id &&
            i.type === type && i.rentalStartDate === rentalStartDate && i.rentalEndDate === rentalEndDate
        );
        if (existing) {
          return items.map(i => i === existing ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) } : i);
        }
        return [...items, optimisticItem];
      });
      this.http.post(`${this.apiUrl}/items`, {
        productId: product.id,
        variantId: variant?.id ?? null,
        quantity: quantity,
        type: type === 'Rental' ? 1 : 0,
        rentalStartDate: rentalStartDate ?? null,
        rentalEndDate: rentalEndDate ?? null,
        color,
        size
      }).subscribe({
        next: () => {
          this.fetchFromBackend();
          this.toast.success(`${product.name} added to cart`);
        },
        error: () => {
          this._items.update(items => items.filter(i => i.id !== optimisticItem.id));
          this.toast.error('Failed to add item to cart');
        }
      });
    } else {
      // Local logic
      this._items.update(items => {
        const existing = items.find(
          i => i.productId === product.id && i.variantId === variant?.id &&
            i.type === type && i.rentalStartDate === rentalStartDate && i.rentalEndDate === rentalEndDate
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
            variantId: variant?.id,
            price,
            quantity: Math.min(quantity, stock),
            stock,
            color: variant?.color,
            size: variant?.size,
            type,
            rentalStartDate,
            rentalEndDate,
            rentalPricePerDay: product.rentalPricePerDay
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
        next: () => this.fetchFromBackend(),
        error: () => undefined
      });
    } else {
      this._items.update(items =>
        items.map(i =>
          i.productId === item.productId && i.variantId === item.variantId &&
            i.type === item.type && i.rentalStartDate === item.rentalStartDate && i.rentalEndDate === item.rentalEndDate
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
          this.fetchFromBackend();
          this.toast.success('Item removed');
        },
        error: () => undefined
      });
    } else {
      this._items.update(items =>
        items.filter(
          i => !(i.productId === item.productId && i.variantId === item.variantId &&
            i.type === item.type && i.rentalStartDate === item.rentalStartDate && i.rentalEndDate === item.rentalEndDate)
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

  applyPromo(code: string): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      this.http.get<any>(`${environment.apiUrl}/PromoCodes/${code}`).subscribe({
        next: (promo) => {
          this._promo.set({
            code: promo.code,
            type: 'percent',
            value: promo.discountPercentage,
            description: promo.maxDiscountAmount == null
              ? `${promo.discountPercentage}% off your order`
              : `${promo.discountPercentage}% off, up to $${Number(promo.maxDiscountAmount).toFixed(2)}`,
            maxDiscountAmount: promo.maxDiscountAmount ?? undefined,
            scope: promo.scope ?? 'Platform',
            sellerId: promo.sellerId ?? undefined
          });
          this.toast.success(`Promo applied — ${promo.discountPercentage}% off`);
          subscriber.next(true);
          subscriber.complete();
        },
        error: () => {
          this.toast.error('Invalid or expired promo code');
          subscriber.next(false);
          subscriber.complete();
        }
      });
    });
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
