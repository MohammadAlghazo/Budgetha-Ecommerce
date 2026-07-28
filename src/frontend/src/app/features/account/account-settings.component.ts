import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Profile -->
      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Profile</h2>
        <p class="text-sm text-slate-400 mt-0.5">This information appears on your receipts and shipping labels</p>

        <div class="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
            <input id="firstName" type="text" formControlName="firstName" autocomplete="given-name" class="input-field"
                   [class.input-error]="invalid(profileForm, 'firstName')" />
            @if (invalid(profileForm, 'firstName')) { <p class="mt-1.5 text-xs text-red-500">First name is required.</p> }
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
            <input id="lastName" type="text" formControlName="lastName" autocomplete="family-name" class="input-field"
                   [class.input-error]="invalid(profileForm, 'lastName')" />
            @if (invalid(profileForm, 'lastName')) { <p class="mt-1.5 text-xs text-red-500">Last name is required.</p> }
          </div>
          <div class="sm:col-span-2">
            <label for="settings-email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input id="settings-email" type="email" formControlName="email" autocomplete="email" class="input-field bg-slate-100/70 cursor-not-allowed" readonly />
            <p class="mt-1.5 text-xs text-slate-400">Contact support to change the email tied to your account.</p>
          </div>
        </div>
        <button type="submit" class="btn-primary mt-6">Save changes</button>
      </form>

      <!-- Password -->
      <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Change Password</h2>
        <p class="text-sm text-slate-400 mt-0.5">Use at least 6 characters with a mix of letters and numbers</p>

        <div class="mt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Current password</label>
            <input id="currentPassword" type="password" formControlName="current" autocomplete="current-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'current')" />
            @if (invalid(passwordForm, 'current')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
            <input id="newPassword" type="password" formControlName="next" autocomplete="new-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'next')" />
            @if (invalid(passwordForm, 'next')) { <p class="mt-1.5 text-xs text-red-500">At least 6 characters.</p> }
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input id="confirmPassword" type="password" formControlName="confirm" autocomplete="new-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'confirm') || mismatch()" />
            @if (mismatch()) { <p class="mt-1.5 text-xs text-red-500">Passwords don't match.</p> }
          </div>
        </div>
        <button type="submit" class="btn-primary mt-6">Update password</button>
      </form>

      <!-- Notifications -->
      <div class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Notifications</h2>
        <p class="text-sm text-slate-400 mt-0.5">Choose what we email you about</p>
        <div class="mt-5 divide-y divide-slate-100">
          @for (pref of notificationPrefs(); track pref.key) {
            <div class="flex items-center justify-between py-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ pref.label }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ pref.description }}</p>
              </div>
              <button
                type="button"
                role="switch"
                [attr.aria-checked]="pref.enabled"
                [attr.aria-label]="'Toggle ' + pref.label"
                (click)="togglePref(pref.key)"
                class="relative h-6 w-11 rounded-full transition-colors duration-300 shrink-0"
                [class]="pref.enabled ? 'bg-violet-600' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300"
                      [class]="pref.enabled ? 'left-[1.375rem]' : 'left-0.5'"></span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card p-6 border-rose-100">
        <h2 class="text-lg font-bold text-rose-600">Danger Zone</h2>
        <p class="text-sm text-slate-400 mt-0.5">Permanently delete your account and all associated data</p>
        <button type="button" (click)="requestDelete()"
                class="mt-5 inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3
                       text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-all duration-300">
          Delete my account
        </button>
      </div>
    </div>
  `,
})
export class AccountSettingsComponent {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly profileSubmitted = signal(false);
  readonly passwordSubmitted = signal(false);

  readonly profileForm = this.fb.group({
    firstName: [this.auth.user()?.firstName ?? '', Validators.required],
    lastName: [this.auth.user()?.lastName ?? '', Validators.required],
    email: [{ value: this.auth.user()?.email ?? '', disabled: false }],
  });

  readonly passwordForm = this.fb.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  });

  readonly notificationPrefs = signal([
    { key: 'orders', label: 'Order updates', description: 'Shipping confirmations and delivery notifications', enabled: true },
    { key: 'deals', label: 'Deals & promotions', description: 'Weekly digest of price drops and exclusive codes', enabled: true },
    { key: 'wishlist', label: 'Wishlist alerts', description: 'When a saved item goes on sale or is back in stock', enabled: false },
  ]);

  invalid(form: FormGroup, control: string): boolean {
    const c = form.get(control);
    const submitted = form === this.profileForm ? this.profileSubmitted() : this.passwordSubmitted();
    return !!c && c.invalid && (c.touched || submitted);
  }

  mismatch(): boolean {
    const { next, confirm } = this.passwordForm.getRawValue();
    return !!confirm && next !== confirm && (this.passwordForm.get('confirm')!.touched || this.passwordSubmitted());
  }

  saveProfile(): void {
    this.profileSubmitted.set(true);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.toast.success('Profile updated');
  }

  changePassword(): void {
    this.passwordSubmitted.set(true);
    if (this.passwordForm.invalid || this.mismatch()) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordForm.reset();
    this.passwordSubmitted.set(false);
    this.toast.success('Password changed successfully');
  }

  togglePref(key: string): void {
    this.notificationPrefs.update(prefs =>
      prefs.map(p => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    );
  }

  requestDelete(): void {
    this.toast.info('Account deletion requires email confirmation — check your inbox.');
  }
}
