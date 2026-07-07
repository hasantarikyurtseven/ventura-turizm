import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BiletbankApiService, MyReservationDto } from '../../core/biletbank-api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss',
  standalone: false,
})
export class MyReservationsComponent implements OnInit {
  isLoading = true;
  reservations: MyReservationDto[] = [];
  errorMessage = '';
  readonly emptyPassenger: any[] = [{ firstName: 'YOLCU', lastName: '', type: 'ADT' }];

  readonly isBrowser: boolean;

  constructor(
    private api: BiletbankApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.api.getMyReservations().subscribe({
      next: (res) => {
        this.reservations = res.reservations || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.status === 401) {
          // Token süresi dolmuş → çıkış yap ve login'e yönlendir
          this.authService.logout();
          this.router.navigate(['/giris'], {
            queryParams: { returnUrl: '/rezervasyonlarim' },
          });
          return;
        }
        this.errorMessage = this.extractErrorMessage(err);
      },
    });
  }

  private static readonly TR_MONTHS = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];
  private static readonly TR_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  /** "2026-06-21" → "21 Haz 2026, Cmt" (SSR güvenli, locale gerektirmez) */
  formatFlightDate(dateStr?: string): string {
    if (!dateStr) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
    if (!m) return dateStr;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    if (month < 0 || month > 11) return dateStr;
    const d = new Date(Date.UTC(year, month, day));
    const weekday = MyReservationsComponent.TR_DAYS[d.getUTCDay()];
    return `${day} ${MyReservationsComponent.TR_MONTHS[month]} ${year}, ${weekday}`;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { CONFIRMED: 'Onaylandı', CANCELLED: 'İptal', PENDING: 'Beklemede' };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { CONFIRMED: 'status-confirmed', CANCELLED: 'status-cancelled', PENDING: 'status-pending' };
    return map[status] ?? '';
  }

  goHome(): void { this.router.navigate(['/']); }
  goSearch(): void { this.router.navigate(['/']); }

  private extractErrorMessage(err: any): string {
    const body = err?.error;
    if (!body) return `Bağlantı hatası (${err?.status ?? 'bilinmiyor'})`;
    const msg = body?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.join(', ');
    if (err?.status === 403) return 'Bu sayfaya erişim yetkiniz yok.';
    try { return JSON.stringify(body); } catch { return 'Bilinmeyen hata oluştu.'; }
  }
}
