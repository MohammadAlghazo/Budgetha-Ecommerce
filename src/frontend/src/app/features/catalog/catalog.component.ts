import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product, SortOption } from '../../core/models/shop.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-catalog',
  imports: [CurrencyPipe, NgTemplateOutlet, ProductCardComponent, EmptyStateComponent, StarRatingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
      <!-- Breadcrumb + heading -->
      <nav class="text-xs text-slate-400 flex items-center gap-1.5" aria-label="Breadcrumb">
        <a (click)="router.navigate(['/'])" class="hover:text-violet-600 cursor-pointer transition-colors duration-300">Home</a>
        <span>/</span>
        <span class="text-slate-600 font-medium">Shop</span>
      </nav>
      <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {{ pageTitle() }}
          </h1>
          <p class="mt-1 text-sm text-slate-500">{{ result().total }} {{ result().total === 1 ? 'product' : 'products' }} found</p>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-3">
          <!-- Mobile filter toggle -->
          <button
            type="button"
            (click)="filtersOpen.set(true)"
            class="lg:hidden btn-secondary px-4 py-2.5 text-sm gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filters
            @if (activeFilterCount() > 0) {
              <span class="badge bg-violet-600 text-white">{{ activeFilterCount() }}</span>
            }
          </button>

          <!-- Sort -->
          <div class="relative">
            <select
              [value]="sort()"
              (change)="setSort($event)"
              aria-label="Sort products"
              class="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer
                     transition-all duration-300">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <!-- View toggle -->
          <div class="hidden sm:inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              (click)="view.set('grid')"
              aria-label="Grid view"
              [attr.aria-pressed]="view() === 'grid'"
              class="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
              [class]="view() === 'grid' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="view.set('list')"
              aria-label="List view"
              [attr.aria-pressed]="view() === 'list'"
              class="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
              [class]="view() === 'list' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex gap-8">
        <!-- ══ Sidebar filters (desktop) ══ -->
        <aside class="hidden lg:block w-64 shrink-0 space-y-6">
          <ng-container *ngTemplateOutlet="filterPanel"></ng-container>
        </aside>

        <!-- ══ Mobile filter drawer ══ -->
        @if (filtersOpen()) {
          <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" (click)="filtersOpen.set(false)" aria-hidden="true"></div>
          <aside class="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto p-5 lg:hidden animate-[slideInLeft_0.3s_ease-out]"
                 role="dialog" aria-modal="true" aria-label="Filters">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-slate-900">Filters</h2>
              <button type="button" (click)="filtersOpen.set(false)" aria-label="Close filters" class="icon-btn h-9 w-9 bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="space-y-6">
              <ng-container *ngTemplateOutlet="filterPanel"></ng-container>
            </div>
          </aside>
        }

        <!-- ══ Filter panel template (shared desktop/mobile) ══ -->
        <ng-template #filterPanel>
          <!-- Active filters / clear -->
          @if (activeFilterCount() > 0) {
            <div class="card p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-900">{{ activeFilterCount() }} active {{ activeFilterCount() === 1 ? 'filter' : 'filters' }}</span>
                <button type="button" (click)="clearFilters()" class="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                  Clear all
                </button>
              </div>
            </div>
          }

          <!-- Categories -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
            <div class="space-y-2.5">
              @for (category of categories; track category.id) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    [checked]="selectedCategories().includes(category.slug)"
                    (change)="toggleCategory(category.slug)"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 transition-colors duration-200" />
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors duration-200 flex-1">{{ category.name }}</span>
                  <span class="text-xs text-slate-400">{{ category.productCount }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Price range -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
            <div class="relative h-6 mt-1">
              <div class="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-slate-100"></div>
              <div
                class="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-violet-500"
                [style.left.%]="minPercent()"
                [style.width.%]="maxPercent() - minPercent()"></div>
              <input
                type="range"
                class="range-slider top-1/2 -translate-y-1/2 z-10"
                [min]="bounds.min" [max]="bounds.max" [step]="5"
                [value]="minPrice()"
                (input)="setMinPrice($event)"
                aria-label="Minimum price" />
              <input
                type="range"
                class="range-slider top-1/2 -translate-y-1/2 z-20"
                [min]="bounds.min" [max]="bounds.max" [step]="5"
                [value]="maxPrice()"
                (input)="setMaxPrice($event)"
                aria-label="Maximum price" />
            </div>
            <div class="mt-4 flex items-center justify-between gap-3">
              <div class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center">
                <span class="block text-[10px] uppercase tracking-wider text-slate-400">Min</span>
                <span class="text-sm font-bold text-slate-900">{{ minPrice() | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
              </div>
              <span class="text-slate-300">—</span>
              <div class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center">
                <span class="block text-[10px] uppercase tracking-wider text-slate-400">Max</span>
                <span class="text-sm font-bold text-slate-900">{{ maxPrice() | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
              </div>
            </div>
          </div>

          <!-- Brands -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Brands</h3>
            <div class="space-y-2.5">
              @for (brand of brands; track brand) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    [checked]="selectedBrands().includes(brand)"
                    (change)="toggleBrand(brand)"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 transition-colors duration-200" />
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors duration-200">{{ brand }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Rating -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Rating</h3>
            <div class="space-y-2">
              @for (threshold of [4, 3, 2]; track threshold) {
                <button
                  type="button"
                  (click)="minRating.set(minRating() === threshold ? 0 : threshold); page.set(1)"
                  class="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-200"
                  [class]="minRating() === threshold ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-slate-50'">
                  <app-star-rating [rating]="threshold" size="sm" />
                  <span class="text-sm text-slate-600">&amp; up</span>
                </button>
              }
            </div>
          </div>
        </ng-template>

        <!-- ══ Results ══ -->
        <div class="flex-1 min-w-0">
          @if (result().items.length === 0) {
            <div class="card">
              <app-empty-state
                icon="search"
                title="No products match your filters"
                message="Try widening the price range, removing a brand filter, or searching for something else."
                ctaLabel="Clear all filters"
                ctaLink="/shop" />
            </div>
          } @else {
            @if (view() === 'grid') {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (product of result().items; track product.id) {
                  <app-product-card [product]="product" layout="grid" />
                }
              </div>
            } @else {
              <div class="space-y-5">
                @for (product of result().items; track product.id) {
                  <app-product-card [product]="product" layout="list" />
                }
              </div>
            }

            <!-- Pagination -->
            @if (result().totalPages > 1) {
              <nav class="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  (click)="goToPage(page() - 1)"
                  [disabled]="page() === 1"
                  aria-label="Previous page"
                  class="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500
                         hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500
                         transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                @for (p of pages(); track p) {
                  <button
                    type="button"
                    (click)="goToPage(p)"
                    [attr.aria-current]="page() === p ? 'page' : null"
                    class="h-10 min-w-10 px-2 rounded-xl text-sm font-semibold flex items-center justify-center transition-all duration-300"
                    [class]="page() === p
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600'">
                    {{ p }}
                  </button>
                }

                <button
                  type="button"
                  (click)="goToPage(page() + 1)"
                  [disabled]="page() === result().totalPages"
                  aria-label="Next page"
                  class="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500
                         hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500
                         transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </nav>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  `,
})
export class CatalogComponent {
  private readonly productService = inject(ProductService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly categories = this.productService.getCategories();
  readonly brands = this.productService.getBrands();
  readonly bounds = this.productService.priceBounds();

  readonly search = signal('');
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedBrands = signal<string[]>([]);
  readonly minPrice = signal(this.bounds.min);
  readonly maxPrice = signal(this.bounds.max);
  readonly minRating = signal(0);
  readonly sort = signal<SortOption>('featured');
  readonly page = signal(1);
  readonly view = signal<'grid' | 'list'>('grid');
  readonly filtersOpen = signal(false);
  readonly dealsOnly = signal(false);
  readonly wishlistOnly = signal(false);

  readonly result = computed(() => {
    const base = this.productService.query({
      search: this.search(),
      categories: this.selectedCategories(),
      brands: this.selectedBrands(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      minRating: this.minRating(),
      sort: this.sort(),
      page: 1,
      pageSize: Number.MAX_SAFE_INTEGER,
    });

    let items: Product[] = base.items;
    if (this.dealsOnly()) {
      items = items.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    if (this.wishlistOnly()) {
      const ids = this.wishlist.ids();
      items = items.filter(p => ids.includes(p.id));
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(this.page(), totalPages);
    return { items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, totalPages };
  });

  readonly pages = computed(() => Array.from({ length: this.result().totalPages }, (_, i) => i + 1));

  readonly activeFilterCount = computed(
    () =>
      this.selectedCategories().length +
      this.selectedBrands().length +
      (this.minRating() > 0 ? 1 : 0) +
      (this.minPrice() > this.bounds.min || this.maxPrice() < this.bounds.max ? 1 : 0) +
      (this.dealsOnly() ? 1 : 0)
  );

  readonly pageTitle = computed(() => {
    if (this.wishlistOnly()) return 'My Wishlist';
    if (this.dealsOnly()) return 'Today’s Deals';
    if (this.search()) return `Results for “${this.search()}”`;
    if (this.selectedCategories().length === 1) {
      return this.categories.find(c => c.slug === this.selectedCategories()[0])?.name ?? 'Shop';
    }
    return 'All Products';
  });

  readonly minPercent = computed(
    () => ((this.minPrice() - this.bounds.min) / (this.bounds.max - this.bounds.min)) * 100
  );
  readonly maxPercent = computed(
    () => ((this.maxPrice() - this.bounds.min) / (this.bounds.max - this.bounds.min)) * 100
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.search.set(params.get('search') ?? '');
      const category = params.get('category');
      this.selectedCategories.set(category ? [category] : []);
      const brand = params.get('brand');
      this.selectedBrands.set(brand ? [brand] : []);
      this.dealsOnly.set(params.get('deals') === '1');
      this.wishlistOnly.set(params.get('wishlist') === '1');
      const sort = params.get('sort') as SortOption | null;
      if (sort && ['featured', 'newest', 'price-asc', 'price-desc', 'rating'].includes(sort)) {
        this.sort.set(sort);
      }
      this.page.set(1);
    });
  }

  toggleCategory(slug: string): void {
    this.selectedCategories.update(list =>
      list.includes(slug) ? list.filter(s => s !== slug) : [...list, slug]
    );
    this.page.set(1);
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.update(list =>
      list.includes(brand) ? list.filter(b => b !== brand) : [...list, brand]
    );
    this.page.set(1);
  }

  setMinPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.minPrice.set(Math.min(value, this.maxPrice() - 5));
    this.page.set(1);
  }

  setMaxPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.maxPrice.set(Math.max(value, this.minPrice() + 5));
    this.page.set(1);
  }

  setSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortOption);
    this.page.set(1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.result().totalPages) return;
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.minPrice.set(this.bounds.min);
    this.maxPrice.set(this.bounds.max);
    this.minRating.set(0);
    this.dealsOnly.set(false);
    this.page.set(1);
    this.router.navigate(['/shop']);
  }
}
