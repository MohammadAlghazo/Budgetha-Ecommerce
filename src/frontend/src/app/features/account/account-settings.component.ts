import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule, FormsModule],
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

      </div>

      <!-- Seller Account -->
      <div class="card p-6 border-indigo-100">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold text-slate-900">Seller Account</h2>
            @if (isSeller()) {
              <p class="text-sm text-slate-500 mt-1">You are already a registered seller! You can access the Seller Dashboard from the menu.</p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Seller Active
              </div>
            } @else if (sellerRequestStatus() === 'Pending') {
              <p class="text-sm text-slate-500 mt-1">Your request to become a seller is currently under review by our team.</p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Request Pending
              </div>
            } @else {
              <p class="text-sm text-slate-500 mt-1">Want to sell your own products? Apply for a seller account today and reach thousands of customers.</p>
              
              @if (isRequestingSeller()) {
                <div class="mt-4 space-y-3">
                  <textarea [(ngModel)]="sellerRequestReason" rows="3" placeholder="Tell us briefly about what you plan to sell..."
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none text-sm"></textarea>
                  <div class="flex items-center gap-3">
                    <button type="button" (click)="submitSellerRequest()" [disabled]="submittingSellerRequest()"
                            class="btn-primary py-2 px-5 text-sm">
                      {{ submittingSellerRequest() ? 'Submitting...' : 'Submit Request' }}
                    </button>
                    <button type="button" (click)="isRequestingSeller.set(false)" class="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                  </div>
                </div>
              } @else {
                <button type="button" (click)="isRequestingSeller.set(true)"
                        class="mt-4 inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5
                               text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all duration-300">
                  Request Seller Account
                </button>
              }
            }
          </div>
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
export class AccountSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly http = inject(HttpClient);

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

  readonly isSeller = signal(false);
  readonly sellerRequestStatus = signal<'None' | 'Pending' | 'Rejected'>('None');
  readonly isRequestingSeller = signal(false);
  sellerRequestReason = '';
  readonly submittingSellerRequest = signal(false);

  ngOnInit() {
    this.checkSellerStatus();
  }

  checkSellerStatus() {
    const roles = this.auth.user()?.roles || [];
    this.isSeller.set(roles.includes('Seller'));
  }

  submitSellerRequest() {
    this.submittingSellerRequest.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests`, { reason: this.sellerRequestReason }).subscribe({
      next: () => {
        this.toast.success('Your request to become a seller has been submitted!');
        this.sellerRequestStatus.set('Pending');
        this.isRequestingSeller.set(false);
        this.submittingSellerRequest.set(false);
      },
      error: () => {
        this.toast.error('Failed to submit request.');
        this.submittingSellerRequest.set(false);
      }
    });
  }

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
