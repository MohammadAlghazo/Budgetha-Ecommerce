import { Injectable, signal } from '@angular/core';
import { Product } from '../models/shop.models';

@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly _product = signal<Product | null>(null);
  readonly product = this._product.asReadonly();

  open(product: Product): void {
    this._product.set(product);
  }

  close(): void {
    this._product.set(null);
  }
}
