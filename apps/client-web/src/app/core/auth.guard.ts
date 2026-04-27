import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

/**
 * Oturum gerektiren sayfalara erişim kontrolü.
 * Giriş yapılmamışsa /giris sayfasına yönlendirir ve
 * giriş sonrası geri dönülebilmesi için returnUrl saklar.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    // SSR'da her zaman geçerli say (client-side hydration çözecek)
    if (!isPlatformBrowser(this.platformId)) return true;

    if (this.authService.isLoggedIn) {
      return true;
    }

    // Giriş sonrası geri dönülebilmesi için URL'yi parametre olarak ekle
    this.router.navigate(['/giris'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
