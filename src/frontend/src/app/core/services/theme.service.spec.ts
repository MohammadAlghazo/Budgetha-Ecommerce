import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['theme'];
    delete document.documentElement.dataset['themeMode'];
  });

  it('persists and applies an explicit dark theme', () => {
    service.setMode('dark');

    expect(service.mode()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.documentElement.dataset['themeMode']).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('cycles through light, dark, and system modes', () => {
    service.setMode('light');
    service.cycleMode();
    expect(service.mode()).toBe('dark');

    service.cycleMode();
    expect(service.mode()).toBe('system');

    service.cycleMode();
    expect(service.mode()).toBe('light');
  });
});
