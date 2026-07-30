import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/shop.models';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

type Tab = 'description' | 'specs' | 'reviews';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent, ProductCardComponent, EmptyStateComponent],
  template: `
    @if (product(); as p) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <!-- Breadcrumb -->
        <nav class="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
          <span>/</span>
          <a routerLink="/shop" class="hover:text-violet-600 transition-colors duration-300">Shop</a>
          <span>/</span>
          <a routerLink="/shop" [queryParams]="{ category: p.category }" class="hover:text-violet-600 transition-colors duration-300 capitalize">{{ categoryName() }}</a>
          <span>/</span>
          <span class="text-slate-600 font-medium truncate max-w-[16rem]">{{ p.name }}</span>
        </nav>

        <!-- ══ Main section ══ -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <!-- Gallery -->
          <div>
            <div class="card overflow-hidden aspect-square">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-cover transition-opacity duration-300" />
            </div>
            <div class="mt-4 grid grid-cols-4 gap-3">
              @for (image of p.images; track image; let i = $index) {
                <button
                  type="button"
                  (click)="activeIndex.set(i)"
                  [attr.aria-label]="'View image ' + (i + 1)"
                  class="aspect-square rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-300"
                  [class]="activeIndex() === i ? 'ring-violet-600' : 'ring-transparent hover:ring-slate-300'">
                  <img [src]="image" [alt]="p.name + ' thumbnail ' + (i + 1)" class="h-full w-full object-cover" />
                </button>
              }
            </div>
          </div>

          <!-- Buy panel -->
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              @if (p.isNew) {
                <span class="badge bg-violet-100 text-violet-700">New</span>
              }
              @if (discountPercent() > 0) {
                <span class="badge bg-rose-100 text-rose-600">Save {{ discountPercent() }}%</span>
              }
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{{ p.name }}</h1>

            <button type="button" (click)="activeTab.set('reviews'); scrollToTabs()" class="mt-3 flex items-center gap-2 w-fit group">
              <app-star-rating [rating]="p.rating" size="md" />
              <span class="text-sm font-semibold text-slate-700">{{ p.rating }}</span>
              <span class="text-sm text-slate-400 group-hover:text-violet-600 underline-offset-2 group-hover:underline transition-colors duration-300">
                {{ p.reviewCount }} reviews
              </span>
            </button>

            <div class="mt-5 flex items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-extrabold text-slate-900">{{ p.price | currency }}</span>
              @if (p.originalPrice) {
                <span class="text-lg text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
              }
            </div>

            <p class="mt-4 text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

            <!-- Stock indicator -->
            <div class="mt-4">
              @if (p.stock === 0) {
                <span class="badge bg-slate-100 text-slate-600">Out of stock</span>
              } @else if (p.stock <= 15) {
                <span class="badge bg-amber-100 text-amber-700 animate-pulse">Only {{ p.stock }} left in stock</span>
              } @else {
                <span class="badge bg-emerald-100 text-emerald-700">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  In stock, ready to ship
                </span>
              }
            </div>

            <!-- Color swatches -->
            @if (p.colors?.length) {
              <div class="mt-6">
                <span class="text-sm font-semibold text-slate-900">
                  Color: <span class="font-normal text-slate-500">{{ selectedColor() }}</span>
                </span>
                <div class="mt-3 flex gap-3">
                  @for (color of (p.colors || []); track color.name) {
                    <button
                      type="button"
                      (click)="selectedColor.set(color.name)"
                      [attr.aria-label]="'Select color ' + color.name"
                      [attr.aria-pressed]="selectedColor() === color.name"
                      class="h-10 w-10 rounded-full ring-2 ring-offset-2 transition-all duration-300 border border-slate-200"
                      [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                      [style.background-color]="color.hex"></button>
                  }
                </div>
              </div>
            }

            <!-- Size pills -->
            @if (p.sizes?.length) {
              <div class="mt-6">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-900">Size: <span class="font-normal text-slate-500">{{ selectedSize() || 'Select a size' }}</span></span>
                  <button type="button" class="text-xs font-medium text-violet-600 hover:text-violet-500 underline underline-offset-2 transition-colors duration-300">Size guide</button>
                </div>
                <div class="mt-3 flex flex-wrap gap-2.5">
                  @for (size of (p.sizes || []); track size) {
                    <button
                      type="button"
                      (click)="selectedSize.set(size)"
                      [attr.aria-pressed]="selectedSize() === size"
                      class="min-w-[3rem] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300"
                      [class]="selectedSize() === size
                        ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'">
                      {{ size }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Quantity + CTAs -->
            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
                <button type="button" (click)="decrement()" [disabled]="quantity() <= 1" aria-label="Decrease quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                </button>
                <span class="w-12 text-center text-base font-bold text-slate-900" aria-live="polite">{{ quantity() }}</span>
                <button type="button" (click)="increment()" [disabled]="quantity() >= p.stock" aria-label="Increase quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <button type="button" (click)="addToCart()" [disabled]="p.stock === 0" class="btn-primary flex-1 py-3.5 text-base gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {{ p.stock === 0 ? 'Out of stock' : 'Add to Cart — ' + (p.price * quantity() | currency) }}
              </button>

              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="h-[3.25rem] w-[3.25rem] rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0"
                [class]="inWishlist()
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200'">
                <svg class="w-6 h-6" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <!-- Trust rows -->
            <div class="mt-8 card divide-y divide-slate-100">
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free delivery</span> on orders over $75 · arrives in 2–4 business days</p>
              </div>
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free 30-day returns</span> — no questions asked</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ Tabs ══ -->
        <div class="mt-14" id="product-tabs">
          <div class="border-b border-slate-200 flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Product information">
            @for (tab of tabs; track tab.key) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === tab.key"
                (click)="activeTab.set(tab.key)"
                class="relative px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300"
                [class]="activeTab() === tab.key ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'">
                {{ tab.label }}
                @if (tab.key === 'reviews') {
                  <span class="ml-1.5 badge bg-slate-100 text-slate-500">{{ p.reviewCount }}</span>
                }
                @if (activeTab() === tab.key) {
                  <span class="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-violet-600"></span>
                }
              </button>
            }
          </div>

          <div class="py-8">
            @switch (activeTab()) {
              <!-- Description -->
              @case ('description') {
                <div class="grid lg:grid-cols-5 gap-10">
                  <div class="lg:col-span-3">
                    <h2 class="text-lg font-bold text-slate-900 mb-4">About this product</h2>
                    <p class="text-slate-600 leading-relaxed">{{ p.description }}</p>
                  </div>
                  <div class="lg:col-span-2">
                    <h3 class="text-lg font-bold text-slate-900 mb-4">Highlights</h3>
                    <ul class="space-y-3">
                      @for (feature of (p.features || []); track feature) {
                        <li class="flex items-start gap-3">
                          <span class="mt-0.5 h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                            <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                          <span class="text-sm text-slate-600 leading-relaxed">{{ feature }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <!-- Specifications -->
              @case ('specs') {
                <div class="card overflow-hidden max-w-3xl">
                  <table class="w-full text-sm">
                    <tbody>
                      @for (spec of (p.specs || []); track spec.label; let even = $even) {
                        <tr [class]="even ? 'bg-slate-50/70' : 'bg-white'">
                          <th scope="row" class="text-left font-semibold text-slate-700 px-6 py-3.5 w-1/3">{{ spec.label }}</th>
                          <td class="text-slate-600 px-6 py-3.5">{{ spec.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Reviews -->
              @case ('reviews') {
                @if (p.reviewCount === 0) {
                  <div class="card max-w-2xl mx-auto">
                    <app-empty-state
                      icon="reviews"
                      title="No reviews yet"
                      message="Be the first to share your experience with this product — your review helps other shoppers decide." />
                  </div>
                } @else {
                  <div class="grid lg:grid-cols-3 gap-10">
                    <!-- Ratings summary -->
                    <div class="lg:col-span-1">
                      <div class="card p-6 lg:sticky lg:top-24">
                        <div class="flex items-end gap-3">
                          <span class="text-5xl font-extrabold text-slate-900 leading-none">{{ p.rating }}</span>
                          <div class="pb-1">
                            <app-star-rating [rating]="p.rating" size="md" />
                            <p class="mt-1 text-xs text-slate-400">Based on {{ p.reviewCount }} reviews</p>
                          </div>
                        </div>

                        <!-- Star distribution -->
                        <div class="mt-6 space-y-2.5">
                          @for (bucket of ratingBuckets(); track bucket.stars) {
                            <div class="flex items-center gap-3">
                              <span class="text-xs font-medium text-slate-600 w-10 shrink-0">{{ bucket.stars }} star</span>
                              <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" [style.width.%]="bucket.percent"></div>
                              </div>
                              <span class="text-xs text-slate-400 w-9 text-right shrink-0">{{ bucket.percent }}%</span>
                            </div>
                          }
                        </div>

                        <button type="button" class="btn-primary w-full mt-6">Write a Review</button>
                      </div>
                    </div>

                    <!-- Review cards -->
                    <div class="lg:col-span-2 space-y-5">
                      @for (review of reviews(); track review.id) {
                        <article class="card p-6">
                          <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-3">
                              <span class="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                {{ review.initials }}
                              </span>
                              <div>
                                <p class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                  {{ review.author }}
                                  @if (review.verified) {
                                    <span class="badge bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                                      </svg>
                                      Verified purchase
                                    </span>
                                  }
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">{{ review.date }}</p>
                              </div>
                            </div>
                            <app-star-rating [rating]="review.rating" size="sm" />
                          </div>
                          <h3 class="mt-4 text-sm font-bold text-slate-900">{{ review.title }}</h3>
                          <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ review.comment }}</p>
                          <div class="mt-4 flex items-center gap-4">
                            <button type="button" class="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-violet-600 transition-colors duration-300">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                              </svg>
                              Helpful ({{ review.helpful }})
                            </button>
                            <button type="button" class="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors duration-300">Report</button>
                          </div>
                        </article>
                      }
                    </div>
                  </div>
                }
              }
            }
          </div>
        </div>

        <!-- ══ Related products ══ -->
        <section class="mt-10">
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-6">You might also like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (related of relatedProducts(); track related.id) {
              <app-product-card [product]="related" layout="grid" />
            }
          </div>
        </section>
      </div>
    } @else {
      <!-- Product not found -->
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="search"
            title="Product not found"
            message="The product you're looking for may have been removed or the link is incorrect."
            ctaLabel="Back to Shop"
            ctaLink="/shop" />
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly product = signal<Product | undefined>(undefined);
  readonly activeIndex = signal(0);
  readonly selectedColor = signal('');
  readonly selectedSize = signal('');
  readonly quantity = signal(1);
  readonly activeTab = signal<Tab>('description');
  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly relatedProducts = signal<Product[]>([]);

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: 'Customer Reviews' },
  ];

  readonly activeImage = computed(() => {
    const p = this.product();
    return p && p.images && p.images.length ? p.images[Math.min(this.activeIndex(), p.images.length - 1)] : '';
  });

  readonly inWishlist = computed(() => {
    const p = this.product();
    return !!p && this.wishlist.ids().includes(p.id);
  });

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p?.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  readonly categoryName = computed(() => {
    const p = this.product();
    const cats = this.categories();
    return p
      ? cats.find(c => c.slug === p.category)?.name ?? p.category
      : '';
  });

  readonly reviews = computed(() => {
    const p = this.product();
    return p ? this.productService.getReviews(p) : [];
  });

  readonly ratingBuckets = computed(() => {
    const p = this.product();
    return p ? this.productService.getRatingBuckets(p) : [];
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const slug = params.get('slug') ?? '';
      if (slug) {
        this.productService.getBySlug(slug).subscribe(product => {
          this.product.set(product);
          this.activeIndex.set(0);
          this.quantity.set(1);
          this.activeTab.set('description');
          this.selectedColor.set(product?.colors?.[0]?.name ?? '');
          this.selectedSize.set(product?.sizes?.[0] ?? '');
          window.scrollTo({ top: 0 });

          if (product) {
            this.productService.getRelated(product).subscribe(related => {
              this.relatedProducts.set(related);
            });
          } else {
             this.relatedProducts.set([]);
          }
        });
      }
    });
  }

  increment(): void {
    const stock = this.product()?.stock ?? 1;
    this.quantity.update(q => Math.min(q + 1, stock));
  }

  decrement(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p || p.stock === 0) return;
    this.cart.add(p, this.quantity(), this.selectedColor() || undefined, this.selectedSize() || undefined);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p.id, p.name);
  }

  scrollToTabs(): void {
    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
  }
}
