import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.applyTheme();
  }

  setMode(): void {
    // No-op, dark mode is disabled
  }

  cycleMode(): void {
    // No-op, dark mode is disabled
  }

  private applyTheme(): void {
    const root = this.document.documentElement;
    root.classList.remove('dark');
    root.dataset['theme'] = 'light';
    root.dataset['themeMode'] = 'light';
    root.style.colorScheme = 'light';

    this.document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach(meta => meta.content = '#0f766e');
    this.document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
      ?.setAttribute('content', 'light');
  }
}
