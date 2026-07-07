import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../core/toast.service';
import { ContractModalComponent } from '../../shared/contract-modal/contract-modal.component';
import { AuthService } from '../../core/auth.service';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  registrationSuccess = false;
  successMessage = '';

  recaptchaToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
      acceptPrivacy: [false, [Validators.requiredTrue]],
      acceptMarketing: [false]
    }, {
      validators: this.passwordMatchValidator
    });

    // Load reCAPTCHA script
    if (typeof window !== 'undefined') {
      this.loadRecaptcha();
    }
  }

  ngAfterViewInit(): void {
    // Initialize reCAPTCHA after view init
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
        // Check if reCAPTCHA is already rendered
        const recaptchaElement = document.getElementById('register-recaptcha');
        if (recaptchaElement && !recaptchaElement.hasAttribute('data-widget-id')) {
          // reCAPTCHA not rendered, render it
          const sitekey = recaptchaElement.getAttribute('data-sitekey');
          if (sitekey && window['grecaptcha'].render) {
            try {
              window['grecaptcha'].render('register-recaptcha', {
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
        
        // Get response if already rendered
        const response = window['grecaptcha'].getResponse();
        if (response) {
          this.recaptchaToken = response;
        }
      });
    } else {
      // reCAPTCHA not loaded yet, wait and try again
      setTimeout(() => {
        this.initRecaptcha();
      }, 500);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
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
    
    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors?.['maxlength']?.requiredLength;
      return `En fazla ${requiredLength} karakter olabilir`;
    }
    
    if (field?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'Geçerli bir telefon numarası giriniz (10-11 haneli)';
      }
      if (fieldName === 'password') {
        return 'Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir';
      }
    }
    
    if (field?.hasError('passwordMismatch')) {
      return 'Şifreler eşleşmiyor';
    }
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'Ad',
      lastName: 'Soyad',
      phone: 'Telefon',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifre Tekrar'
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    // Get reCAPTCHA response
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

    if (this.registerForm.valid && this.recaptchaToken) {
      this.isLoading = true;

      const formValue = this.registerForm.value;
      this.authService.register({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        password: formValue.password,
        acceptTerms: formValue.acceptTerms,
        acceptPrivacy: formValue.acceptPrivacy,
        acceptMarketing: formValue.acceptMarketing || false,
      }).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.registrationSuccess = true;
          this.successMessage = res.message || 'Kayıt başarılı! E-posta adresinize onay linki gönderildi.';
        },
        error: (err) => {
          this.isLoading = false;
          const message = err?.error?.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
          this.toast.error(message, { duration: 6000 });
        },
      });
    } else {
      // Mark all fields as touched to show errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });

      if (!this.recaptchaToken) {
        this.toast.warning('Lütfen reCAPTCHA doğrulamasını tamamlayın');
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  openContractModal(slug: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.dialog.open(ContractModalComponent, {
      data: { slug },
      width: '720px',
      maxWidth: '92vw',
      maxHeight: '85vh',
    });
  }
}
