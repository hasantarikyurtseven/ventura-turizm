import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import {
  BiletbankApiService,
  UpdatePassengerItemDto,
  UpdatePassengerRequestDto,
  MakePrebookingRequestDto,
  AllocatePaxRefDto,
} from '../../core/biletbank-api.service';
import { firstValueFrom } from 'rxjs';

interface BrandOption {
  id: string;
  brandId?: string;
  brandName?: string;
  brandCode?: string;
  baggageAllowanceId?: number;
  baggageDescription?: string;
  rules?: {
    application?: string;
    displayType?: string;
    ruleDescription?: string;
    serviceGroup?: string;
  }[];
  totalFare: number;
  totalTaxes: number;
  currency: string;
}

interface BookingData {
  allocateId?: string;
  allocateProductId?: string;
  productId?: string;
  sessionId?: string;
  sessionToken?: string;
  shoppingFileId?: string;
  brandedFareItemId?: string;
  paxReferences?: AllocatePaxRefDto[];
  selectedBrand?: {
    id: string;
    brandName?: string;
    brandCode?: string;
    totalFare: number;
    totalTaxes?: number;
    currency: string;
    baggageDescription?: string;
  };
  flight?: {
    id: string;
    airline: string;
    flightNumber: string;
    departure: {
      airportCode: string;
      time: string;
      date: string;
    };
    arrival: {
      airportCode: string;
      time: string;
      date: string;
    };
    duration: string;
    price: number;
    currency: string;
  };
  allBrandOptions?: BrandOption[]; // Tüm paket seçenekleri
  correlationId?: string;
  timestamp?: string;
}

/** Rezervasyon oturum süresi (dakika) - BiletBank session timeout ile uyumlu */
const BOOKING_SESSION_MINUTES = 15;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  standalone: false,
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('packageCardsWrapper', { static: false }) packageCardsWrapper!: ElementRef<HTMLDivElement>;
  
  bookingForm!: FormGroup;
  isLoading = false;
  isChangingPackage = false; // Paket değiştirme işlemi devam ediyor mu?
  bookingData: BookingData | null = null;
  isBrowser: boolean;
  packageScrollLeft = 0;
  packageMaxScroll = 0;
  packageScrollRight = 0;

  /** Rezervasyon geri sayımı (örn: "14:32") */
  countdownDisplay = '';
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private api: BiletbankApiService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Form'u her zaman oluştur (SSR için gerekli)
    this.bookingForm = this.fb.group({
      contactInfo: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      }),
      passengers: this.fb.array([
        this.createPassengerForm(),
      ]),
    });

    // SSR kontrolü - sadece browser'da sessionStorage ve navigation işlemleri yap
    if (!this.isBrowser) {
      return;
    }

    // SessionStorage'dan booking bilgilerini al
    const stored = sessionStorage.getItem('booking_allocate_data');
    if (!stored) {
      this.snackBar.open('Rezervasyon bilgileri bulunamadı. Lütfen tekrar uçuş seçin.', 'Tamam', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/flight-results']);
      return;
    }

    try {
      this.bookingData = JSON.parse(stored);
    } catch (e) {
      this.snackBar.open('Rezervasyon bilgileri geçersiz. Lütfen tekrar uçuş seçin.', 'Tamam', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/flight-results']);
      return;
    }

    // Oturum süresi kontrolü: 15 dakikadan eski veri varsa temizle
    if (this.bookingData?.timestamp) {
      const savedAt = new Date(this.bookingData.timestamp).getTime();
      const ageMinutes = (Date.now() - savedAt) / 60000;
      if (ageMinutes > BOOKING_SESSION_MINUTES) {
        sessionStorage.removeItem('booking_allocate_data');
        sessionStorage.removeItem('booking_payment_data');
        this.snackBar.open(
          'Rezervasyon oturumu süresi dolmuş. Lütfen yeni bir uçuş araması yapın.',
          'Tamam',
          { duration: 6000, panelClass: ['warning-snackbar'] },
        );
        this.router.navigate(['/']);
        return;
      }
    }

    // Giriş kontrolü
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Rezervasyon yapmak için giriş yapmalısınız.', 'Giriş Yap', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      });
      return;
    }

    // Kullanıcı bilgilerini doldur (varsa)
    const user = this.authService.currentUser;
    if (user) {
      this.bookingForm.patchValue({
        contactInfo: {
          email: user.email || '',
          phone: '',
        },
      });
    }

    // Rezervasyon sayacını başlat
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  /** Rezervasyon sayacını başlat */
  private startCountdown(): void {
    if (!this.isBrowser || !this.bookingData) return;
    this.stopCountdown();
    const sessionMs = BOOKING_SESSION_MINUTES * 60 * 1000;
    const startTime = this.bookingData.timestamp ? new Date(this.bookingData.timestamp).getTime() : Date.now();
    const update = () => {
      const remaining = Math.max(0, Math.floor((startTime + sessionMs - Date.now()) / 1000));
      if (remaining <= 0) {
        this.onSessionExpired();
        return;
      }
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      this.countdownDisplay = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  /** Oturum süresi dolduğunda: sessionStorage temizle, anasayfaya yönlendir */
  private onSessionExpired(): void {
    this.stopCountdown();
    this.countdownDisplay = '00:00';
    if (this.isBrowser) {
      sessionStorage.removeItem('booking_allocate_data');
      this.snackBar.open('Rezervasyon süreniz doldu. Lütfen tekrar uçuş arayıp seçin.', 'Tamam', {
        duration: 6000,
        panelClass: ['warning-snackbar'],
      });
      this.router.navigate(['/']);
    }
  }

  createPassengerForm(): FormGroup {
    const group = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      idType: ['TC', [Validators.required]],
      idNumber: ['', [Validators.required, Validators.minLength(5)]],
      passportValidDate: [''],
      passportCountry: ['TR'],
    });
    group.get('idType')?.valueChanges.subscribe(() => {
      group.get('passportValidDate')?.updateValueAndValidity();
    });
    group.get('passportValidDate')?.setValidators([
      (ctrl) => (group.get('idType')?.value === 'PASSPORT' && !ctrl.value ? { required: true } : null),
    ]);
    return group;
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  get contactInfo(): FormGroup {
    return this.bookingForm.get('contactInfo') as FormGroup;
  }

  get selectedFlight() {
    return this.bookingData?.flight || null;
  }

  get selectedBrand() {
    return this.bookingData?.selectedBrand || null;
  }

  get allBrandOptions(): BrandOption[] {
    return this.bookingData?.allBrandOptions || [];
  }

  /** Sayaç 5 dakikanın altına indiğinde uyarı stili */
  get isCountdownWarning(): boolean {
    if (!this.countdownDisplay) return false;
    const [m, s] = this.countdownDisplay.split(':').map(Number);
    return (m * 60 + (s || 0)) < 300;
  }

  /** Paket seçeneklerini göster (seçili paket hariç) */
  get availablePackages(): BrandOption[] {
    if (!this.allBrandOptions.length || !this.selectedBrand) {
      return this.allBrandOptions;
    }
    // Seçili paketi listeden çıkar
    return this.allBrandOptions.filter(brand => brand.id !== this.selectedBrand?.id);
  }

  private static readonly BRAND_LABEL_MAP: Record<string, string> = {
    ECO: 'Ekonomi', ECONOMY: 'Ekonomi', SUPER_ECO: 'Süper Ekonomi',
    SUPER_ECONOMY: 'Süper Ekonomi', BASIC: 'Temel', BASIC_ECONOMY: 'Temel Ekonomi',
    ADVANTAGE: 'Avantaj', EXTRA: 'Ekstra', COMFORT: 'Konfor',
    COMFORT_FLEX: 'Konfor Flex', BUSINESS: 'Business', BUSINESS_FLEX: 'Business Flex',
    PREMIUM: 'Premium', PREMIUM_ECO: 'Premium Ekonomi', FLEX: 'Esnek', PROMO: 'Promosyon',
  };

  private static readonly RULE_TR: Record<string, string> = {
    'NONCHANGEABLE': 'Değişiklik yapılamaz',
    'NONREFUNDABLE': 'İade edilmez',
    'ONLINE MESSAGE RIGHT': 'Çevrimiçi mesaj hakkı',
    'CHANGE WITH PENALTY': 'Ücret karşılığında değişiklik',
    'CHANGE WITHOUT PENALTY': 'Ücretsiz değişiklik',
    'REFUND WITH PENALTY': 'Ücret karşılığında iade',
    'REFUND WITHOUT PENALTY': 'Ücretsiz iade',
    'STANDARD SEAT SELECTION': 'Standart koltuk seçimi',
    'FRONT SEAT SELECTION': 'Ön koltuk seçimi',
    'PREFERRED SEAT SELECTION': 'Tercihli koltuk seçimi',
    '25 PERCENT EXTRA MILES': '%25 ekstra mil',
    '50 PERCENT EXTRA MILES': '%50 ekstra mil',
    'LOUNGE USE IF AVAILABLE': 'Salon kullanımı (müsaitse)',
    'INTERNET PACKAGE RIGHT': 'İnternet paketi hakkı',
    'PRIORITY CHECK IN': 'Öncelikli check-in',
    'PRIORITY BOARDING': 'Öncelikli biniş',
    'FAST TRACK IF AVAILABLE': 'Hızlı geçiş (müsaitse)',
    'SAMEDAY CHANGE TO EARLY FLIGHT': 'Aynı gün erken uçuşa değişiklik',
    'Non-refundable': 'İade edilmez',
    'Refundable': 'İade edilebilir',
    'Changeable Ticket': 'Değiştirilebilir bilet',
    'Refundable Ticket': 'İade edilebilir bilet',
    'Non-refundable Ticket': 'İade edilmez bilet',
    'Seat Selection': 'Koltuk seçimi',
    'Seat selection': 'Koltuk seçimi',
    'No seat selection': 'Koltuk seçimi dahil değil',
    'Standard seat': 'Standart koltuk',
    'Extra legroom seat': 'Ekstra bacak mesafeli koltuk',
    'Priority Boarding': 'Öncelikli biniş',
    'Standard boarding': 'Standart biniş',
    'Meal Service': 'Yemek servisi',
    'No meal': 'Yemek dahil değil',
    'Carry On Baggage': 'El bagajı',
    'Checked Baggage': 'Bagaj hakkı',
    'No Carry On Baggage': 'El bagajı dahil değil',
    'No Checked Baggage': 'Bagaj hakkı yok',
    'In-flight Entertainment': 'Uçuş içi eğlence',
    'Included': 'Dahil',
    'Not included': 'Dahil değil',
    'Free': 'Ücretsiz',
    'Chargeable': 'Ücretli',
    'Optional': 'İsteğe bağlı',
  };

  /** Paket adını göster */
  getBrandDisplayName(brand: BrandOption | { brandName?: string; brandCode?: string } | null | undefined): string {
    if (!brand) return 'Standart Paket';
    const raw = (brand.brandName || brand.brandCode || '').trim().toUpperCase();
    return BookingComponent.BRAND_LABEL_MAP[raw] || brand.brandName?.trim() || brand.brandCode?.trim() || 'Standart Paket';
  }

  /** Kural açıklamasını Türkçeye çevirir */
  translateRule(rule: { ruleDescription?: string; displayType?: string }): string {
    const raw = (rule.ruleDescription || rule.displayType || '').trim();
    if (!raw) return '';
    const upper = raw.toUpperCase();
    for (const [key, val] of Object.entries(BookingComponent.RULE_TR)) {
      if (key.toUpperCase() === upper) return val;
    }
    const exact = BookingComponent.RULE_TR[raw];
    if (exact) return exact;
    let result = raw;
    result = result.replace(/\bNONCHANGEABLE\b/gi, 'Değişiklik yapılamaz');
    result = result.replace(/\bNONREFUNDABLE\b/gi, 'İade edilmez');
    result = result.replace(/\bONLINE MESSAGE RIGHT\b/gi, 'Çevrimiçi mesaj hakkı');
    result = result.replace(/\bCHANGE WITH PENALTY\b/gi, 'Ücret karşılığında değişiklik');
    result = result.replace(/\bCHANGE WITHOUT PENALTY\b/gi, 'Ücretsiz değişiklik');
    result = result.replace(/\bREFUND WITH PENALTY\b/gi, 'Ücret karşılığında iade');
    result = result.replace(/\bREFUND WITHOUT PENALTY\b/gi, 'Ücretsiz iade');
    result = result.replace(/\bSTANDARD SEAT SELECTION\b/gi, 'Standart koltuk seçimi');
    result = result.replace(/\bFRONT SEAT SELECTION\b/gi, 'Ön koltuk seçimi');
    result = result.replace(/\bPREFERRED SEAT SELECTION\b/gi, 'Tercihli koltuk seçimi');
    result = result.replace(/\b25 PERCENT EXTRA MILES\b/gi, '%25 ekstra mil');
    result = result.replace(/\b50 PERCENT EXTRA MILES\b/gi, '%50 ekstra mil');
    result = result.replace(/\bLOUNGE USE IF AVAILABLE\b/gi, 'Salon kullanımı (müsaitse)');
    result = result.replace(/\bINTERNET PACKAGE RIGHT\b/gi, 'İnternet paketi hakkı');
    result = result.replace(/\bPRIORITY CHECK IN\b/gi, 'Öncelikli check-in');
    result = result.replace(/\bPRIORITY BOARDING\b/gi, 'Öncelikli biniş');
    result = result.replace(/\bFAST TRACK IF AVAILABLE\b/gi, 'Hızlı geçiş (müsaitse)');
    result = result.replace(/\bSAMEDAY CHANGE TO EARLY FLIGHT\b/gi, 'Aynı gün erken uçuşa değişiklik');
    result = result.replace(/X\s*(\d+)\s*KG\s+CABIN\s+Bagaj/gi, '$1 kg kabin bagajı');
    result = result.replace(/(\d+)\s*KG\s+CABIN\s+Bagaj/gi, '$1 kg kabin bagajı');
    result = result.replace(/(\d+)\s*KG\s+BAGGAGE\s+ALLOWANCE/gi, '$1 kg bagaj hakkı');
    result = result.replace(/(\d+)\s*PIECE[S]?\s*X\s*(\d+)\s*KG\s+CABIN\s+Bagaj/gi, '$1 adet $2 kg kabin bagajı');
    result = result.replace(/\bBaggage\b/gi, 'Bagaj');
    result = result.replace(/\bAllowance\b/gi, 'hakkı');
    result = result.replace(/\bPIECE[S]?\b/gi, 'adet');
    result = result.replace(/\bCABIN\b/gi, 'kabin');
    result = result.replace(/\bSeat Selection\b/gi, 'Koltuk seçimi');
    result = result.replace(/\bCarry On\b/gi, 'El bagajı');
    result = result.replace(/\bChecked\b/gi, 'kayıtlı');
    return result.trim();
  }

  /** Paket seçildiğinde */
  async selectPackage(brand: BrandOption): Promise<void> {
    if (!this.bookingData || !this.selectedFlight) {
      return;
    }

    // Giriş kontrolü
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Paket değiştirmek için lütfen giriş yapın.', 'Giriş Yap', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      });
      return;
    }

    // Aynı paket seçiliyse işlem yapma
    if (this.selectedBrand?.id === brand.id) {
      return;
    }

    this.isChangingPackage = true;

    try {
      // Yeni paketle Allocate işlemi yap
      const allocateResult = await firstValueFrom(this.api.allocate({
        productId: this.selectedFlight.id,
        brandedFareItemId: brand.id,
        sessionId: this.bookingData.sessionId!,
        sessionToken: this.bookingData.sessionToken!,
        shoppingFileId: this.bookingData.shoppingFileId!,
        selectedServiceFeeAmount: 0,
      }));

      if (allocateResult?.success) {
        // Booking data'yı güncelle
        this.bookingData.allocateId = allocateResult.allocateId;
        this.bookingData.allocateProductId = allocateResult.productId;
        this.bookingData.paxReferences = allocateResult.paxReferences || [];
        this.bookingData.brandedFareItemId = brand.id;
        // selectedBrand için sadece gerekli alanları kaydet (BrandOption değil, daha basit bir yapı)
        this.bookingData.selectedBrand = {
          id: brand.id,
          brandName: brand.brandName,
          brandCode: brand.brandCode,
          totalFare: brand.totalFare,
          totalTaxes: brand.totalTaxes || 0,
          currency: brand.currency,
          baggageDescription: brand.baggageDescription,
        };
        this.bookingData.correlationId = allocateResult.correlationId;
        this.bookingData.timestamp = new Date().toISOString();

        // SessionStorage'ı güncelle
        if (this.isBrowser) {
          sessionStorage.setItem('booking_allocate_data', JSON.stringify(this.bookingData));
        }

        // Paket değişince sayacı yeniden başlat
        this.startCountdown();

        this.snackBar.open(
          `✓ ${this.getBrandDisplayName(brand)} paketi seçildi.`,
          'Tamam',
          {
            duration: 3000,
            panelClass: ['success-snackbar'],
          }
        );
      } else {
        throw new Error(allocateResult?.message || 'Paket değiştirilemedi');
      }
    } catch (error: any) {
      // 401 Unauthorized hatası - token geçersiz veya süresi dolmuş
      if (error?.status === 401 || error?.error?.statusCode === 401) {
        this.snackBar.open(
          'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
          'Giriş Yap',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        ).onAction().subscribe(() => {
          this.authService.logout();
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        });
      } else {
        this.snackBar.open(
          error?.error?.message || error?.message || 'Paket değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.',
          'Kapat',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    } finally {
      this.isChangingPackage = false;
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.packageCardsWrapper) {
      this.updatePackageScroll();
    }
  }

  /** Paket carousel scroll güncellemesi */
  updatePackageScroll(): void {
    if (!this.isBrowser || !this.packageCardsWrapper) return;
    const element = this.packageCardsWrapper.nativeElement;
    this.packageScrollLeft = element.scrollLeft;
    this.packageMaxScroll = element.scrollWidth - element.clientWidth;
    this.packageScrollRight = this.packageMaxScroll - this.packageScrollLeft;
  }

  /** Paket carousel scroll */
  scrollPackages(direction: number): void {
    if (!this.isBrowser || !this.packageCardsWrapper) return;
    const element = this.packageCardsWrapper.nativeElement;
    const scrollAmount = 400; // Her scroll'da 400px kaydır
    const newScrollLeft = element.scrollLeft + (direction * scrollAmount);
    element.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    
    // Scroll sonrası güncelle
    setTimeout(() => this.updatePackageScroll(), 300);
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.markFormGroupTouched(this.bookingForm);
      const invalidLabels = this.getInvalidFieldLabels();
      const msg = invalidLabels.length
        ? `Eksik veya hatalı alanlar: ${invalidLabels.join(', ')}`
        : 'Lütfen tüm alanları doğru şekilde doldurun.';
      this.snackBar.open(msg, 'Tamam', {
        duration: 6000,
        panelClass: ['error-snackbar'],
      });
      this.scrollToFirstInvalidControl();
      return;
    }

    if (!this.bookingData) {
      this.snackBar.open('Rezervasyon bilgileri bulunamadı.', 'Tamam', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;

    const contactInfo = this.bookingForm.get('contactInfo')?.value;
    const passengersArray = this.bookingForm.get('passengers')?.value || [];

    // Pasaport kullanıyorsa geçerlilik tarihi zorunlu
    const invalidPassportIdx = passengersArray.findIndex(
      (p: any) => p.idType === 'PASSPORT' && !p.passportValidDate,
    );
    if (invalidPassportIdx >= 0) {
      this.markFormGroupTouched(this.bookingForm);
      this.snackBar.open(
        `Yolcu ${invalidPassportIdx + 1}: Pasaport geçerlilik tarihi gereklidir.`,
        'Tamam',
        { duration: 5000, panelClass: ['error-snackbar'] },
      );
      this.scrollToFirstInvalidControl(invalidPassportIdx);
      this.isLoading = false;
      return;
    }

    // Allocate response'undan gelen PaxReference haritası (sequenceNo → paxRef)
    const paxRefMap = new Map<number, AllocatePaxRefDto>();
    for (const ref of (this.bookingData.paxReferences || [])) {
      if (ref.localSequenceNo != null) {
        paxRefMap.set(ref.localSequenceNo, ref);
      }
    }

    const newPassengers: UpdatePassengerItemDto[] = passengersArray.map(
      (p: any, index: number) => {
        const sequenceNo = index + 1;
        const isTc = p.idType === 'TC';
        // Allocate response'undan PaxReferenceId al (varsa TempTag olarak kullan)
        const paxRef = paxRefMap.get(sequenceNo);
        const tempTagId = paxRef?.paxReferenceId || crypto.randomUUID();
        const passengerId = crypto.randomUUID();
        const birthDate = this.formatDateForApi(p.birthDate);
        const citizenNo = isTc
          ? String(p.idNumber || '').replace(/\D/g, '').slice(0, 11).padStart(11, '0')
          : '00000000000';
        // Yurt içi TC: BiletBank TCKN ve PassportNo beraber kabul etmiyor. TC için passportNo=00000000000
        const passportNo = isTc ? '00000000000' : String(p.idNumber || '').trim();
        const pax: UpdatePassengerItemDto = {
          birthDate: birthDate || '1990-01-01',
          citizenNo: citizenNo || '00000000000',
          email: (contactInfo?.email || '').trim(),
          firstName: (p.firstName || '').trim(),
          gender: p.gender === 'M' || p.gender === 'F' ? p.gender : 'M',
          id: passengerId,
          ifContact: index === 0,
          lastName: (p.lastName || '').trim(),
          nationality: 'TR',
          passportCountry: (p.passportCountry || 'TR').toUpperCase().slice(0, 2) || 'TR',
          passportNo: passportNo || 'P00000000',
          phone: this.formatPhoneForApi(contactInfo?.phone || ''),
          sequenceNo,
          tempTag: tempTagId,
          type: 'ADT',
          wheelChairServiceType: 0,
        };
        const pvd = !isTc && p.passportValidDate ? this.formatDateForApi(p.passportValidDate) : null;
        if (pvd && pvd.length === 10) (pax as any).passportValidDate = pvd;
        return pax;
      },
    );

    const invalidPassenger = newPassengers.find(
      (np) => !np.birthDate || !np.email || !np.firstName || !np.lastName || !np.phone,
    );
    if (invalidPassenger) {
      this.isLoading = false;
      this.snackBar.open('Lütfen tüm yolcu bilgilerini doldurun (ad, soyad, doğum tarihi, e-posta, telefon).', 'Tamam', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // BiletBank destek: ProductIds = AirSearch ProductId = Allocate Request ProductId (flight.id)
    const productIds = this.bookingData.productId
      ? [this.bookingData.productId]
      : (this.bookingData.flight?.id ? [this.bookingData.flight.id] : []);

    if (!productIds.length) {
      this.isLoading = false;
      this.snackBar.open('Rezervasyon bilgisi eksik. Lütfen tekrar uçuş seçin.', 'Tamam', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const request: UpdatePassengerRequestDto = {
      sessionId: this.bookingData.sessionId!,
      sessionToken: this.bookingData.sessionToken!,
      productIds,
      newPassengers,
    };

    firstValueFrom(this.api.updatePassengers(request))
      .then(async (res) => {
        if (!res?.success) {
          throw new Error(res?.message || 'Yolcu bilgileri kaydedilemedi');
        }

        // UpdatePassenger başarılı → MakePreBooking çağır
        this.snackBar.open('Yolcu bilgileri kaydedildi. Ön rezervasyon oluşturuluyor...', '', {
          duration: 3000,
          panelClass: ['info-snackbar'],
        });

        const productId = this.bookingData!.productId || this.bookingData!.flight?.id || '';
        const prebookingRequest: MakePrebookingRequestDto = {
          sessionId: this.bookingData!.sessionId!,
          sessionToken: this.bookingData!.sessionToken!,
          productId,
          shoppingFileId: this.bookingData!.shoppingFileId!,
          brandedFareItemId: this.bookingData!.brandedFareItemId,
          brandedCode: this.bookingData!.selectedBrand?.brandCode,
        };

        const prebookingRes = await firstValueFrom(this.api.makePrebooking(prebookingRequest));

        if (!prebookingRes?.success) {
          throw new Error(prebookingRes?.message || 'Ön rezervasyon oluşturulamadı');
        }

        this.isLoading = false;

        // Ödeme sayfası için tüm veriyi sessionStorage'a kaydet
        if (this.isBrowser) {
          const passengersForm = this.bookingForm.get('passengers')?.value || [];
          const passengerSummary = newPassengers.map((p, idx) => {
            const formP = passengersForm[idx] as Record<string, unknown> | undefined;
            const idType = formP?.['idType'] === 'PASSPORT' ? 'PASSPORT' : 'TC';
            return {
              firstName: p.firstName,
              lastName: p.lastName,
              type: p.type,
              citizenNo: p.citizenNo,
              birthDate: p.birthDate,
              gender: p.gender,
              nationality: p.nationality,
              passportNo: p.passportNo,
              passportCountry: p.passportCountry,
              passportValidDate: (p as { passportValidDate?: string }).passportValidDate,
              idType,
              email: p.email,
              phone: p.phone,
            };
          });
          const paymentData = {
            ...this.bookingData,
            passengers: passengerSummary,
            prebooking: {
              shoppingFileId: prebookingRes.shoppingFileId,
              bookingCode: prebookingRes.bookingCode,
              status: prebookingRes.status,
              totalFare: prebookingRes.totalFare,
              baseFare: prebookingRes.baseFare,
              taxes: prebookingRes.taxes,
              serviceFee: prebookingRes.serviceFee,
              currency: prebookingRes.currency,
              isCcPaymentEnabled: prebookingRes.isCcPaymentEnabled,
              isRaPaymentEnabled: prebookingRes.isRaPaymentEnabled,
              remainingSum: prebookingRes.remainingSum,
              isPriceChanged: prebookingRes.isPriceChanged,
              isFlightInfoChanged: prebookingRes.isFlightInfoChanged,
              canBeReserved: prebookingRes.canBeReserved,
              prebookingExpiresAt: prebookingRes.prebookingExpiresAt,
              reservationExpiresAt: prebookingRes.reservationExpiresAt,
            },
          };
          sessionStorage.setItem('booking_payment_data', JSON.stringify(paymentData));
        }

        // Fiyat/uçuş değişikliği uyarısı
        if (prebookingRes.isPriceChanged) {
          this.snackBar.open(
            `Dikkat: Bilet fiyatı değişmiştir. Güncel fiyat: ${prebookingRes.totalFare} ${prebookingRes.currency || ''}`,
            'Tamam',
            { duration: 6000, panelClass: ['warning-snackbar'] },
          );
          setTimeout(() => this.router.navigate(['/payment']), 2000);
        } else if (prebookingRes.isFlightInfoChanged) {
          this.snackBar.open(
            'Dikkat: Uçuş bilgileri değişmiştir. Lütfen ödeme sayfasında kontrol edin.',
            'Tamam',
            { duration: 6000, panelClass: ['warning-snackbar'] },
          );
          setTimeout(() => this.router.navigate(['/payment']), 2000);
        } else {
          this.snackBar.open('Ön rezervasyon oluşturuldu. Ödeme sayfasına yönlendiriliyorsunuz...', 'Tamam', {
            duration: 2500,
            panelClass: ['success-snackbar'],
          });
          setTimeout(() => this.router.navigate(['/payment']), 1000);
        }
      })
      .catch((error: any) => {
        this.isLoading = false;
        // MakePreBooking hatalarını da yakala
        if (error?.status === 401 || error?.error?.statusCode === 401) {
          this.snackBar.open(
            'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
            'Giriş Yap',
            { duration: 5000, panelClass: ['error-snackbar'] },
          ).onAction().subscribe(() => {
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          });
        } else {
          const rawMsg = error?.error?.message;
          let msg: string =
            Array.isArray(rawMsg)
              ? rawMsg.join('. ')
              : typeof rawMsg === 'string'
                ? rawMsg
                : (rawMsg && typeof rawMsg === 'object' && typeof (rawMsg as any).message === 'string')
                  ? (rawMsg as any).message
                  : error?.error?.error || error?.message || 'Yolcu bilgileri kaydedilirken bir hata oluştu.';
          const msgLower = String(msg || '').toLowerCase();

          const isBasketInvalid =
            msgLower.includes('basket code') ||
            msgLower.includes('same basket') ||
            msgLower.includes('rezervasyon oturumu');

          const isServerError =
            error?.status === 500 ||
            error?.status === 503 ||
            error?.status === 0;

          if (isBasketInvalid || isServerError) {
            const clearMsg = isBasketInvalid
              ? 'Bu rezervasyon oturumu artık geçersiz. Lütfen yeni bir uçuş araması yapıp tekrar deneyin.'
              : 'Rezervasyon sırasında bir hata oluştu. Lütfen yeni bir uçuş araması yapıp tekrar deneyin.';
            if (this.isBrowser) {
              sessionStorage.removeItem('booking_allocate_data');
              sessionStorage.removeItem('booking_payment_data');
            }
            this.snackBar.open(clearMsg, 'Tamam', {
              duration: 8000,
              panelClass: ['warning-snackbar'],
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['/']);
            });
          } else {
            this.snackBar.open(msg, 'Kapat', {
              duration: 7000,
              panelClass: ['error-snackbar'],
            });
          }
        }
      });
  }

  /** Telefonu BiletBank formatına çevirir: +90-5332522257 */
  private formatPhoneForApi(value: string): string {
    const digits = String(value || '').replace(/\D/g, '');
    if (!digits.length) return '';
    let num = digits;
    if (num.startsWith('90') && num.length >= 12) {
      num = num.slice(2);
    } else if (num.startsWith('0') && num.length >= 10) {
      num = num.slice(1);
    }
    return '+90-' + num.slice(0, 10);
  }

  /** Tarihi YYYY-MM-DD formatına çevirir */
  private formatDateForApi(value: string | Date | null | undefined): string {
    if (!value) return '';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /** Hatalı alanların kullanıcı dostu etiketlerini döner (markFormGroupTouched sonrası çağrılmalı) */
  private getInvalidFieldLabels(): string[] {
    const labels: string[] = [];
    const contactInfo = this.bookingForm.get('contactInfo') as FormGroup;
    if (contactInfo?.get('email')?.invalid) labels.push('E-posta');
    if (contactInfo?.get('phone')?.invalid) labels.push('Telefon');
    const passengers = this.bookingForm.get('passengers') as FormArray;
    passengers?.controls?.forEach((p, i) => {
      const pg = p as FormGroup;
      const paxNum = i + 1;
      if (pg.get('firstName')?.invalid) labels.push(`Yolcu ${paxNum} - Ad`);
      if (pg.get('lastName')?.invalid) labels.push(`Yolcu ${paxNum} - Soyad`);
      if (pg.get('birthDate')?.invalid) labels.push(`Yolcu ${paxNum} - Doğum tarihi`);
      if (pg.get('gender')?.invalid) labels.push(`Yolcu ${paxNum} - Cinsiyet`);
      if (pg.get('idNumber')?.invalid) labels.push(`Yolcu ${paxNum} - Kimlik/Pasaport no`);
      if (pg.get('passportValidDate')?.invalid) labels.push(`Yolcu ${paxNum} - Pasaport geçerlilik tarihi`);
    });
    return labels;
  }

  /** İlk hatalı alana scroll yapar. passengerIndex verilirse o yolcu bölümüne scroll eder. */
  private scrollToFirstInvalidControl(passengerIndex?: number): void {
    if (!this.isBrowser) return;
    if (passengerIndex !== undefined) {
      const el = document.getElementById(`passenger-${passengerIndex}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const firstInvalid = document.querySelector('.booking-form .ng-invalid');
    const target = firstInvalid?.closest('.mat-form-field') || firstInvalid;
    if (target) {
      (target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  goBack(): void {
    this.router.navigate(['/flight-results']);
  }
}
