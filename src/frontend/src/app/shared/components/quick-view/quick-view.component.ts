import { Component, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-quick-view',
  imports: [CurrencyPipe, StarRatingComponent],
  template: `
    @if (product(); as p) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        (click)="close()"
        aria-hidden="true"></div>

      <!-- Dialog -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none" role="dialog" aria-modal="true" [attr.aria-label]="'Quick view: ' + p.name">
        <div class="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.25s_ease-out]">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Image -->
            <div class="relative aspect-square bg-slate-100 md:rounded-l-2xl overflow-hidden flex items-center justify-center p-4">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-contain mix-blend-multiply p-6" />
              @if (p.images.length > 1) {
                <div class="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  @for (image of p.images; track image; let i = $index) {
                    <button
                      type="button"
                      (click)="activeIndex.set(i)"
                      [attr.aria-label]="'Image ' + (i + 1)"
                      class="h-2 rounded-full transition-all duration-300"
                      [class]="activeIndex() === i ? 'w-6 bg-violet-600' : 'w-2 bg-white/80 hover:bg-white'"></button>
                  }
                </div>
              }
            </div>

            <!-- Details -->
            <div class="p-6 flex flex-col relative">
              <button
                type="button"
                (click)="close()"
                aria-label="Close quick view"
                class="absolute top-4 end-4 icon-btn h-9 w-9 bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              <h2 class="mt-1 text-xl font-bold text-slate-900 pe-10">{{ p.name }}</h2>
              <div class="mt-2 flex items-center gap-2">
                <app-star-rating [rating]="p.rating" size="sm" />
                <span class="text-xs text-slate-400">{{ p.rating }} · {{ p.reviewCount }} reviews</span>
              </div>

              <div class="mt-4 flex items-baseline gap-2">
                <span class="text-2xl font-bold text-slate-900">{{ p.price | currency }}</span>
                @if (p.originalPrice) {
                  <span class="text-base text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
                }
              </div>

              <p class="mt-4 text-sm text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

              @if (p.colors.length) {
                <div class="mt-5">
                  <span class="text-sm font-medium text-slate-700">Color: <span class="text-slate-500 font-normal">{{ selectedColor() }}</span></span>
                  <div class="mt-2 flex gap-2">
                    @for (color of p.colors; track color.name) {
                      <button
                        type="button"
                        (click)="selectedColor.set(color.name)"
                        [attr.aria-label]="color.name"
                        class="h-8 w-8 rounded-full ring-2 ring-offset-2 transition-all duration-300"
                        [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                        [style.background-color]="color.hex"></button>
                    }
                  </div>
                </div>
              }

              @if (p.sizes.length) {
                <div class="mt-5">
                  <span class="text-sm font-medium text-slate-700">Size</span>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (size of p.sizes; track size) {
                      <button
                        type="button"
                        (click)="selectedSize.set(size)"
                        class="min-w-[2.75rem] px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300"
                        [class]="selectedSize() === size
                          ? 'border-violet-600 bg-violet-50 text-violet-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'">
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>
              }

              <div class="mt-auto pt-6 flex gap-3">
                <button type="button" (click)="addToCart()" [disabled]="p.stock === 0" class="btn-primary flex-1">
                  {{ p.stock === 0 ? 'Out of stock' : 'Add to cart' }}
                </button>
                <button type="button" (click)="viewFullDetails()" class="btn-secondary">
                  Full details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  `,
})
export class QuickViewComponent {
  private readonly quickViewService = inject(QuickViewService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly product = this.quickViewService.product;
  readonly activeIndex = signal(0);
  readonly selectedColor = signal<string>('');
  readonly selectedSize = signal<string>('');

  readonly activeImage = computed(() => {
    const p = this.product();
    if (!p) return '';
    return p.images[Math.min(this.activeIndex(), p.images.length - 1)];
  });

  constructor() {
    
    effect(() => {
      const p = this.product();
      this.activeIndex.set(0);
      this.selectedColor.set(p?.colors[0]?.name ?? '');
      this.selectedSize.set(p?.sizes[0] ?? '');
    });
  }

  close(): void {
    this.quickViewService.close();
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(
      p,
      1,
      this.selectedColor() || p.colors[0]?.name,
      this.selectedSize() || p.sizes[0]
    );
    this.close();
  }

  viewFullDetails(): void {
    const p = this.product();
    if (!p) return;
    this.close();
    this.router.navigate(['/products', p.slug]);
  }
}
