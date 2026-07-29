import { Component, signal, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  showPassword = signal(false);

  /**
   * Where to send the user after a successful sign-in. The auth guard puts the
   * page they were blocked from (e.g. /checkout) here, so guests who tried to
   * check out resume exactly where they left off instead of landing on home.
   */
  private get returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    // Only allow same-app paths — never an absolute or protocol-relative URL.
    if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
    if (target.startsWith('/auth/')) return '/';
    return target;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  /** Carries returnUrl across to /auth/register so the round-trip survives. */
  get linkQuery(): { returnUrl: string | null } {
    const target = this.returnUrl;
    return { returnUrl: target === '/' ? null : target };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fix the highlighted fields before continuing.');
      return;
    }

    this.loading.set(true);
    this.authService.login(this.form.value).subscribe({
      next: response => {
        this.loading.set(false);
        this.toastService.success(`Welcome back${response?.firstName ? ', ' + response.firstName : ''}!`);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: () => {
        // The error interceptor already surfaced a specific message; just
        // release the button so the user can retry.
        this.loading.set(false);
      }
    });
  }

  googleLogin(): void {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In isn’t available right now. Please sign in with your email instead.');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this.ngZone.run(() => {
          this.loading.set(true);
          this.authService.googleLogin(response.credential).subscribe({
            next: () => {
              this.loading.set(false);
              this.toastService.success('Signed in with Google.');
              this.router.navigateByUrl(this.returnUrl);
            },
            error: () => {
              this.loading.set(false);
            }
          });
        });
      }
    });

    google.accounts.id.prompt();
  }
}
