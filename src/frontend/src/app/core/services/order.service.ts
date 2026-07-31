import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Address, CartItem, Order, OrderStatus } from '../models/shop.models';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface PlaceOrderInput {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  address: Address;
  paymentSummary: string;
  notes?: string;
  shippingAddressId?: string; // UUID from backend if we use saved address
  paymentMethod: string;
  promoCode?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`;
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly _orders = signal<Order[]>([]);

  readonly orders = computed(() =>
    this._orders().slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  );

  constructor() {
    // Optionally fetch history on load if authenticated
  }

  getByNumber(orderNumber: string): Order | undefined {
    return this._orders().find(o => o.number === orderNumber);
  }

  placeOrder(input: PlaceOrderInput): Observable<string> {
    return this.http.post<string>(this.apiUrl, {
      shippingAddressId: input.shippingAddressId || null,
      notes: input.notes || '',
      paymentMethod: input.paymentMethod,
      promoCode: input.promoCode || null
    }).pipe(
      tap(orderId => {
        // Construct a mock local order or refresh history
        const id = Math.max(0, ...this._orders().map(o => o.id)) + 1;
        const order: Order = {
          id,
          number: orderId.toString().substring(0, 8).toUpperCase(), // Using guid start as order number for now
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
      })
    );
  }

  createPayPalOrder(orderId: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/${orderId}/create-paypal-order`, {});
  }

  capturePayPalOrder(orderId: string, paypalOrderId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/capture-paypal-order`, { paypalOrderId });
  }
}
