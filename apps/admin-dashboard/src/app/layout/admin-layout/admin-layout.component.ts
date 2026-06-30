import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AdminNotificationsApiService } from '../../core/services/admin-notifications-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  command?: () => void;
}

interface Notification {
  id: string;
  message: string;
  icon: string;
  time: string;
  read: boolean;
}

interface Message {
  id: string;
  senderName: string;
  senderSurname: string;
  preview: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: false
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentRoute: string = '';
  hasMessages = false;

  notifications: Notification[] = [];
  messages: Message[] = [];

  private notificationPollId?: ReturnType<typeof setInterval>;
  private readonly notificationPollMs = 45_000;

  reservationMenuItems: MenuItem[] = [
    {
      label: 'Tamamlanan Rezervasyonlar',
      icon: 'check_circle',
      command: () => this.router.navigate(['/reservations'])
    }
  ];

  settingsMenuItems: MenuItem[] = [
    {
      label: 'Kullanıcılar',
      icon: 'people',
      command: () => this.router.navigate(['/users'])
    },
    {
      label: 'Roller',
      icon: 'shield',
      command: () => this.router.navigate(['/roles'])
    },
    {
      label: 'Yetkiler',
      icon: 'vpn_key',
      command: () => this.router.navigate(['/permissions'])
    },
    {
      label: 'Havayolları',
      icon: 'flight',
      command: () => this.router.navigate(['/airlines'])
    },
    {
      label: 'Ülkeler',
      icon: 'public',
      command: () => this.router.navigate(['/countries'])
    },
    {
      label: 'Sözleşmeler',
      icon: 'description',
      command: () => this.router.navigate(['/contracts'])
    }
  ];

  profileMenuItems: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private adminNotificationsApi: AdminNotificationsApiService,
  ) {
    // Track current route for active state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
    this.currentRoute = this.router.url;
    // Subscribe to user changes to update profile menu
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileMenuItems = [
          {
            label: 'Profil',
            icon: 'account_circle',
            command: () => this.router.navigate(['/users/profile'])
          },
          {
            label: 'Çıkış Yap',
            icon: 'logout',
            command: () => this.onLogout()
          }
        ];
      }
    });
  }

  getInitials(name: string | undefined, surname: string | undefined): string {
    if (!name && !surname) return '';
    const n = name ? name.charAt(0).toUpperCase() : '';
    const s = surname ? surname.charAt(0).toUpperCase() : '';
    return `${n}${s}`;
  }

  ngOnInit() {
    this.loadNotifications();
    this.notificationPollId = setInterval(() => this.loadNotifications(), this.notificationPollMs);
  }

  ngOnDestroy() {
    if (this.notificationPollId) {
      clearInterval(this.notificationPollId);
    }
  }

  private loadNotifications(): void {
    this.adminNotificationsApi.list(40).subscribe({
      next: (items) => {
        this.notifications = items.map((n) => ({
          id: n.id,
          message: n.message,
          icon: n.icon || 'notifications',
          time: n.time,
          read: n.read,
        }));
      },
      error: () => {
        /* Oturum yok / ağ: sessiz */
      },
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  isReservationPageActive(): boolean {
    return this.currentRoute.startsWith('/reservations');
  }

  isSettingsPageActive(): boolean {
    return this.currentRoute.startsWith('/users') ||
           this.currentRoute.startsWith('/roles') ||
           this.currentRoute.startsWith('/permissions') ||
           this.currentRoute.startsWith('/airlines') ||
           this.currentRoute.startsWith('/countries') ||
           this.currentRoute.startsWith('/contracts');
  }

  markAllNotificationsRead(): void {
    this.adminNotificationsApi.markAllRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.read = true));
      },
      error: () => {
        this.notifications.forEach((n) => (n.read = true));
      },
    });
  }

  markAllMessagesRead(): void {
    this.messages.forEach(m => m.read = true);
    this.hasMessages = false;
    // TODO: Call message service
  }

  viewAllNotifications(): void {
    void this.router.navigate(['/reservations']);
  }

  viewAllMessages(): void {
    // TODO: Navigate to messages page
    console.log('View all messages');
  }

  getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getUnreadMessageCount(): number {
    return this.messages.filter(m => !m.read).length;
  }
}
