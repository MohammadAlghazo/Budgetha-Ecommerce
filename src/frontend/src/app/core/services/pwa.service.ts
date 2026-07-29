import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { ToastService } from './toast.service';

/** The `beforeinstallprompt` event isn't in TypeScript's DOM lib yet. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'budgetha:install-dismissed';

/**
 * Owns everything install/offline related:
 *  - captures the browser's install prompt so we can trigger it from our own UI
 *  - tells the user when a new version is ready, with a one-tap reload
 *  - exposes online/offline state for the connectivity banner
 */
@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly toast = inject(ToastService);
  private readonly swUpdate = inject(SwUpdate, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  private readonly promptAvailable = signal(false);
  private readonly installed = signal(false);
  private readonly dismissed = signal(readDismissed());

  readonly online = signal(true);

  /** True when we can actually show a working "Install app" button. */
  readonly canInstall = computed(() => this.promptAvailable() && !this.installed() && !this.dismissed());

  /**
   * Whether to offer installation in the UI at all. Broader than `canInstall`
   * because Safari and Firefox never fire `beforeinstallprompt` — there we still
   * show the button and explain the manual "Add to Home Screen" path on click.
   */
  readonly showInstallAffordance = computed(() => !this.installed() && !this.dismissed());

  /** True once the app is running in a standalone window. */
  readonly isStandalone = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    this.online.set(navigator.onLine);
    this.isStandalone.set(detectStandalone());
    this.installed.set(detectStandalone());

    const onBeforeInstall = (event: Event) => {
      // Suppress Chrome's mini-infobar so our own button is the entry point.
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.promptAvailable.set(true);
    };

    const onInstalled = () => {
      this.deferredPrompt = null;
      this.promptAvailable.set(false);
      this.installed.set(true);
      this.toast.success('Budgetha is installed. Look for it alongside your other apps.');
    };

    const onOnline = () => {
      this.online.set(true);
      this.toast.success('You’re back online.');
    };

    const onOffline = () => {
      this.online.set(false);
      this.toast.warning('You’re offline. You can keep browsing pages you’ve already visited.', { duration: 0 });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    });

    this.watchForUpdates();
  }

  /** Opens the native install dialog. Returns true if the user accepted. */
  async install(): Promise<boolean> {
    const prompt = this.deferredPrompt;

    if (!prompt) {
      // Safari and Firefox never fire beforeinstallprompt — explain the manual path.
      this.toast.info(installHint(), { duration: 8000 });
      return false;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;

      // The event can only be used once, whatever the outcome.
      this.deferredPrompt = null;
      this.promptAvailable.set(false);

      if (outcome === 'accepted') return true;

      this.dismissInstall();
      return false;
    } catch {
      this.deferredPrompt = null;
      this.promptAvailable.set(false);
      this.toast.error('We couldn’t open the install dialog. Try your browser’s menu instead.');
      return false;
    }
  }

  /** Hides the install affordance for this browser until storage is cleared. */
  dismissInstall(): void {
    this.dismissed.set(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Non-fatal — the button simply reappears next visit.
    }
  }

  private watchForUpdates(): void {
    if (!this.swUpdate?.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.toast.info('A new version of Budgetha is ready.', {
          duration: 0,
          action: {
            label: 'Reload now',
            handler: () => this.swUpdate!.activateUpdate().then(() => document.location.reload()),
          },
        });
      });

    // An unrecoverable cache state means the SW can no longer serve the app.
    this.swUpdate.unrecoverable.subscribe(() => {
      this.toast.error('Budgetha needs to reload to recover from a caching problem.', {
        duration: 0,
        action: { label: 'Reload', handler: () => document.location.reload() },
      });
    });
  }
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return window.matchMedia?.('(display-mode: standalone)').matches === true || iosStandalone;
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function installHint(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'To install Budgetha: tap Share, then “Add to Home Screen”.';
  }
  if (/Firefox/i.test(ua)) {
    return 'To install Budgetha: open the Firefox menu and choose “Install”.';
  }
  return 'To install Budgetha: open your browser menu and choose “Install app”.';
}
