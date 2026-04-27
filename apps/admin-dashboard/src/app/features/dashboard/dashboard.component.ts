import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DashboardService,
  DashboardStatistics,
  RecentActivity,
  DashboardRecentReservation,
  DashboardRecentMember,
} from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  loading = false;

  /** Üst hoş geldin bildirim şeridi */
  welcomeBannerVisible = true;
  welcomeBannerExiting = false;
  private welcomeDismissTimer?: ReturnType<typeof setTimeout>;
  private welcomeExitAnimTimer?: ReturnType<typeof setTimeout>;
  private readonly welcomeAutoHideMs = 7000;
  private readonly welcomeExitDurationMs = 400;

  stats: DashboardStatistics = {
        totalMembers: 0,
    totalReservations: 0,
    totalRevenue: 0,
    faultyReservations: 0,
  };

  recentActivities: RecentActivity[] = [];
  displayedColumns: string[] = ['action', 'user', 'entity', 'time', 'status'];

  recentReservations: DashboardRecentReservation[] = [];
  reservationColumns: string[] = [
    'customer',
    'type',
    'status',
    'amount',
    'date',
  ];
  reservationsLoading = false;

  recentMembers: DashboardRecentMember[] = [];
  memberColumns: string[] = ['customer', 'phone', 'status', 'date'];
  membersLoading = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadStatistics();
    this.loadRecentActivities();
    this.loadRecentReservations();
    this.loadRecentMembers();
    this.scheduleWelcomeBannerAutoHide();
  }

  ngOnDestroy() {
    this.clearWelcomeBannerTimers();
  }

  private clearWelcomeBannerTimers() {
    if (this.welcomeDismissTimer) clearTimeout(this.welcomeDismissTimer);
    if (this.welcomeExitAnimTimer) clearTimeout(this.welcomeExitAnimTimer);
  }

  private scheduleWelcomeBannerAutoHide() {
    this.clearWelcomeBannerTimers();
    this.welcomeDismissTimer = setTimeout(() => {
      this.beginWelcomeBannerExit();
    }, this.welcomeAutoHideMs);
  }

  private beginWelcomeBannerExit() {
    if (!this.welcomeBannerVisible) return;
    this.welcomeBannerExiting = true;
    this.welcomeExitAnimTimer = setTimeout(() => {
      this.welcomeBannerVisible = false;
      this.welcomeBannerExiting = false;
    }, this.welcomeExitDurationMs);
  }

  closeWelcomeBanner() {
    this.clearWelcomeBannerTimers();
    this.beginWelcomeBannerExit();
  }

  loadStatistics() {
    this.loading = true;
    this.dashboardService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
  }

  loadRecentActivities() {
    this.dashboardService.getRecentActivities().subscribe({
      next: (data) => {
        this.recentActivities = data;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
      }
    });
  }

  loadRecentReservations() {
    this.reservationsLoading = true;
    this.dashboardService.getRecentReservations(8).subscribe({
      next: (data) => {
        this.recentReservations = data;
        this.reservationsLoading = false;
      },
      error: () => {
        this.reservationsLoading = false;
      },
    });
  }

  loadRecentMembers() {
    this.membersLoading = true;
    this.dashboardService.getRecentMembers(8).subscribe({
      next: (data) => {
        this.recentMembers = data;
        this.membersLoading = false;
      },
      error: () => {
        this.membersLoading = false;
      },
    });
  }

  getMemberStatusLabel(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'Aktif';
      case 'pending':
        return 'Beklemede';
      case 'suspended':
        return 'Askıda';
      default:
        return status;
    }
  }

  memberStatusClass(status: string): string {
    return (status || '').toLowerCase();
  }

  getReservationTypeLabel(type: string): string {
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

  getReservationStatusLabel(status: string): string {
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

  reservationStatusClass(status: string): string {
    return (status || '').toLowerCase();
  }
}
