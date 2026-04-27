import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import {
  ReservationsService,
  Reservation,
  ReservationStats,
} from '../../services/reservations.service';
import { ReservationDetailComponent } from '../reservation-detail/reservation-detail.component';

@Component({
  selector: 'app-reservations-list',
  standalone: false,
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  stats: ReservationStats | null = null;
  totalRecords = 0;
  loading = false;
  page = 1;
  limit = 10;

  searchTerm = '';
  statusFilter = '';
  typeFilter = '';
  showFilters = false;

  displayedColumns: string[] = [
    'member',
    'type',
    'status',
    'totalAmount',
    'createdAt',
    'actions',
  ];

  statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'confirmed', label: 'Onaylandı' },
    { value: 'completed', label: 'Tamamlandı' },
    { value: 'cancelled', label: 'İptal Edildi' },
    { value: 'payment_failed', label: 'Ödeme Başarısız' },
  ];

  typeOptions = [
    { value: '', label: 'Tüm Türler' },
    { value: 'flight', label: 'Uçak' },
    { value: 'bus', label: 'Otobüs' },
    { value: 'tour', label: 'Tur' },
    { value: 'car_rental', label: 'Araç Kiralama' },
    { value: 'hotel', label: 'Otel' },
  ];

  constructor(
    private reservationsService: ReservationsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadReservations();
  }

  loadStats(): void {
    this.reservationsService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: () => {},
    });
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationsService
      .getReservations(
        this.page,
        this.limit,
        this.searchTerm || undefined,
        this.statusFilter || undefined,
        this.typeFilter || undefined,
      )
      .subscribe({
        next: (res) => {
          this.reservations = res.data;
          this.totalRecords = res.total;
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Rezervasyonlar yüklenemedi', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.loading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadReservations();
  }

  onSearch(): void {
    this.page = 1;
    this.loadReservations();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadReservations();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.page = 1;
    this.loadReservations();
  }

  hasActiveFilters(): boolean {
    return !!(this.statusFilter || this.typeFilter);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  openDetail(reservation: Reservation): void {
    this.reservationsService.getReservation(reservation._id).subscribe({
      next: (full) => {
        this.dialog.open(ReservationDetailComponent, {
          data: full,
          width: 'min(920px, calc(100vw - 24px))',
          maxHeight: '90vh',
          panelClass: 'reservation-detail-dialog',
          autoFocus: 'dialog',
        });
      },
      error: () => {
        this.snackBar.open('Rezervasyon detayı yüklenemedi', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

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

  statusClass(status: string): string {
    return (status || '').toLowerCase();
  }
}
