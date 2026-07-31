import { Injectable, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address, PaymentCard } from '../models/shop.models';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

const ADDRESS_KEY = 'budgetha_addresses_v2';
const CARDS_KEY = 'budgetha_cards_v2';

const SEED_ADDRESSES: Address[] = [];
const SEED_CARDS: PaymentCard[] = [];

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/addresses`;
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly _addresses = signal<Address[]>(this.load(ADDRESS_KEY, SEED_ADDRESSES));
  private readonly _cards = signal<PaymentCard[]>(this.load(CARDS_KEY, SEED_CARDS));
  private readonly _addressesLoading = signal(false);
  private readonly _addressesError = signal(false);

  readonly addresses = this._addresses.asReadonly();
  readonly cards = this._cards.asReadonly();
  readonly addressesLoading = this._addressesLoading.asReadonly();
  readonly addressesError = this._addressesError.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(this._addresses()));
      localStorage.setItem(CARDS_KEY, JSON.stringify(this._cards()));
    });

    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.syncAddresses();
      }
    }, { allowSignalWrites: true });
  }

  syncAddresses(): void {
    this._addressesLoading.set(true);
    this._addressesError.set(false);
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (addrs) => {
        if (addrs) {
          const mapped: Address[] = addrs.map(a => ({
            id: a.id,
            label: a.isDefault ? 'Default' : 'Address',
            fullName: a.fullName,
            line1: a.line1,
            line2: a.line2,
            city: a.city,
            state: a.state,
            zip: a.postalCode,
            country: a.country,
            phone: a.phone,
            isDefault: a.isDefault
          }));
          this._addresses.set(mapped);
        }
        this._addressesLoading.set(false);
      },
      error: () => {
        this._addressesLoading.set(false);
        this._addressesError.set(true);
      }
    });
  }

  createCheckoutAddress(address: Omit<Address, 'id' | 'label'>): Observable<string> {
    return this.http.post<string>(this.apiUrl, {
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.zip,
      country: address.country,
      isDefault: address.isDefault
    }).pipe(tap(() => this.syncAddresses()));
  }

  defaultAddress(): Address | undefined {
    return this._addresses().find(a => a.isDefault) ?? this._addresses()[0];
  }

  saveAddress(address: Omit<Address, 'id'> & { id?: number | string }): void {
    if (this.auth.isAuthenticated()) {
      if (address.id && typeof address.id === 'string') {
        this.http.put(`${this.apiUrl}/${address.id}`, {
          id: address.id,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.zip,
          country: address.country,
          isDefault: address.isDefault
        }).subscribe(() => this.syncAddresses());
      } else {
        this.http.post(this.apiUrl, {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.zip,
          country: address.country,
          isDefault: address.isDefault
        }).subscribe(() => this.syncAddresses());
      }
    } else {
      this._addresses.update(list => {
        let next = list.slice();
        if (address.isDefault) {
          next = next.map(a => ({ ...a, isDefault: false }));
        }
        if (address.id) {
          return next.map(a => (a.id === address.id ? ({ ...address, id: address.id } as Address) : a));
        }
        const numericId = Math.max(0, ...next.map(a => typeof a.id === 'number' ? a.id : 0)) + 1;
        return [...next, { ...address, id: numericId } as Address];
      });
    }
  }

  deleteAddress(id: number | string): void {
    if (this.auth.isAuthenticated() && typeof id === 'string') {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.syncAddresses());
    } else {
      this._addresses.update(list => {
        const next = list.filter(a => a.id !== id);
        if (next.length && !next.some(a => a.isDefault)) {
          next[0] = { ...next[0], isDefault: true };
        }
        return next;
      });
    }
  }

  setDefaultAddress(id: number | string): void {
    if (this.auth.isAuthenticated() && typeof id === 'string') {
      const address = this._addresses().find(a => a.id === id);
      if (address) {
        this.http.put(`${this.apiUrl}/${id}`, {
          id: address.id,
          fullName: address.fullName,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.zip,
          country: address.country,
          isDefault: true
        }).subscribe(() => this.syncAddresses());
      }
    } else {
      this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id })));
    }
  }

  defaultCard(): PaymentCard | undefined {
    return this._cards().find(c => c.isDefault) ?? this._cards()[0];
  }

  saveCard(card: Omit<PaymentCard, 'id'> & { id?: number }): void {
    this._cards.update(list => {
      let next = list.slice();
      if (card.isDefault) {
        next = next.map(c => ({ ...c, isDefault: false }));
      }
      if (card.id) {
        return next.map(c => (c.id === card.id ? ({ ...card, id: card.id } as PaymentCard) : c));
      }
      const id = Math.max(0, ...next.map(c => c.id)) + 1;
      return [...next, { ...card, id } as PaymentCard];
    });
  }

  deleteCard(id: number): void {
    this._cards.update(list => {
      const next = list.filter(c => c.id !== id);
      if (next.length && !next.some(c => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }

  setDefaultCard(id: number): void {
    this._cards.update(list => list.map(c => ({ ...c, isDefault: c.id === id })));
  }

  private load<T>(key: string, seed: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : seed;
    } catch {
      return seed;
    }
  }
}
