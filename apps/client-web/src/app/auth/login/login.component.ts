import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  recaptchaToken: string | null = null;
  private returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Giriş sonrası dönülecek URL'yi al; güvenlik için mutlaka / ile başlamalı
    const raw = this.route.snapshot.queryParams['returnUrl'] ?? '/';
    this.returnUrl = typeof raw === 'string' && raw.startsWith('/') ? raw : '/';

    // Zaten giriş yapmışsa yönlendir
    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    if (typeof window !== 'undefined') {
      this.loadRecaptcha();
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.initRecaptcha();
      }, 1000);
    }
  }

  loadRecaptcha(): void {
    if (typeof window !== 'undefined' && !window['grecaptcha']) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  initRecaptcha(): void {
    if (typeof window !== 'undefined' && window['grecaptcha']) {
      window['grecaptcha'].ready(() => {
        const recaptchaElement = document.getElementById('login-recaptcha');
        if (recaptchaElement && !recaptchaElement.hasAttribute('data-widget-id')) {
          const sitekey = recaptchaElement.getAttribute('data-sitekey');
          if (sitekey && window['grecaptcha'].render) {
            try {
              window['grecaptcha'].render('login-recaptcha', {
                sitekey: sitekey,
                callback: (token: string) => {
                  this.recaptchaToken = token;
                }
              });
            } catch (e) {
              // ignore
            }
          }
        }

        const response = window['grecaptcha'].getResponse();
        if (response) {
          this.recaptchaToken = response;
        }
      });
    } else {
      setTimeout(() => {
        this.initRecaptcha();
      }, 500);
    }
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
    if (typeof window !== 'undefined' && window['grecaptcha']) {
      try {
        const response = window['grecaptcha'].getResponse();
        if (response) {
          this.recaptchaToken = response;
        }
      } catch (e) {
        // ignore
      }
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
            this.router.navigateByUrl(this.returnUrl);
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

          // reCAPTCHA'yı sıfırla
          if (typeof window !== 'undefined' && window['grecaptcha']) {
            try {
              window['grecaptcha'].reset();
              this.recaptchaToken = null;
            } catch (e) {
              // ignore
            }
          }
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

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
