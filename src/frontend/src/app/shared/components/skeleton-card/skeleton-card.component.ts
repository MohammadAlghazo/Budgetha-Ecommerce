import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    @if (layout === 'grid') {
      <!-- Grid Layout Skeleton -->
      <div class="card overflow-hidden h-full flex flex-col group animate-pulse">
        <div class="relative aspect-square w-full bg-slate-200"></div>
        <div class="flex flex-col flex-1 p-4 sm:p-5">
          <div class="h-3 w-1/3 bg-slate-200 rounded mb-3"></div>
          <div class="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
          <div class="h-4 w-1/4 bg-slate-200 rounded mb-4"></div>
          <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="h-6 w-1/3 bg-slate-200 rounded"></div>
            <div class="h-10 w-10 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    } @else {
      <!-- List Layout Skeleton -->
      <div class="card flex flex-col sm:flex-row overflow-hidden animate-pulse">
        <div class="relative sm:w-48 xl:w-56 aspect-square sm:aspect-auto bg-slate-200 shrink-0"></div>
        <div class="flex-1 p-5 sm:p-6 flex flex-col">
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-3 flex-1">
              <div class="h-3 w-1/4 bg-slate-200 rounded"></div>
              <div class="h-6 w-3/4 bg-slate-200 rounded"></div>
              <div class="h-4 w-1/5 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div class="mt-4 hidden sm:block space-y-2">
            <div class="h-3 w-full bg-slate-200 rounded"></div>
            <div class="h-3 w-5/6 bg-slate-200 rounded"></div>
          </div>
          <div class="mt-auto pt-6 flex items-end justify-between">
            <div class="h-7 w-1/4 bg-slate-200 rounded"></div>
            <div class="h-10 w-32 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    }
  `
})
export class SkeletonCardComponent {
  @Input() layout: 'grid' | 'list' = 'grid';
}
