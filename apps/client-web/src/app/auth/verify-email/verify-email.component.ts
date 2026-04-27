import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: false,
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  errorMessage = '';
  currentYear = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      this.errorMessage = 'Onay tokeni bulunamadı. Lütfen e-postanızdaki linke tekrar tıklayın.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.success;
        if (!res.success) {
          this.errorMessage = res.message || 'Doğrulama başarısız oldu.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.errorMessage = err?.error?.message || 'Onay linki geçersiz veya süresi dolmuş.';
      },
    });
  }
}
