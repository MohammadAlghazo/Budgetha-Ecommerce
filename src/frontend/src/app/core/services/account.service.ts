import { Injectable, effect, signal } from '@angular/core';
import { Address, PaymentCard } from '../models/shop.models';

const ADDRESS_KEY = 'budgetha_addresses_v2';
const CARDS_KEY = 'budgetha_cards_v2';

const SEED_ADDRESSES: Address[] = [];

const SEED_CARDS: PaymentCard[] = [];

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly _addresses = signal<Address[]>(this.load(ADDRESS_KEY, SEED_ADDRESSES));
  private readonly _cards = signal<PaymentCard[]>(this.load(CARDS_KEY, SEED_CARDS));

  readonly addresses = this._addresses.asReadonly();
  readonly cards = this._cards.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(this._addresses()));
      localStorage.setItem(CARDS_KEY, JSON.stringify(this._cards()));
    });
  }

  defaultAddress(): Address | undefined {
    return this._addresses().find(a => a.isDefault) ?? this._addresses()[0];
  }

  saveAddress(address: Omit<Address, 'id'> & { id?: number }): void {
    this._addresses.update(list => {
      let next = list.slice();
      if (address.isDefault) {
        next = next.map(a => ({ ...a, isDefault: false }));
      }
      if (address.id) {
        return next.map(a => (a.id === address.id ? ({ ...address, id: address.id } as Address) : a));
      }
      const id = Math.max(0, ...next.map(a => a.id)) + 1;
      return [...next, { ...address, id } as Address];
    });
  }

  deleteAddress(id: number): void {
    this._addresses.update(list => {
      const next = list.filter(a => a.id !== id);
      if (next.length && !next.some(a => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }

  setDefaultAddress(id: number): void {
    this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id })));
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
