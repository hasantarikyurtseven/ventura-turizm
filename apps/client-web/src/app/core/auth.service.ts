import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { API_BASE_URL } from './api-url.token';

// ─── Interfaces ───

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

// ─── Service ───

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser: boolean;

  /** Giriş yapmış kullanıcı bilgisi */
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  /** Token yenileme kilit mekanizması (race condition önleme) */
  private isRefreshing = false;

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadFromStorage();
  }

  // ═══════════════════════════════════════════════
  //  KAYIT & DOĞRULAMA
  // ═══════════════════════════════════════════════

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, data);
  }

  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.http.get<VerifyEmailResponse>(`${this.baseUrl}/auth/verify-email`, {
      params: { token },
    });
  }

  resendVerificationEmail(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/auth/resend-verification`,
      { email },
    );
  }

  // ═══════════════════════════════════════════════
  //  GİRİŞ & ÇIKIŞ
  // ═══════════════════════════════════════════════

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.saveTokens(res.accessToken, res.refreshToken);
            this.currentUserSubject.next(res.user);
            this.saveUser(res.user);
          }
        }),
      );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      // Fire-and-forget: sunucuya çıkış bildirimi
      this.http
        .post(`${this.baseUrl}/auth/logout`, { refreshToken })
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
    this.clearSession();
  }

  // ═══════════════════════════════════════════════
  //  TOKEN YÖNETİMİ
  // ═══════════════════════════════════════════════

  getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('vt_access_token');
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('vt_refresh_token');
  }

  /** Token yenileme (interceptor tarafından çağrılır) */
  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('No refresh token'));
    }

    if (this.isRefreshing) {
      return throwError(() => new Error('Already refreshing'));
    }

    this.isRefreshing = true;

    return this.http
      .post<RefreshResponse>(`${this.baseUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          this.isRefreshing = false;
          if (res.success) {
            this.saveTokens(res.accessToken, res.refreshToken);
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.clearSession();
          return throwError(() => err);
        }),
      );
  }

  /** Kullanıcı giriş yapmış mı? */
  get isLoggedIn(): boolean {
    // Token varsa kullanıcı giriş yapmış demektir
    // currentUser bilgisi sayfa yenilendiğinde yüklenemeyebilir, bu yüzden sadece token kontrolü yapıyoruz
    return !!this.getAccessToken();
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // ═══════════════════════════════════════════════
  //  DEPOLAMA
  // ═══════════════════════════════════════════════

  private saveTokens(accessToken: string, refreshToken: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem('vt_access_token', accessToken);
    localStorage.setItem('vt_refresh_token', refreshToken);
  }

  private saveUser(user: AuthUser): void {
    if (!this.isBrowser) return;
    localStorage.setItem('vt_user', JSON.stringify(user));
  }

  /** Profil yüklendikten sonra local user'a telefon ekler */
  updateLocalPhone(phone: string): void {
    const user = this.currentUserSubject.value;
    if (!user || !phone) return;
    const updated = { ...user, phone };
    this.currentUserSubject.next(updated);
    this.saveUser(updated);
  }

  private loadFromStorage(): void {
    if (!this.isBrowser) return;
    try {
      const userStr = localStorage.getItem('vt_user');
      const accessToken = localStorage.getItem('vt_access_token');
      if (userStr && accessToken) {
        this.currentUserSubject.next(JSON.parse(userStr));
      }
    } catch {
      this.clearSession();
    }
  }

  private clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem('vt_access_token');
      localStorage.removeItem('vt_refresh_token');
      localStorage.removeItem('vt_user');
    }
    this.currentUserSubject.next(null);
  }
}
