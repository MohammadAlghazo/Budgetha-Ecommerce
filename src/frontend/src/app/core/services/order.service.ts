import { Injectable, computed, effect, signal } from '@angular/core';
import { Address, CartItem, Order, OrderStatus, PromoCode } from '../models/shop.models';

const STORAGE_KEY = 'budgetha_orders_v2';

const SEED_ORDERS: Order[] = [];

export interface PlaceOrderInput {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  address: Address;
  paymentSummary: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(this.load());

  readonly orders = computed(() =>
    this._orders().slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  );

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._orders())));
  }

  getByNumber(orderNumber: string): Order | undefined {
    return this._orders().find(o => o.number === orderNumber);
  }

  placeOrder(input: PlaceOrderInput): Order {
    const id = Math.max(0, ...this._orders().map(o => o.id)) + 1;
    const order: Order = {
      id,
      number: `BGT-2026-${String(600 + id * 7).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Processing' as OrderStatus,
      items: input.items.map(i => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      })),
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
      shippingAddress: `${input.address.line1}${input.address.line2 ? ', ' + input.address.line2 : ''}, ${input.address.city}, ${input.address.state} ${input.address.zip}`,
      paymentSummary: input.paymentSummary,
    };
    this._orders.update(orders => [...orders, order]);
    return order;
  }

  private load(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  }
}
