import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-cart-drawer />
      <app-quick-view />
    </div>
  `,
})
export class ShellComponent {}
