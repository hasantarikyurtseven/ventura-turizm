import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

/**
 * Client API base URL injection token.
 *
 * Browser : environment.apiBaseUrl   (dev: localhost:3002, prod: https://api.venturaturizm.com)
 * SSR     : process.env.CLIENT_API_URL  (Docker internal: http://client-api:3000)
 *
 * Canlıda sorun çıkmaması için her iki taraf da konfigürasyondan okunur.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export function apiBaseUrlFactory(): string {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    // Browser: Angular environment dosyasından (build-time)
    return environment.apiBaseUrl;
  }

  // SSR (server-side): Docker ortam değişkeninden
  // Fallback olarak environment.apiBaseUrl kullanılır (local dev, Docker dışı)
  const ssrUrl =
    (typeof process !== 'undefined' && process.env?.['CLIENT_API_URL']) ||
    environment.apiBaseUrl;
  return ssrUrl;
}

export const API_BASE_URL_PROVIDER = {
  provide: API_BASE_URL,
  useFactory: apiBaseUrlFactory,
};
