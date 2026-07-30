import { Component, signal, NgZone, inject, ViewChild, ElementRef } from '@angular/core';
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

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  
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
