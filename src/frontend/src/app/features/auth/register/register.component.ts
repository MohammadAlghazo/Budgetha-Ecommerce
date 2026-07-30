import { Component, signal, NgZone, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  currentCardIndex = signal(0);
  readonly totalCards = 4;

  prevCard(): void {
    this.currentCardIndex.update(i => (i - 1 + this.totalCards) % this.totalCards);
  }

  nextCard(): void {
    this.currentCardIndex.update(i => (i + 1) % this.totalCards);
  }

  getCardStyle(index: number) {
    const diff = (index - this.currentCardIndex() + this.totalCards) % this.totalCards;
    
    if (diff === 0) {
      return { transform: 'translateX(0) scale(1)', zIndex: 30, opacity: 1, visibility: 'visible' };
    } else if (diff === 1) {
      return { transform: 'translateX(60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else if (diff === this.totalCards - 1) {
      return { transform: 'translateX(-60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else {
      return { transform: 'translateX(0) scale(0.7)', zIndex: 10, opacity: 0, visibility: 'hidden' };
    }
  }
  
  private get returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
    if (target.startsWith('/auth/')) return '/';
    return target;
  }

  
  get linkQuery(): { returnUrl: string | null } {
    const target = this.returnUrl;
    return { returnUrl: target === '/' ? null : target };
  }

  get passwordStrength(): { score: number; label: string; color: string } {
    const password = this.form?.get('password')?.value || '';
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 5, label: 'Excellent', color: 'bg-emerald-600' };
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fix the highlighted fields before continuing.');
      return;
    }

    const { confirmPassword, ...payload } = this.form.value;

    this.loading.set(true);
    this.authService.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        
        
        this.toastService.success('Your account is ready. Welcome to Budgetha!');
        
        const u = this.authService.user();
        let target = this.returnUrl;
        const isAdminRoute = target.startsWith('/admin');
        const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
        
        if (isAdminRoute && !hasAdminPrivileges) {
          target = '/';
        }
        
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  googleLogin(): void {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In isn’t available right now. Please sign up with your email instead.');
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
              this.toastService.success('Signed up with Google.');
              
              const u = this.authService.user();
              let target = this.returnUrl;
              const isAdminRoute = target.startsWith('/admin');
              const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
              
              if (isAdminRoute && !hasAdminPrivileges) {
                target = '/';
              }
              
              this.router.navigateByUrl(target);
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

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...(confirmPassword.errors ?? {}), passwordMismatch: true });
    return { passwordMismatch: true };
  }

  
  if (confirmPassword.hasError('passwordMismatch')) {
    const { passwordMismatch, ...rest } = confirmPassword.errors ?? {};
    confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
  }
  return null;
}
