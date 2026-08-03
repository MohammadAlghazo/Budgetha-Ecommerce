import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent, SkeletonCardComponent],
  template: `
    <!-- ══ Hero ══ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800">
      <!-- Decorative blurs -->
      <div class="absolute top-0 start-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 end-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 end-10 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-start">
          <span class="badge bg-white/10 text-teal-200 ring-1 ring-white/20 backdrop-blur px-4 py-1.5">
            Summer Sale — up to 40% off
          </span>
          <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Shop smarter.<br />
            <span class="bg-gradient-to-r from-teal-300 to-teal-100 bg-clip-text text-transparent">Spend wiser.</span>
          </h1>
          <p class="mt-6 text-lg text-teal-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Discover hand-picked deals from 200+ trusted vendors. Premium quality, honest prices, delivered to your door.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a routerLink="/shop" class="btn-primary bg-teal-600 hover:bg-teal-500 px-8 py-4 text-base shadow-lg shadow-teal-950/40">
              Shop the Collection
              <svg class="w-4 h-4 ms-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a routerLink="/shop" [queryParams]="{ deals: 1 }"
               class="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white
                      ring-1 ring-white/30 hover:bg-white/10 transition-all duration-300">
              Browse Deals
            </a>
          </div>

          <!-- Trust stats -->
          <div class="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
            <div class="text-center lg:text-start">
              <div class="text-2xl font-bold text-white">50K+</div>
              <div class="text-xs text-teal-200/70 mt-1">Happy Shoppers</div>
            </div>
            <div class="text-center lg:text-start">
              <div class="text-2xl font-bold text-white">200+</div>
              <div class="text-xs text-teal-200/70 mt-1">Trusted Vendors</div>
            </div>
            <div class="text-center lg:text-start">
              <div class="text-2xl font-bold text-white">4.9★</div>
              <div class="text-xs text-teal-200/70 mt-1">Average Rating</div>
            </div>
          </div>
        </div>

        <!-- Hero product collage -->
        <div class="hidden lg:grid grid-cols-2 gap-5 relative">
          <div class="space-y-5 pt-10">
            <div class="card overflow-hidden rounded-3xl border-white/10 shadow-2xl shadow-teal-950/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" alt="Wireless headphones" class="aspect-[4/5] object-cover object-[75%_center] w-full" />
            </div>
            <div class="glass-card rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
              <div class="h-10 w-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Order delivered</p>
                <p class="text-xs text-teal-100/70">2,341 orders shipped today</p>
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <div class="glass-card rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
              <div class="h-10 w-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Rated 4.9/5</p>
                <p class="text-xs text-teal-100/70">from 12,000+ reviews</p>
              </div>
            </div>
            <div class="card overflow-hidden rounded-3xl border-white/10 shadow-2xl shadow-teal-950/50 rotate-[2deg] hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Running sneakers" class="aspect-[4/5] object-cover w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Value props ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
      <div class="card grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-lg shadow-slate-200/60">
        @for (prop of valueProps; track prop.title) {
          <div class="flex items-center gap-4 p-6">
            <div class="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="prop.icon" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">{{ prop.title }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ prop.text }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ══ Top categories ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          <p class="mt-1.5 text-sm text-slate-500">Browse our most popular departments</p>
        </div>
        <a routerLink="/shop" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        @for (category of categories() || []; track category.id) {
          <a
            [routerLink]="['/shop']"
            [queryParams]="{ category: category.slug }"
            class="group flex flex-col items-center text-center">
            <div class="relative w-full aspect-square max-w-[8.5rem] rounded-full overflow-hidden ring-4 ring-transparent
                        group-hover:ring-teal-200 shadow-md shadow-slate-200/80 transition-all duration-300">
              @if (category.image) {
                <img [src]="category.image" [alt]="category.name" loading="lazy"
                     class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              } @else {
                <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 group-hover:scale-110 transition-transform duration-500">
                  <span class="text-3xl font-bold">{{ category.name[0] }}</span>
                </div>
              }
              <div class="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors duration-300"></div>
            </div>
            <span class="mt-3 text-sm font-semibold text-slate-800 group-hover:text-teal-600 transition-colors duration-300">{{ category.name }}</span>
            <span class="text-xs text-slate-400">{{ category.productCount }} items</span>
          </a>
        }
      </div>
    </section>

    <!-- ══ Featured deals ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Featured Deals</h2>
          <p class="mt-1.5 text-sm text-slate-500">Hand-picked favorites at their best prices</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ deals: 1 }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          All deals
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        @if (featured() === undefined) {
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
        } @else {
          @for (product of featured()!.slice(0, 4); track product.id) {
            <app-product-card [product]="product" layout="grid" />
          }
        }
      </div>
    </section>

    <!-- ══ Promo banner ══ -->
    @if (activeAnnouncement()) {
      <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 to-teal-800 px-8 py-12 sm:px-14 sm:py-16">
          <div class="absolute -top-16 -end-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-20 start-1/4 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl"></div>
          <div class="relative max-w-xl">
            @if (activeAnnouncement()?.badgeText) {
              <span class="badge bg-white/15 text-white ring-1 ring-white/25 px-3 py-1">{{ activeAnnouncement()?.badgeText }}</span>
            }
            <h2 class="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{{ activeAnnouncement()?.message }}</h2>
            @if (activeAnnouncement()?.subtitle) {
              <p class="mt-3 text-teal-50/90 leading-relaxed">
                {{ activeAnnouncement()?.subtitle }}
              </p>
            }
            @if (activeAnnouncement()?.linkUrl) {
              <a [routerLink]="activeAnnouncement()?.linkUrl" class="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-teal-700 hover:bg-teal-50 shadow-lg shadow-teal-950/30 transition-all duration-300">
                Claim the Deal
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- ══ New arrivals ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20 mb-4">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
          <p class="mt-1.5 text-sm text-slate-500">Fresh drops, just landed</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ sort: 'newest' }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        @if (newArrivals() === undefined) {
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
        } @else {
          @for (product of newArrivals()!.slice(0, 4); track product.id) {
            <app-product-card [product]="product" layout="grid" />
          }
        }
      </div>
    </section>

    <!-- ══ Top rated ══ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20 mb-4">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Top Rated Products</h2>
          <p class="mt-1.5 text-sm text-slate-500">Highest rated by our customers</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ sort: 'rating' }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        @if (topRated() === undefined) {
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
          <app-skeleton-card layout="grid" />
        } @else {
          @for (product of topRated()!.slice(0, 4); track product.id) {
            <app-product-card [product]="product" layout="grid" />
          }
        }
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly announcementService = inject(AnnouncementService);
  
  readonly activeAnnouncement = signal<Announcement | null>(null);

  readonly categories = toSignal(this.productService.getCategories());
  readonly featured = toSignal(this.productService.getFeatured());
  readonly newArrivals = toSignal(this.productService.getNewArrivals());
  readonly topRated = toSignal(this.productService.getTopRated());

  readonly valueProps = [
    {
      title: 'Free & Fast Shipping',
      text: 'Free on all orders over $75',
      icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    },
    {
      title: '30-Day Returns',
      text: 'No-questions-asked refunds',
      icon: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
    },
    {
      title: 'Secure Checkout',
      text: '256-bit SSL encrypted payments',
      icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    },
  ];

  ngOnInit() {
    this.announcementService.getActive().subscribe(data => {
      this.activeAnnouncement.set(data);
    });
  }
}
