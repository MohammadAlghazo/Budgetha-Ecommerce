import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BRANDS } from '../mocks/mock-products';
import {
  CatalogQuery,
  CatalogResult,
  Category,
  Product,
  RatingBucket,
  Review,
} from '../models/shop.models';



@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5272/api';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(err => {
        console.error('Failed to fetch categories', err);
        return of([]);
      })
    );
  }

  createCategory(category: { name: string, slug: string, description?: string, imageUrl?: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/categories`, category);
  }

  getBrands(): string[] {
    return BRANDS; 
  }

  getAll(): Observable<Product[]> {
    return this.query({ page: 1, pageSize: 100 } as CatalogQuery).pipe(map(res => res?.items || []));
  }

  getFeatured(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isFeatured)));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isNew)));
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}`).pipe(
      catchError(err => {
        console.error(`Failed to fetch product ${slug}`, err);
        throw err; 
      })
    );
  }

  getRelated(product: Product, count = 4): Observable<Product[]> {
    return this.getAll().pipe(
      map(items => {
        const sameCategory = items.filter(p => p.id !== product.id && p.category === product.category);
        const others = items.filter(p => p.id !== product.id && p.category !== product.category);
        return [...sameCategory, ...others].slice(0, count);
      })
    );
  }

  priceBounds(): Observable<{ min: number; max: number }> {
    return this.getAll().pipe(
      map(items => {
        if (!items || items.length === 0) {
          return { min: 0, max: 1000 };
        }
        const prices = items.map(p => p.price);
        return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
      })
    );
  }

  query(q: CatalogQuery): Observable<CatalogResult> {
    let params: any = {
      page: q.page,
      pageSize: q.pageSize
    };
    if (q.search) params.search = q.search;
    if (q.minPrice) params.minPrice = q.minPrice;
    if (q.maxPrice) params.maxPrice = q.maxPrice;
    if (q.minRating) params.minRating = q.minRating;
    if (q.sort) params.sort = q.sort;

    let qs = new URLSearchParams(params).toString();
    if (q.categories && q.categories.length) {
      q.categories.forEach(c => qs += `&categories=${encodeURIComponent(c)}`);
    }
    if (q.brands && q.brands.length) {
      q.brands.forEach(b => qs += `&brands=${encodeURIComponent(b)}`);
    }

    return this.http.get<CatalogResult>(`${this.apiUrl}/products?${qs}`).pipe(
      catchError(err => {
        console.error('Failed to query products', err);
        return of({ items: [], total: 0, totalPages: 1 } as CatalogResult);
      })
    );
  }


}
