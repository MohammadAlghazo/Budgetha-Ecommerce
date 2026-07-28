import { Injectable, computed, effect, signal } from '@angular/core';
import { Address, CartItem, Order, OrderStatus, PromoCode } from '../models/shop.models';

const STORAGE_KEY = 'budgetha_orders';

const SEED_ORDERS: Order[] = [
  {
    id: 1,
    number: 'BGT-2026-0417',
    date: '2026-06-14',
    status: 'Delivered',
    items: [
      {
        productId: 1,
        name: 'AudioPeak Pro Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
        price: 249.99,
        quantity: 1,
        color: 'Midnight Black',
      },
      {
        productId: 5,
        name: 'Luxe Aviator Sunglasses',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=200&q=80',
        price: 59.99,
        quantity: 1,
        color: 'Gold / Green',
      },
    ],
    subtotal: 309.98,
    shipping: 0,
    tax: 24.8,
    discount: 0,
    total: 334.78,
    shippingAddress: '742 Evergreen Terrace, Springfield, IL 62704',
    paymentSummary: 'Visa •••• 4242',
  },
  {
    id: 2,
    number: 'BGT-2026-0562',
    date: '2026-07-08',
    status: 'Shipped',
    items: [
      {
        productId: 10,
        name: 'NordicWear Organic Cotton Tee',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
        price: 32.0,
        quantity: 2,
        color: 'Bone',
        size: 'M',
      },
    ],
    subtotal: 64.0,
    shipping: 6.99,
    tax: 5.12,
    discount: 6.4,
    total: 69.71,
    shippingAddress: '742 Evergreen Terrace, Springfield, IL 62704',
    paymentSummary: 'Visa •••• 4242',
  },
  {
    id: 3,
    number: 'BGT-2026-0631',
    date: '2026-07-24',
    status: 'Processing',
    items: [
      {
        productId: 9,
        name: 'LumenHome Halo Desk Lamp',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80',
        price: 64.99,
        quantity: 1,
        color: 'Matte Black',
      },
    ],
    subtotal: 64.99,
    shipping: 6.99,
    tax: 5.2,
    discount: 0,
    total: 77.18,
    shippingAddress: '742 Evergreen Terrace, Springfield, IL 62704',
    paymentSummary: 'Cash on Delivery',
  },
];

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
