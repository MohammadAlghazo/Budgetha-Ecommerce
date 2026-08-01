import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay, finalize } from 'rxjs';
import {
  CatalogQuery,
  CatalogResult,
  Category,
  Product,
  RatingBucket,
  Review,
  SellerProfile,
} from '../models/shop.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private categoriesCache$?: Observable<Category[]>;
  private brandsCache$?: Observable<string[]>;
  private allProductsCache$?: Observable<Product[]>;
  private priceBoundsCache$?: Observable<{ min: number; max: number }>;
  private readonly queryRequests = new Map<string, Observable<CatalogResult>>();
  private readonly productRequests = new Map<string, Observable<Product>>();
  private readonly cacheTtlMs = 5 * 60 * 1000;

  getCategories(): Observable<Category[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
        catchError(err => {
          console.error('Failed to fetch categories', err);
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.categoriesCache$;
  }

  createCategory(category: { name: string, slug: string, description?: string, imageUrl?: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, category: { id: string, name: string, slug: string, imageUrl?: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/categories/${id}`, category);
  }

  getBrands(): Observable<string[]> {
    if (!this.brandsCache$) {
      this.brandsCache$ = this.http.get<string[]>(`${this.apiUrl}/products/brands`).pipe(
        catchError(err => {
          console.error('Failed to fetch brands', err);
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.brandsCache$;
  }

  getAll(): Observable<Product[]> {
    if (!this.allProductsCache$) {
      this.allProductsCache$ = this.query({ page: 1, pageSize: 100, minPrice: 0, maxPrice: 1000000, minRating: 0 } as CatalogQuery).pipe(
        map(res => res?.items || []),
        shareReplay(1)
      );
    }
    return this.allProductsCache$;
  }

  getFeatured(): Observable<Product[]> {
    return this.getAll().pipe(
      map(items => items.filter(p => p.isFeatured || (p.originalPrice && p.originalPrice > p.price) || p.rating >= 4))
    );
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isNew)));
  }

  getBySlug(slug: string): Observable<Product> {
    const key = slug.trim().toLowerCase();
    const existing = this.productRequests.get(key);
    if (existing) return existing;

    const request$ = this.http.get<Product>(`${this.apiUrl}/products/${encodeURIComponent(slug)}`).pipe(
      map(product => {
        this.writeCache(`product:${key}`, product);
        return product;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
      finalize(() => this.productRequests.delete(key))
    );
    this.productRequests.set(key, request$);
    return request$;
  }

  getCachedProduct(slug: string): Product | undefined {
    return this.readCache<Product>(`product:${slug.trim().toLowerCase()}`) ?? undefined;
  }

  getSellerProfile(id: string): Observable<SellerProfile> {
    return this.http.get<SellerProfile>(`${this.apiUrl}/sellers/${encodeURIComponent(id)}`);
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

  priceBounds(categoryId?: string, searchTerm?: string): Observable<{ min: number; max: number }> {
    let qs = new URLSearchParams();
    if (categoryId) qs.set('categoryId', categoryId);
    if (searchTerm) qs.set('searchTerm', searchTerm);
    
    const cacheKey = `price-bounds:${categoryId ?? ''}:${searchTerm ?? ''}`;
    if (!categoryId && !searchTerm && this.priceBoundsCache$) return this.priceBoundsCache$;

    const request$ = this.http.get<{minPrice: number, maxPrice: number}>(`${this.apiUrl}/products/price-bounds?${qs.toString()}`).pipe(
      map(res => ({ min: Math.floor(res.minPrice), max: Math.ceil(res.maxPrice) })),
      catchError(err => {
        console.error('Failed to fetch price bounds', err);
        return of({ min: 0, max: 10000 });
      })
    );
    if (!categoryId && !searchTerm) this.priceBoundsCache$ = request$.pipe(shareReplay({ bufferSize: 1, refCount: false }));
    return this.priceBoundsCache$ ?? request$;
  }

  query(q: CatalogQuery): Observable<CatalogResult> {
    const cacheKey = this.queryCacheKey(q);
    const existing = this.queryRequests.get(cacheKey);
    if (existing) return existing;
    let params: any = {
      page: q.page,
      pageSize: q.pageSize
    };
    if (q.search) params.search = q.search;
    if (q.minPrice) params.minPrice = q.minPrice;
    if (q.maxPrice) params.maxPrice = q.maxPrice;
    if (q.minRating) params.minRating = q.minRating;
    if (q.sort) params.sort = q.sort;
    if (q.sellerId) params.sellerId = q.sellerId;

    let qs = new URLSearchParams(params).toString();
    if (q.categories && q.categories.length) {
      q.categories.forEach(c => qs += `&categories=${encodeURIComponent(c)}`);
    }
    if (q.brands && q.brands.length) {
      q.brands.forEach(b => qs += `&brands=${encodeURIComponent(b)}`);
    }

    const request$ = this.http.get<CatalogResult>(`${this.apiUrl}/products?${qs}`).pipe(
      map(result => result ?? { items: [], total: 0, totalPages: 1 }),
      map(result => {
        this.writeCache(`catalog:${cacheKey}`, result);
        return result;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
      finalize(() => this.queryRequests.delete(cacheKey))
    );
    this.queryRequests.set(cacheKey, request$);
    return request$;
  }

  getCachedQuery(q: CatalogQuery): CatalogResult | undefined {
    return this.readCache<CatalogResult>(`catalog:${this.queryCacheKey(q)}`) ?? undefined;
  }

  private queryCacheKey(q: CatalogQuery): string {
    return JSON.stringify({
      page: q.page,
      pageSize: q.pageSize,
      search: q.search ?? '',
      categories: [...(q.categories ?? [])].sort(),
      brands: [...(q.brands ?? [])].sort(),
      minPrice: q.minPrice ?? 0,
      maxPrice: q.maxPrice ?? 0,
      minRating: q.minRating ?? 0,
      sort: q.sort ?? '',
      sellerId: q.sellerId ?? ''
    });
  }

  private readCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`budgetha:${key}`);
      if (!raw) return null;
      const entry = JSON.parse(raw) as { expiresAt: number; value: T };
      if (!entry || entry.expiresAt <= Date.now()) {
        localStorage.removeItem(`budgetha:${key}`);
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  }

  private writeCache<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`budgetha:${key}`, JSON.stringify({ expiresAt: Date.now() + this.cacheTtlMs, value }));
    } catch {
      // Storage can be unavailable or full; the in-memory request still succeeds.
    }
  }
}
