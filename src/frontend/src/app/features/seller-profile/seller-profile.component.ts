import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { SellerProfile } from '../../core/models/shop.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-seller-profile',
  imports: [DatePipe, RouterLink, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
      @if (loading()) {
        <div class="card p-12 text-center text-slate-500">Loading seller profile...</div>
      } @else if (!profile()) {
        <div class="card p-12 text-center">
          <h1 class="text-xl font-bold text-slate-900">Seller not found</h1>
          <a routerLink="/shop" class="btn-primary inline-flex mt-5">Back to shop</a>
        </div>
      } @else {
        <a routerLink="/shop" class="text-sm text-violet-600 hover:underline">Back to shop</a>
        <section class="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-violet-700 text-white p-7 sm:p-10">
          <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            @if (profile()?.avatarUrl) {
              <img [src]="profile()?.avatarUrl" [alt]="profile()?.displayName" class="h-24 w-24 rounded-full object-cover ring-4 ring-white/20" />
            } @else {
              <div class="h-24 w-24 rounded-full bg-white/15 ring-4 ring-white/20 flex items-center justify-center text-3xl font-bold">{{ profile()?.displayName?.charAt(0) }}</div>
            }
            <div>
              <p class="text-violet-200 text-sm font-semibold uppercase tracking-widest">Seller profile</p>
              <h1 class="mt-1 text-3xl sm:text-4xl font-extrabold">{{ profile()?.businessName || profile()?.displayName }}</h1>
              <p class="mt-2 text-violet-100 max-w-2xl">{{ profile()?.businessDescription || 'Explore this seller’s approved products on Budgetha.' }}</p>
            </div>
          </div>
          <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="rounded-2xl bg-white/10 p-4"><span class="block text-2xl font-bold">{{ profile()?.activeProductCount }}</span><span class="text-sm text-violet-200">Active products</span></div>
            <div class="rounded-2xl bg-white/10 p-4"><span class="block text-2xl font-bold">{{ profile()?.averageRating || 'New' }}</span><span class="text-sm text-violet-200">Average rating</span></div>
            <div class="rounded-2xl bg-white/10 p-4"><span class="block text-2xl font-bold">{{ profile()?.reviewCount }}</span><span class="text-sm text-violet-200">Reviews</span></div>
            <div class="rounded-2xl bg-white/10 p-4"><span class="block text-2xl font-bold">{{ profile()?.memberSince | date:'yyyy' }}</span><span class="text-sm text-violet-200">Member since</span></div>
          </div>
        </section>
        <section class="mt-10">
          <div class="flex items-end justify-between gap-4"><div><p class="text-sm text-violet-600 font-semibold">Approved catalog</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Products by {{ profile()?.displayName }}</h2></div></div>
          @if (products().length) {
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">@for (product of products(); track product.id) {<app-product-card [product]="product" layout="grid" />}</div>
          } @else {<div class="mt-6 card p-10 text-center text-slate-500">This seller has no approved products yet.</div>}
        </section>
      }
    </div>
  `
})
export class SellerProfileComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductService);
  readonly profile = signal<SellerProfile | null>(null);
  readonly products = signal<any[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.route.paramMap.pipe(switchMap(params => this.productsService.getSellerProfile(params.get('id') ?? ''))).subscribe({
      next: profile => {
        this.profile.set(profile);
        this.productsService.query({ search: '', categories: [], brands: [], minPrice: 0, maxPrice: 1000000, minRating: 0, sort: 'newest', page: 1, pageSize: 100, sellerId: profile.id }).subscribe(result => this.products.set(result.items));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
