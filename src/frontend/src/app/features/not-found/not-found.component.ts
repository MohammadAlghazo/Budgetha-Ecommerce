import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <p class="text-[7rem] sm:text-[9rem] font-black leading-none text-gradient select-none">404</p>
      <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Page not found</h1>
      <p class="mt-3 text-slate-500 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Let's get you back to the good stuff.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <a routerLink="/" class="btn-primary px-8">Back to Home</a>
        <a routerLink="/shop" class="btn-secondary px-8">Browse Products</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
