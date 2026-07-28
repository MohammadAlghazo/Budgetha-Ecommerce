import { Injectable } from '@angular/core';
import { BRANDS, CATEGORIES, PRODUCTS } from '../data/mock-products';
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
  getCategories(): Category[] {
    return CATEGORIES;
  }

  getBrands(): string[] {
    return BRANDS;
  }

  getAll(): Product[] {
    return PRODUCTS;
  }

  getFeatured(): Product[] {
    return PRODUCTS.filter(p => p.isFeatured);
  }

  getNewArrivals(): Product[] {
    return PRODUCTS.filter(p => p.isNew);
  }

  getBySlug(slug: string): Product | undefined {
    return PRODUCTS.find(p => p.slug === slug);
  }

  getById(id: number): Product | undefined {
    return PRODUCTS.find(p => p.id === id);
  }

  getRelated(product: Product, count = 4): Product[] {
    const sameCategory = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category);
    const others = PRODUCTS.filter(p => p.id !== product.id && p.category !== product.category);
    return [...sameCategory, ...others].slice(0, count);
  }

  priceBounds(): { min: number; max: number } {
    const prices = PRODUCTS.map(p => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }

  query(q: CatalogQuery): CatalogResult {
    let items = PRODUCTS.slice();

    if (q.search.trim()) {
      const term = q.search.trim().toLowerCase();
      items = items.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term)
      );
    }
    if (q.categories.length) {
      items = items.filter(p => q.categories.includes(p.category));
    }
    if (q.brands.length) {
      items = items.filter(p => q.brands.includes(p.brand));
    }
    items = items.filter(p => p.price >= q.minPrice && p.price <= q.maxPrice);
    if (q.minRating > 0) {
      items = items.filter(p => p.rating >= q.minRating);
    }

    switch (q.sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        items.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id - a.id);
        break;
      default:
        items.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || b.reviewCount - a.reviewCount);
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / q.pageSize));
    const page = Math.min(q.page, totalPages);
    const start = (page - 1) * q.pageSize;
    return { items: items.slice(start, start + q.pageSize), total, totalPages };
  }

  /** Deterministic pseudo-random reviews so each product always shows the same set. */
  getReviews(product: Product, count = 6): Review[] {
    const reviews: Review[] = [];
    const n = Math.min(count, product.reviewCount);
    for (let i = 0; i < n; i++) {
      const seed = product.id * 31 + i * 17;
      const author = REVIEW_AUTHORS[seed % REVIEW_AUTHORS.length];
      const rating = this.seededRating(product.rating, seed);
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

  /** Star distribution consistent with the product's average rating. */
  getRatingBuckets(product: Product): RatingBucket[] {
    const total = product.reviewCount;
    const r = product.rating;
    // Weight buckets around the average rating.
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
