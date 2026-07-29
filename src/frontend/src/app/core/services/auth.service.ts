import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5272/api/auth';
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';

  // The token lives in a signal (not just localStorage) so that everything
  // derived from it — `isAuthenticated`, the header, the route guards — updates
  // the moment the session changes. Reading localStorage inside a computed()
  // would never re-evaluate, leaving the UI showing "Sign in" after a login.
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

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Drops the session without navigating. Used by the error interceptor when the
   * API reports an expired token, so it can pick its own redirect target while
   * still keeping the signals in sync.
   */
  clearSession(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch {
      // Storage can be unavailable (private mode, quota). Signals still clear.
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
      // Session still works for this tab even if it can't be persisted.
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
      // A stale user blob without a token is not a session — discard it.
      if (stored) this.clearSession();
      return;
    }

    this.token.set(token);

    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored) as AuthResponse);
      } catch {
        // Corrupt payload shouldn't take the whole app down on boot.
        try { localStorage.removeItem(this.userKey); } catch { /* ignore */ }
        this.currentUser.set(null);
      }
    }
  }
}
