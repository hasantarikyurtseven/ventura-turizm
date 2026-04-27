import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginModalComponent } from '../../auth/login/login-modal.component';
import { AuthService, AuthUser } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset$!: Observable<boolean>;

  topBarItems = [
    { label: 'AirSearch Test', route: '/airsearch-test', icon: 'science' },
    { label: 'Yardım', route: '/help', icon: 'help_outline' },
    { label: 'Blog', route: '/blog', icon: 'article' }
  ];

  menuItems = [
    { label: 'Otel', route: '/hotels', icon: 'hotel' },
    { label: 'Tur', route: '/tours', icon: 'explore' },
    { label: 'Gemi', route: '/cruises', icon: 'directions_boat' },
    { label: 'Kıbrıs', route: '/cyprus', icon: 'beach_access' },
    { label: 'Uçak Bileti', route: '/flights', icon: 'flight', highlight: false },
    { label: 'Erken Rezervasyon', route: '/early-booking', icon: 'event', highlight: true },
    { label: 'Kampanyalar', route: '/campaigns', icon: 'local_offer' }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {}

  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'login-modal-panel',
      autoFocus: false
    });

    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window['grecaptcha'] && window['grecaptcha'].ready) {
          window['grecaptcha'].ready(() => {
            const recaptchaElements = document.querySelectorAll('.g-recaptcha');
            recaptchaElements.forEach((el: any) => {
              if (el && !el.hasAttribute('data-widget-id')) {
                const sitekey = el.getAttribute('data-sitekey');
                if (sitekey && window['grecaptcha'].render) {
                  window['grecaptcha'].render(el, {
                    sitekey: sitekey,
                    callback: (token: string) => {
                      // Token received
                    }
                  });
                }
              }
            });
          });
        }
      }, 500);
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserInitials(): string {
    const user = this.authService.currentUser;
    if (!user) return '';
    const f = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const l = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${f}${l}`;
  }
}
