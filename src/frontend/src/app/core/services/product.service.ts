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

const REVIEW_AUTHORS = [
  'Sarah Kim', 'James Okafor', 'Lena Fischer', 'Marcus Webb', 'Priya Nair',
  'Diego Ramos', 'Amelia Hart', 'Tom Novak', 'Yuki Tanaka', 'Omar Haddad',
];

const REVIEW_TITLES = [
  'Exceeded my expectations', 'Great value for the price', 'Exactly as described',
  'Would absolutely buy again', 'Solid quality, minor quirks', 'My new daily driver',
  'Impressive build quality', 'Good, with a few caveats',
];

const REVIEW_COMMENTS = [
  'I did a lot of research before buying and this was the right call. The build quality feels far above the price point and it arrived a day early, beautifully packaged.',
  'Three months in and it still performs like day one. Customer support was quick to answer a sizing question before I ordered. Highly recommended.',
  'Bought this as a gift and ended up ordering a second one for myself. The attention to detail is what stands out — nothing about it feels cheap.',
  'Honestly better than options costing twice as much. Shipping was fast and the product matched the photos exactly. No complaints so far.',
  'Really solid overall. It lost one star because the color is slightly darker than the listing photos, but performance-wise it is flawless.',
  'This replaced a much more expensive brand-name version for me and I have not looked back. Comfortable, well made, and looks fantastic in person.',
  'Works exactly as advertised. Setup took under five minutes and the quality is obvious the moment you pick it up. Very happy with this purchase.',
  'Decent product for the price. It does everything it promises, though I wish the instructions were a bit clearer. Would still recommend it.',
];

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

  getBrands(): string[] {
    return BRANDS; // Still mocked for now
  }

  getAll(): Observable<Product[]> {
    return this.query({ page: 1, pageSize: 100 } as CatalogQuery).pipe(map(res => res.items));
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
        throw err; // Re-throw so components can handle 404
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

  // Client-side mocks for reviews and ratings to keep UI looking nice
  getReviews(product: Product, count = 6): Review[] {
    const reviews: Review[] = [];
    const n = Math.min(count, product.reviewCount || 6);
    for (let i = 0; i < n; i++) {
      const seed = (Number(product.id) || 1) * 31 + i * 17;
      const author = REVIEW_AUTHORS[seed % REVIEW_AUTHORS.length];
      const rating = this.seededRating(product.rating || 5, seed);
      const daysAgo = 3 + ((seed * 7) % 340);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      reviews.push({
        id: seed,
        author,
        initials: author.split(' ').map(w => w[0]).join(''),
        rating,
        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: REVIEW_TITLES[seed % REVIEW_TITLES.length],
        comment: REVIEW_COMMENTS[seed % REVIEW_COMMENTS.length],
        verified: seed % 4 !== 0,
        helpful: (seed * 3) % 48,
      });
    }
    return reviews;
  }

  getRatingBuckets(product: Product): RatingBucket[] {
    const total = product.reviewCount || 6;
    const r = product.rating || 5;
    const weights = [5, 4, 3, 2, 1].map(stars => Math.max(0.02, 1 - Math.abs(r - stars) * 0.55));
    const sum = weights.reduce((a, b) => a + b, 0);
    let assigned = 0;
    const buckets = [5, 4, 3, 2, 1].map((stars, i) => {
      const count = i === 4 ? total - assigned : Math.round((weights[i] / sum) * total);
      assigned += count;
      return { stars, count: Math.max(0, count), percent: 0 };
    });
    for (const b of buckets) {
      b.percent = total ? Math.round((b.count / total) * 100) : 0;
    }
    return buckets;
  }

  private seededRating(avg: number, seed: number): number {
    const roll = (seed * 2654435761) % 100;
    if (roll < 62) return 5;
    if (roll < 84) return 4;
    if (roll < 93) return 3;
    return avg >= 4.5 ? 4 : 2;
  }
}
