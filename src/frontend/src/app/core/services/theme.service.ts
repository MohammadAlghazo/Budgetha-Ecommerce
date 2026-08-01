import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'budgetha-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly mediaQuery = this.isBrowser
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  private readonly selectedMode = signal<ThemeMode>(this.readStoredMode());
  private readonly systemIsDark = signal(this.mediaQuery?.matches ?? false);

  readonly mode = this.selectedMode.asReadonly();
  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const mode = this.selectedMode();
    return mode === 'system' ? this.systemIsDark() ? 'dark' : 'light' : mode;
  });

  private readonly onSystemThemeChange = (event: MediaQueryListEvent): void => {
    this.systemIsDark.set(event.matches);
    if (this.selectedMode() === 'system') {
      this.applyTheme();
    }
  };

  constructor() {
    this.mediaQuery?.addEventListener('change', this.onSystemThemeChange);
    this.applyTheme();
  }

  setMode(mode: ThemeMode): void {
    this.selectedMode.set(mode);
    if (this.isBrowser) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      } catch {
        // The selected mode still applies when storage is blocked or unavailable.
      }
    }
    this.applyTheme();
  }

  cycleMode(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    this.setMode(modes[(modes.indexOf(this.selectedMode()) + 1) % modes.length]);
  }

  private readStoredMode(): ThemeMode {
    if (!this.isBrowser) return 'system';

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return 'system';
    }
    return stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : 'system';
  }

  private applyTheme(): void {
    const mode = this.selectedMode();
    const resolved = mode === 'system'
      ? this.systemIsDark() ? 'dark' : 'light'
      : mode;
    const root = this.document.documentElement;

    root.classList.toggle('dark', resolved === 'dark');
    root.dataset['theme'] = resolved;
    root.dataset['themeMode'] = mode;
    root.style.colorScheme = resolved;

    const themeColor = resolved === 'dark' ? '#0f172a' : '#0f766e';
    this.document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach(meta => meta.content = themeColor);
    this.document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
      ?.setAttribute('content', resolved);
  }
}
