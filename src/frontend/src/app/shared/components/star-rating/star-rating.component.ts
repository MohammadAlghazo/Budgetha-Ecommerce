import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="relative inline-flex" [attr.aria-label]="rating() + ' out of 5 stars'" role="img">
      <!-- Empty layer -->
      <div class="flex gap-0.5 text-slate-200">
        @for (star of stars; track star) {
          <svg [class]="sizeClass()" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        }
      </div>
      <!-- Filled layer clipped to rating percentage -->
      <div class="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400" [style.width.%]="fillPercent()">
        @for (star of stars; track star) {
          <svg [class]="sizeClass() + ' shrink-0'" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        }
      </div>
    </div>
  `,
})
export class StarRatingComponent {
  readonly rating = input(0);
  readonly size = input<'sm' | 'md' | 'lg'>('sm');

  readonly stars = [1, 2, 3, 4, 5];
  readonly fillPercent = computed(() => Math.max(0, Math.min(100, (this.rating() / 5) * 100)));
  readonly sizeClass = computed(
    () => ({ sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' })[this.size()]
  );
}
