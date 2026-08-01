import { Component, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter, map, merge, of, startWith, switchMap, timer } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component';
import { QuickViewComponent } from '../../shared/components/quick-view/quick-view.component';
import { OfflineBannerComponent } from '../../shared/components/offline-banner/offline-banner.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CartDrawerComponent, QuickViewComponent, OfflineBannerComponent],
   template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <app-offline-banner />
      @if (navigationLoading()) {
        <div class="fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-teal-100" role="status" aria-label="Loading page">
          <div class="h-full w-1/3 bg-teal-600 animate-[loadingBar_1.1s_ease-in-out_infinite]"></div>
        </div>
      }
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-cart-drawer />
      <app-quick-view />
      </div>
  `,
  styles: `
    @keyframes loadingBar {
      0% { transform: translateX(-120%); }
      100% { transform: translateX(420%); }
    }
  `,
})
export class ShellComponent {
  private readonly router = inject(Router);

  readonly navigationLoading = toSignal(
    this.router.events.pipe(
      switchMap(event => {
        if (event instanceof NavigationStart) {
          return timer(120).pipe(map(() => true));
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          return of(false);
        }
        return of(null);
      }),
      filter((value): value is boolean => value !== null),
      startWith(false),
      takeUntilDestroyed()
    ),
    { initialValue: false }
  );
}
