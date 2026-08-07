import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="theme-preserve-light mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-8">
          <img src="/images/logo.png" alt="Budgetha" class="h-12 w-auto object-contain" />
        </div>
        <h2 class="text-center text-3xl font-black text-slate-900 tracking-tight" style="font-family: 'Outfit', sans-serif;">
          Email Confirmation
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 text-center">
          
          <div *ngIf="status() === 'loading'" class="flex flex-col items-center">
            <svg class="animate-spin h-10 w-10 text-violet-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-600">Confirming your email address...</p>
          </div>

          <div *ngIf="status() === 'success'" class="flex flex-col items-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-slate-900 mb-2">Email Confirmed!</h3>
            <p class="text-sm text-slate-500 mb-6">Your email address has been successfully verified.</p>
            <a routerLink="/auth/login" class="btn-primary w-full justify-center">Continue to Login</a>
          </div>

          <div *ngIf="status() === 'error'" class="flex flex-col items-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-slate-900 mb-2">Confirmation Failed</h3>
            <p class="text-sm text-slate-500 mb-6">{{ errorMessage() }}</p>
            <a routerLink="/auth/login" class="btn-secondary w-full justify-center">Back to Login</a>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ConfirmEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  
  status = signal<'loading' | 'success' | 'error'>('loading');
  errorMessage = signal<string>('The confirmation link is invalid or has expired.');

  ngOnInit() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!userId || !token) {
      this.status.set('error');
      return;
    }

    this.http.get(`${environment.apiUrl}/auth/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`)
      .subscribe({
        next: () => this.status.set('success'),
        error: (err) => {
          this.status.set('error');
          if (err.error?.message) {
            this.errorMessage.set(err.error.message);
          }
        }
      });
  }
}
