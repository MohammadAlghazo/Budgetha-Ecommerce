import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { INFO_PAGES, InfoPage } from '../../core/mocks/info-pages';


@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (content(); as page) {
      <div class="bg-gradient-to-b from-violet-50 to-white border-b border-slate-100">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb">
            <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
            <span aria-hidden="true">/</span>
            <span class="text-slate-500">{{ page.eyebrow }}</span>
          </nav>

          <p class="mt-6 text-xs font-bold uppercase tracking-widest text-violet-600">{{ page.eyebrow }}</p>
          <h1 class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{{ page.title }}</h1>
          @if (page.updated) {
            <p class="mt-2 text-xs text-slate-400">{{ page.updated }}</p>
          }
          <p class="mt-4 text-base sm:text-lg leading-relaxed text-slate-500">{{ page.intro }}</p>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div class="space-y-10">
          @for (section of page.sections; track section.heading) {
            <section>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">{{ section.heading }}</h2>
              <div class="mt-3 space-y-3">
                @for (paragraph of section.body; track paragraph) {
                  <p class="text-sm leading-relaxed text-slate-600">{{ paragraph }}</p>
                }
              </div>
            </section>
          }
        </div>

        <div class="card mt-12 p-6 sm:p-8 text-center">
          <h3 class="text-base font-bold text-slate-900">Still need a hand?</h3>
          <p class="mt-2 text-sm text-slate-500">Our support team replies within one business day.</p>
          <div class="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <a routerLink="/contact" class="btn-primary px-6">Contact support</a>
            <a routerLink="/shop" class="btn-secondary px-6">Continue shopping</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class InfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  
  private readonly key = toSignal(this.route.data.pipe(map(data => data['key'] as string)), {
    initialValue: this.route.snapshot.data['key'] as string,
  });

  protected readonly content = computed<InfoPage | null>(() => INFO_PAGES[this.key()] ?? null);
}
