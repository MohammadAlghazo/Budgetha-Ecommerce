import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export const THEME_STORAGE_KEY = 'budgetha_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly systemIsDark = signal(this.mediaQuery.matches);
  readonly mode = signal<ThemeMode>(this.loadMode());
  readonly resolvedTheme = computed<'light' | 'dark'>(() => {
    const mode = this.mode();
    return mode === 'system' ? (this.systemIsDark() ? 'dark' : 'light') : mode;
  });

  constructor() {
    this.mediaQuery.addEventListener('change', event => {
      this.systemIsDark.set(event.matches);
      if (this.mode() === 'system') this.applyTheme('system', event.matches ? 'dark' : 'light');
    });
    this.applyTheme(this.mode(), this.resolvedTheme());
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.applyTheme(mode, this.resolvedTheme());
  }

  cycleMode(): void {
    const next: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' };
    this.setMode(next[this.mode()]);
  }

  private loadMode(): ThemeMode {
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'light' || value === 'dark' || value === 'system' ? value : 'light';
    } catch {
      return 'light';
    }
  }

  private applyTheme(mode: ThemeMode, resolved: 'light' | 'dark'): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.dataset['theme'] = resolved;
    root.dataset['themeMode'] = mode;
    root.style.colorScheme = resolved;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // The DOM theme still works when storage is unavailable.
    }

    this.document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach(meta => meta.content = resolved === 'dark' ? '#020617' : '#0f766e');
    this.document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
      ?.setAttribute('content', 'light dark');
  }
}
