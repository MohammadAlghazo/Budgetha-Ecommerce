import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Address, CartItem, Order } from '../models/shop.models';
import { environment } from '../../../environments/environment';

export interface PlaceOrderInput {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  address: Address;
  paymentSummary: string;
  notes?: string;
  shippingAddressId?: string; // UUID from backend if we use saved address
  paymentMethod: string;
  promoCode?: string;
}

export interface CheckoutQuote {
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  promoCode?: string;
  promoScope?: string;
  promoSellerId?: string;
}

interface CustomerOrderResponse {
  id: string;
  orderNumber: string;
  date: string;
  status: Order['status'];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    type: Order['items'][number]['type'];
    rentalStartDate?: string;
    rentalEndDate?: string;
    color?: string;
    size?: string;
    fulfillmentId?: string;
    sellerName?: string;
  }>;
  shippingAddress?: { fullName: string; phone: string; line1: string; line2?: string; city: string; state: string; postalCode: string; country: string };
  paymentProvider?: string;
  paymentStatus?: string;
  canConfirmReceipt: boolean;
  canReportNotReceived: boolean;
  fulfillments: NonNullable<Order['fulfillments']>;
  deliveryReports: NonNullable<Order['deliveryReports']>;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`;
  private readonly http = inject(HttpClient);

  private readonly _orders = signal<Order[]>([]);

  readonly orders = computed(() =>
    this._orders().slice().sort((a, b) => b.date.localeCompare(a.date))
  );

  getByNumber(orderNumber: string): Order | undefined {
    return this._orders().find(o => o.number === orderNumber);
  }

  refresh(): Observable<Order[]> {
    return this.http.get<CustomerOrderResponse[]>(`${this.apiUrl}/mine`).pipe(
      map(orders => orders.map(order => this.toOrder(order))),
      tap(orders => this._orders.set(orders))
    );
  }

  getByNumberRemote(orderNumber: string): Observable<Order> {
    return this.http.get<CustomerOrderResponse>(`${this.apiUrl}/mine/by-number/${encodeURIComponent(orderNumber)}`).pipe(
      map(order => this.toOrder(order)),
      tap(order => this._orders.update(orders => [...orders.filter(existing => existing.id !== order.id), order]))
    );
  }

  getQuote(country: string, state: string, promoCode?: string): Observable<CheckoutQuote> {
    return this.http.post<CheckoutQuote>(`${this.apiUrl}/quote`, { country, state, promoCode: promoCode || null });
  }

  placeOrder(input: PlaceOrderInput): Observable<string> {
    return this.http.post<string>(this.apiUrl, {
      shippingAddressId: input.shippingAddressId || null,
      notes: input.notes || '',
      paymentMethod: input.paymentMethod,
      promoCode: input.promoCode || null
    }).pipe(
      tap(orderId => {
        const order: Order = {
          id: orderId,
          number: `BGT-${new Date().getFullYear()}-${orderId.toString().substring(0, 4).toUpperCase()}`,
          date: new Date().toISOString().slice(0, 10),
          status: 'Pending',
          items: input.items.map(i => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
            type: i.type,
            rentalStartDate: i.rentalStartDate,
            rentalEndDate: i.rentalEndDate,
          })),
          subtotal: input.subtotal,
          shipping: 0,
          tax: 0,
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

  cancelOrder(orderId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  shipOrder(orderId: string, carrier?: string, trackingNumber?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/ship`, { carrier: carrier || null, trackingNumber: trackingNumber || null });
  }

  rejectOrder(orderId: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/reject`, { reason });
  }

  confirmReceived(orderId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/confirm-received`, {}).pipe(tap(() => this.refresh().subscribe()));
  }

  reportNotReceived(orderId: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/report-not-received`, { reason }).pipe(tap(() => this.refresh().subscribe()));
  }

  resolveDeliveryReport(reportId: string, dismiss: boolean, note: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delivery-reports/${reportId}/resolve`, { dismiss, note });
  }

  formatOrderNumber(orderId: string, date = new Date()): string {
    return `BGT-${date.getFullYear()}-${orderId.substring(0, 4).toUpperCase()}`;
  }

  private toOrder(response: CustomerOrderResponse): Order {
    const address = response.shippingAddress;
    return {
      id: response.id,
      number: response.orderNumber,
      date: response.date,
      status: response.status,
      items: response.items.map(item => ({
        productId: item.productId,
        name: item.productName,
        image: item.productImage,
        price: item.unitPrice,
        quantity: item.quantity,
        type: item.type,
        rentalStartDate: item.rentalStartDate,
        rentalEndDate: item.rentalEndDate,
        color: item.color,
        size: item.size,
        fulfillmentId: item.fulfillmentId,
        sellerName: item.sellerName,
      })),
      subtotal: response.subtotal,
      shipping: response.shippingAmount,
      tax: response.taxAmount,
      discount: response.discountAmount,
      total: response.totalAmount,
      shippingAddress: address ? [address.line1, address.line2, `${address.city}, ${address.state} ${address.postalCode}`, address.country].filter(Boolean).join(', ') : 'Not provided',
      paymentSummary: response.paymentProvider ?? 'Not provided',
      paymentStatus: response.paymentStatus,
      currency: response.currency,
      canConfirmReceipt: response.canConfirmReceipt,
      canReportNotReceived: response.canReportNotReceived,
      fulfillments: response.fulfillments ?? [],
      deliveryReports: response.deliveryReports ?? [],
    };
  }
}
