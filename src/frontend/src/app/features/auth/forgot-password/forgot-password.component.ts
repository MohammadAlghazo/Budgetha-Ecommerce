import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
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

          @if (!submitted()) {
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
              <p class="mt-2 text-sm text-slate-500">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
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

              <button type="submit" [disabled]="loading()" class="btn-primary w-full">
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Sending...
                } @else {
                  Send reset link
                }
              </button>
            </form>
          } @else {
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p class="text-sm text-slate-500 mb-6">
                If an account with that email exists, we've sent a password reset link.
              </p>
              <a routerLink="/auth/reset-password"
                 class="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors">
                Have a reset token? Reset your password
              </a>
            </div>
          }

          <p class="mt-6 text-center text-sm text-slate-500">
            Remember your password?
            <a routerLink="/auth/login" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  submitted = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.loading.set(false);
        // Still show success to avoid revealing whether the email exists
        this.submitted.set(true);
      }
    });
  }
}
