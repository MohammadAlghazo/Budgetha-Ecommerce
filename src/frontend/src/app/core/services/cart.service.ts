import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Product, PromoCode } from '../models/shop.models';
import { ToastService } from './toast.service';

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

  constructor(private toast: ToastService) {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      const promo = this._promo();
      if (promo) {
        localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    });
  }

  add(product: Product, quantity = 1, color?: string, size?: string): void {
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
          image: product.images[0],
          price: product.price,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          color,
          size,
        },
      ];
    });
    this.toast.success(`${product.name} added to cart`);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.remove(item);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productId === item.productId && i.color === item.color && i.size === item.size
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  }

  remove(item: CartItem): void {
    this._items.update(items =>
      items.filter(
        i => !(i.productId === item.productId && i.color === item.color && i.size === item.size)
      )
    );
  }

  clear(): void {
    this._items.set([]);
    this._promo.set(null);
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
