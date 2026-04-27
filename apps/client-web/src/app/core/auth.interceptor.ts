import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Auth Interceptor
 *
 * 1. Her isteğe Authorization: Bearer <token> header'ı ekler
 * 2. 401 hatalarında otomatik token yenileme yapar
 * 3. Refresh başarısızsa çıkış yapılır
 *
 * GÜVENLİK:
 * - Auth endpoint'lerine (login, register, refresh) token eklenmez
 * - SSR'da çalışmaz (localStorage yok)
 * - Race condition koruması: aynı anda birden fazla refresh engellenir
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // SSR'da müdahale etme
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(req);
    }

    // Auth endpoint'lerine token ekleme
    if (this.isAuthUrl(req.url)) {
      return next.handle(req);
    }

    // Geçici olarak X-Skip-Auth kontrolü kaldırıldı (CORS hatası nedeniyle)
    // Backend'de guard devre dışı, bu yüzden token eklemek sorun değil

    // Token varsa ekle
    const token = this.authService.getAccessToken();
    let authReq = req;
    if (token) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // 401 hatası - token yenilemeyi dene (token varsa)
        if (error.status === 401) {
          if (token) {
            // Token var ama geçersiz, yenilemeyi dene
            return this.handle401Error(authReq, next);
          } else {
            // Token yok, direkt hatayı fırlat (component'te yakalanacak)
            return throwError(() => error);
          }
        }
        return throwError(() => error);
      }),
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      // Zaten refresh yapılıyor, yeni token'ı bekle
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addToken(req, token!))),
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((res) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(res.accessToken);
        return next.handle(this.addToken(req, res.accessToken));
      }),
      catchError((err) => {
        this.isRefreshing = false;
        // Token yenileme başarısız - logout yap ama hata fırlatma
        // Component'te 401 hatası yakalanacak ve SearchOnly ile tekrar denenecek
        this.authService.logout();
        // Orijinal hatayı fırlat (component'te yakalanacak)
        return throwError(() => err);
      }),
    );
  }

  private isAuthUrl(url: string): boolean {
    return (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/verify-email')
    );
  }
}
