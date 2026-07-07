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

  resendEmail = '';
  resendLoading = false;
  resendDone = false;
  resendMessage = '';

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
        const raw = err?.error?.message;
        this.errorMessage =
          typeof raw === 'string' ? raw
          : typeof raw?.message === 'string' ? raw.message
          : 'Onay linki geçersiz veya süresi dolmuş.';
      },
    });
  }

  resendVerification(): void {
    const email = this.resendEmail.trim();
    if (!email) return;

    this.resendLoading = true;
    this.resendMessage = '';

    this.authService.resendVerificationEmail(email).subscribe({
      next: (res) => {
        this.resendLoading = false;
        this.resendDone = true;
        this.resendMessage = res.message || 'Onay linki gönderildi. Lütfen e-postanızı kontrol edin.';
      },
      error: () => {
        this.resendLoading = false;
        this.resendMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      },
    });
  }
}
