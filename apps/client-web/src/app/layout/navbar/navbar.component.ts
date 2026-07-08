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
    { label: 'Yardım', route: '/help', icon: 'help_outline' },
    { label: 'Blog', route: '/blog', icon: 'article' }
  ];

  menuItems: { label: string; route: string; icon: string; highlight?: boolean }[] = [];

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
    this.dialog.open(LoginModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'login-modal-panel',
      autoFocus: false
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
