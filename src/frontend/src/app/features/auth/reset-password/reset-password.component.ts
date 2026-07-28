import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-slate-50">
      <div class="w-full max-w-[420px]">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <!-- Logo -->
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-slate-900 tracking-tight">Budgetha</span>
          </div>

          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Reset your password</h1>
            <p class="mt-2 text-sm text-slate-500">Enter the reset token from your email and choose a new password.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                class="input-field"
                [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                placeholder="you@example.com" />
              @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
              }
              @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
                <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
              }
            </div>

            <!-- Token -->
            <div>
              <label for="token" class="block text-sm font-medium text-slate-700 mb-1.5">Reset token</label>
              <input
                id="token"
                type="text"
                formControlName="token"
                class="input-field"
                [class.input-error]="form.get('token')?.touched && form.get('token')?.invalid"
                placeholder="Paste your reset token here" />
              @if (form.get('token')?.touched && form.get('token')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Reset token is required.</p>
              }
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <div class="relative">
                <input
                  id="newPassword"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="newPassword"
                  autocomplete="new-password"
                  class="input-field pr-11"
                  [class.input-error]="form.get('newPassword')?.touched && form.get('newPassword')?.invalid"
                  placeholder="Enter new password" />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showPassword()) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    }
                  </svg>
                </button>
              </div>
              @if (form.get('newPassword')?.touched && form.get('newPassword')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">New password is required.</p>
              }
              @if (form.get('newPassword')?.touched && form.get('newPassword')?.hasError('minlength')) {
                <p class="mt-1.5 text-xs text-red-500">Password must be at least 8 characters.</p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
              <input
                id="confirmPassword"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                autocomplete="new-password"
                class="input-field"
                [class.input-error]="form.get('confirmPassword')?.touched && form.get('confirmPassword')?.invalid"
                placeholder="Repeat new password" />
              @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Please confirm your new password.</p>
              }
              @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('passwordMismatch')) {
                <p class="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
              }
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Resetting...
              } @else {
                Reset password
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-slate-500">
            Remember your password?
            <a routerLink="/auth/login" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, token, newPassword } = this.form.value;
    this.authService.resetPassword(email, token, newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Password has been reset successfully. Please sign in.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Password reset failed. The token may be invalid or expired.');
      }
    });
  }
}
