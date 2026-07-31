import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest } from '../models/auth.models';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';

  
  
  
  
  private readonly token = signal<string | null>(null);
  private readonly currentUser = signal<AuthResponse | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());
  readonly user = this.currentUser.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredSession();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email } as ForgotPasswordRequest);
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, token, newPassword } as ResetPasswordRequest);
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, { idToken } as GoogleLoginRequest).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  updateProfile(firstName: string, lastName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, { firstName, lastName }).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          const updated = { ...user, firstName, lastName };
          this.currentUser.set(updated);
          localStorage.setItem(this.userKey, JSON.stringify(updated));
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  
  clearSession(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch {
      
    }
    this.token.set(null);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private handleAuth(response: AuthResponse): void {
    try {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response));
    } catch {
      
    }
    this.token.set(response.token);
    this.currentUser.set(response);
  }

  private loadStoredSession(): void {
    let token: string | null = null;
    let stored: string | null = null;

    try {
      token = localStorage.getItem(this.tokenKey);
      stored = localStorage.getItem(this.userKey);
    } catch {
      return;
    }

    if (!token) {
      
      if (stored) this.clearSession();
      return;
    }

    this.token.set(token);

    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored) as AuthResponse);
      } catch {
        
        try { localStorage.removeItem(this.userKey); } catch {  }
        this.currentUser.set(null);
      }
    }
  }
}
