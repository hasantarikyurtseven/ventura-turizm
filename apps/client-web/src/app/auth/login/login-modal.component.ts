import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const MODAL_RECAPTCHA_ID = 'login-modal-recaptcha';
const RECAPTCHA_SITEKEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  standalone: false,
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  recaptchaToken: string | null = null;

  private widgetId: number | null = null;
  private recaptchaCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.ensureRecaptchaScript();
    this.scheduleRender();
  }

  ngOnDestroy(): void {
    if (this.recaptchaCheckInterval) {
      clearInterval(this.recaptchaCheckInterval);
      this.recaptchaCheckInterval = null;
    }
  }

  private ensureRecaptchaScript(): void {
    if (document.querySelector('script[src*="recaptcha/api.js"]') || window['grecaptcha']) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  private scheduleRender(): void {
    const el = document.getElementById(MODAL_RECAPTCHA_ID);
    if (!el) return;

    const tryRender = () => {
      if (typeof window['grecaptcha'] === 'undefined' || typeof window['grecaptcha'].render !== 'function') {
        return; // interval devam eder
      }
      if (this.recaptchaCheckInterval) {
        clearInterval(this.recaptchaCheckInterval);
        this.recaptchaCheckInterval = null;
      }
      // Daha önce render edilmişse reset edip yeniden render et
      if (el.hasAttribute('data-widget-id')) {
        try {
          window['grecaptcha'].reset(Number(el.getAttribute('data-widget-id')));
        } catch { /* ignore */ }
      }
      try {
        this.widgetId = window['grecaptcha'].render(MODAL_RECAPTCHA_ID, {
          sitekey: RECAPTCHA_SITEKEY,
          callback: (token: string) => {
            this.recaptchaToken = token;
          },
          'expired-callback': () => {
            this.recaptchaToken = null;
          },
        });
      } catch { /* already rendered */ }
    };

    this.recaptchaCheckInterval = setInterval(tryRender, 150);
    // 15 saniye sonra interval'ı temizle
    setTimeout(() => {
      if (this.recaptchaCheckInterval) {
        clearInterval(this.recaptchaCheckInterval);
        this.recaptchaCheckInterval = null;
      }
    }, 15000);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} zorunludur`;
    }

    if (field?.hasError('email')) {
      return 'Geçerli bir e-posta adresi giriniz';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `En az ${requiredLength} karakter olmalıdır`;
    }

    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'E-posta',
      password: 'Şifre'
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    // Callback tetiklenemediyse (auto-render veya race condition) getResponse ile son çare dene
    if (!this.recaptchaToken && typeof window !== 'undefined' && window['grecaptcha']) {
      try {
        const response = this.widgetId !== null
          ? window['grecaptcha'].getResponse(this.widgetId)
          : window['grecaptcha'].getResponse();
        if (response) this.recaptchaToken = response;
      } catch { /* ignore */ }
    }

    if (this.loginForm.valid && this.recaptchaToken) {
      this.isLoading = true;

      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.snackBar.open(
              `Hoş geldiniz, ${res.user.firstName}!`,
              'Kapat',
              { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' },
            );
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.isLoading = false;
          const message = err?.error?.message || 'Giriş yapılamadı. Lütfen tekrar deneyin.';
          this.snackBar.open(message, 'Kapat', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });

          // Hata sonrası reCAPTCHA sıfırla
          this.resetRecaptcha();
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      if (!this.recaptchaToken) {
        this.snackBar.open('Lütfen reCAPTCHA\'yı tamamlayın', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    }
  }

  private resetRecaptcha(): void {
    if (typeof window === 'undefined' || !window['grecaptcha']) return;
    try {
      if (this.widgetId !== null) {
        window['grecaptcha'].reset(this.widgetId);
      } else {
        window['grecaptcha'].reset();
      }
      this.recaptchaToken = null;
    } catch { /* ignore */ }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
