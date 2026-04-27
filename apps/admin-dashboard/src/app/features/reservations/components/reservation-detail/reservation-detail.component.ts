import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Passenger, Reservation } from '../../services/reservations.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: false,
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
})
export class ReservationDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<ReservationDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public reservation: Reservation,
    private snackBar: MatSnackBar,
  ) {}

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      flight: 'Uçak',
      bus: 'Otobüs',
      tour: 'Tur',
      car_rental: 'Araç Kiralama',
      car: 'Araç Kiralama',
      hotel: 'Otel',
    };
    return map[type] ?? type;
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      flight: 'flight',
      bus: 'directions_bus',
      tour: 'tour',
      car_rental: 'directions_car',
      car: 'directions_car',
      hotel: 'hotel',
    };
    return map[type] ?? 'event_seat';
  }

  getStatusLabel(status: string): string {
    const key = (status || '').toLowerCase();
    const map: Record<string, string> = {
      pending: 'Beklemede',
      confirmed: 'Onaylandı',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
      payment_failed: 'Ödeme Başarısız',
    };
    return map[key] ?? status;
  }

  initials(p: Passenger): string {
    const a = (p.firstName || '').trim().charAt(0);
    const b = (p.lastName || '').trim().charAt(0);
    return (a + b || '?').toUpperCase();
  }

  /** Cinsiyet veya client-api yolcu tipi (ADT/CHD/INF) */
  passengerDemographic(p: Passenger): string {
    const g = (p.gender || '').toUpperCase();
    if (g === 'M' || p.gender === 'male') return 'Erkek';
    if (g === 'F' || p.gender === 'female') return 'Kadın';
    if (p.passengerType) {
      const m: Record<string, string> = {
        ADT: 'Yetişkin',
        CHD: 'Çocuk',
        INF: 'Bebek',
      };
      return m[p.passengerType] || p.passengerType;
    }
    return '—';
  }

  getPaymentMethodLabel(method?: string): string {
    if (!method) return '—';
    const map: Record<string, string> = {
      credit_card: 'Kredi Kartı',
      bank_transfer: 'Banka Havalesi',
      cash: 'Nakit',
    };
    return map[method] ?? method;
  }

  statusClass(status: string): string {
    return (status || '').toLowerCase();
  }

  copyReservationNo(): void {
    const code = this.reservation?.reservationNo || '';
    if (!code || typeof navigator === 'undefined' || !navigator.clipboard) {
      this.snackBar.open('Kopyalanamadı', 'Tamam', { duration: 2500 });
      return;
    }
    navigator.clipboard.writeText(code).then(
      () => this.snackBar.open('Rezervasyon kodu kopyalandı', 'Tamam', { duration: 2000 }),
      () => this.snackBar.open('Kopyalanamadı', 'Tamam', { duration: 2500 }),
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
