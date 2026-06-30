import {
  Component,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  afterNextRender,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import {
  BiletbankApiService,
  Init3DPaymentRequestDto,
  CreateReservationDto,
} from '../../core/biletbank-api.service';

interface PassengerSummary {
  firstName: string;
  lastName: string;
  type: string;
  citizenNo?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  passportNo?: string;
  passportCountry?: string;
  passportValidDate?: string;
  idType?: string;
  email?: string;
  phone?: string;
}

interface FlightData {
  id: string;
  airline: string;
  flightNumber: string;
  departure: { airportCode: string; time: string; date: string };
  arrival: { airportCode: string; time: string; date: string };
  duration: string;
  price: number;
  currency: string;
}

interface BrandOption {
  id?: string;
  brandName?: string;
  brandCode?: string;
  totalFare: number;
  totalTaxes?: number;
  currency: string;
  baggageDescription?: string;
}

interface FlightLegData {
  direction: 'outbound' | 'return' | 'roundTrip' | 'single';
  title: string;
  productId: string;
  selectedBrand?: BrandOption | null;
  flight: FlightData;
}

interface PrebookingData {
  shoppingFileId?: string;
  bookingCode?: string;
  status?: string;
  totalFare?: number;
  baseFare?: number;
  taxes?: number;
  serviceFee?: number;
  currency?: string;
  isCcPaymentEnabled?: boolean;
  isRaPaymentEnabled?: boolean;
  remainingSum?: number;
  isPriceChanged?: boolean;
  isFlightInfoChanged?: boolean;
  canBeReserved?: boolean;
  prebookingExpiresAt?: string;
  reservationExpiresAt?: string;
}

interface BookingPaymentData {
  flight?: FlightData;
  selectedBrand?: BrandOption;
  flightLegs?: FlightLegData[];
  passengers?: PassengerSummary[];
  sessionId?: string;
  sessionToken?: string;
  allocateId?: string;
  productId?: string;
  productIds?: string[];
  correlationId?: string;
  prebooking?: PrebookingData;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  standalone: false,
})
export class PaymentComponent implements OnDestroy {
  bookingData: BookingPaymentData | null = null;
  paymentForm: FormGroup;
  isLoading = false;
  paymentSuccess = false;
  isCardFlipped = false;
  paymentError: {
    message?: string;
    correlationId?: string;
    soapRequestXml?: string;
    soapResponseXml?: string;
  } | null = null;
  paymentResult: {
    paymentId?: string;
    bookingCode?: string;
    status?: string;
    totalFare?: number;
    currency?: string;
    isRefundable?: boolean;
    reservationDate?: string;
  } | null = null;

  readonly isBrowser: boolean;

  remainingSeconds = 15 * 60;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private api: BiletbankApiService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.paymentForm = this.fb.group({
      cardNumber:  ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      cardHolder:  ['', [Validators.required, Validators.minLength(3)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear:  ['', [Validators.required, Validators.pattern(/^\d{2}(\d{2})?$/)]],
      cvv:         ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      agreeTerms:  [false, Validators.requiredTrue],
    });

    // Kart numarası değişince CVV validator'ı güncelle (Amex=4, diğerleri=3 hane)
    this.paymentForm.get('cardNumber')!.valueChanges.subscribe(() => {
      this.updateCvvValidator();
    });

    /**
     * SSR + hydration: session’dan bookingData aynı CD turunda set edilince NG0100 oluşur.
     * Bir sonraki makro göreve ertelenir.
     */
    afterNextRender(() => {
      setTimeout(() => {
        this.initPaymentPageFromSession();
        this.cdr.detectChanges();
      }, 0);
    });
  }

  private initPaymentPageFromSession(): void {
    const raw = sessionStorage.getItem('booking_payment_data') || sessionStorage.getItem('booking_allocate_data');
    if (!raw) {
      this.router.navigate(['/']);
      return;
    }
    try {
      this.bookingData = JSON.parse(raw);
    } catch {
      this.router.navigate(['/']);
      return;
    }

    const pb = this.bookingData?.prebooking;
    if (pb) {
      if (pb.isPriceChanged) {
        this.snackBar.open(
          `Fiyat güncellendi: ${this.payableAmount} ${this.currency}`,
          'Tamam',
          { duration: 8000, panelClass: ['warning-snackbar'] },
        );
      }
      if (pb.isFlightInfoChanged) {
        this.snackBar.open(
          'Uçuş bilgileri değişmiştir. Lütfen aşağıdaki detayları kontrol edin.',
          'Tamam',
          { duration: 8000, panelClass: ['warning-snackbar'] },
        );
      }
    }

    // Countdown: prebookingExpiresAt varsa kullan
    const expiresAt = pb?.prebookingExpiresAt;
    if (expiresAt) {
      const expiresMs = new Date(expiresAt).getTime();
      this.remainingSeconds = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
    } else {
      const stored = sessionStorage.getItem('booking_session_start');
      const start = stored ? parseInt(stored, 10) : Date.now();
      this.remainingSeconds = Math.max(0, 15 * 60 - Math.floor((Date.now() - start) / 1000));
    }

    if (this.remainingSeconds <= 0) {
      this.handleExpiry();
      return;
    }

    this.countdownInterval = setInterval(() => {
      this.remainingSeconds = Math.max(0, this.remainingSeconds - 1);
      if (this.remainingSeconds === 0) this.handleExpiry();
    }, 1000);

    /** Henüz ödeme yok: PENDING (PRE-…) — kart onayıyla CONFIRMED’a güncellenir */
    void this.persistReservationOnPaymentStepEnter();
  }

  /** Ödeme sayfasına girildiğinde — DB’de PENDING; init3D ve finalize aynı shoppingFileId satırını günceller */
  private bookingCodeForShoppingFileId(shoppingFileId: string): string {
    const cleaned = String(shoppingFileId).replace(/[^a-zA-Z0-9_-]/g, '');
    return `PRE-${cleaned || 'X'}`.toUpperCase().slice(0, 80);
  }

  private async persistReservationOnPaymentStepEnter(): Promise<void> {
    const pd = this.bookingData;
    if (!pd) return;
    const shoppingFileId = pd.prebooking?.shoppingFileId || pd.allocateId || '';
    if (!shoppingFileId) return;

    const bookingCode = this.bookingCodeForShoppingFileId(shoppingFileId);
    const flightDto = this.buildReservationFlightDto();
    const passengersDto = this.buildReservationPassengers();
    const dto: CreateReservationDto = {
      bookingCode,
      status: 'PENDING',
      type: 'flight',
      shoppingFileId,
      totalFare: this.payableAmount,
      currency: this.currency,
      flight: flightDto,
      passengers: passengersDto?.length ? passengersDto : undefined,
    };
    try {
      await firstValueFrom(this.api.createReservation(dto));
    } catch (e) {
      console.warn('Ödeme adımı ön rezervasyonu kaydedilemedi:', e);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  get countdownDisplay(): string {
    const m = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const s = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get isCountdownWarning(): boolean {
    return this.remainingSeconds <= 120;
  }

  get totalFare(): number {
    // Prebooking'ten gelen totalFare varsa her zaman öncelikli (BiletBank'ın onayladığı tutar).
    const prebookingTotal = this.bookingData?.prebooking?.totalFare;
    if (prebookingTotal != null && prebookingTotal > 0) return prebookingTotal;

    // Prebooking yoksa ya da 0 ise: leg fiyatlarını topla.
    if (this.hasMultiLegPriceSummary) {
      return this.priceSummaryLegs.reduce((sum, leg) => sum + this.getLegTotalFare(leg), 0) + this.serviceFee;
    }
    return this.bookingData?.selectedBrand?.totalFare
      ?? this.bookingData?.flight?.price
      ?? 0;
  }

  get payableAmount(): number {
    // remainingSum = 0: BiletBank henüz ödeme yapılmamış pre-booking için sıfır dönebilir.
    // ?? operatörü 0'ı geçerli değer sayar — sıfır gelirse yanlış tutarı gösteririz.
    // Bu yüzden sadece pozitif remainingSum'ı kullan; yoksa totalFare'e dön.
    const rs = this.bookingData?.prebooking?.remainingSum;
    if (rs != null && rs > 0) return rs;

    const prebookingTotal = this.bookingData?.prebooking?.totalFare;
    if (prebookingTotal != null && prebookingTotal > 0) return prebookingTotal;

    return this.totalFare;
  }

  get currency(): string {
    if (this.bookingData?.prebooking?.currency) {
      return this.bookingData.prebooking.currency;
    }
    if (this.priceSummaryLegs.length) {
      return (
        this.priceSummaryLegs.find((leg) => leg.selectedBrand?.currency || leg.flight.currency)?.selectedBrand?.currency ||
        this.priceSummaryLegs.find((leg) => leg.flight.currency)?.flight.currency ||
        'TRY'
      );
    }
    return this.bookingData?.selectedBrand?.currency
      ?? this.bookingData?.flight?.currency
      ?? 'TRY';
  }

  get taxAmount(): number {
    if (this.hasMultiLegPriceSummary) {
      return this.priceSummaryLegs.reduce((sum, leg) => sum + (leg.selectedBrand?.totalTaxes || 0), 0);
    }
    return this.bookingData?.prebooking?.taxes
      ?? this.bookingData?.selectedBrand?.totalTaxes
      ?? 0;
  }

  get baseFare(): number {
    const base = this.bookingData?.prebooking?.baseFare;
    if (base != null && base > 0) return base;
    return this.taxAmount > 0 ? this.payableAmount - this.taxAmount : this.payableAmount;
  }

  get serviceFee(): number {
    return this.bookingData?.prebooking?.serviceFee ?? 0;
  }

  private get hasMultiLegPriceSummary(): boolean {
    return (this.bookingData?.flightLegs?.length || 0) > 1;
  }

  get totalPassengerCount(): number {
    return Math.max(this.bookingData?.passengers?.length || 1, 1);
  }

  get passengerTypeSummary(): string {
    const passengers = this.bookingData?.passengers || [];
    const adults = passengers.filter((p) => p.type === 'ADT').length;
    const children = passengers.filter((p) => p.type === 'CHD').length;
    const infants = passengers.filter((p) => p.type === 'INF').length;
    const parts: string[] = [];
    if (adults) parts.push(`${adults} Yetişkin`);
    if (children) parts.push(`${children} Çocuk`);
    if (infants) parts.push(`${infants} Bebek`);
    return parts.join(', ') || `${this.totalPassengerCount} Yolcu`;
  }

  get priceSummaryLegs(): FlightLegData[] {
    if (this.bookingData?.flightLegs?.length) {
      return this.bookingData.flightLegs;
    }
    if (!this.bookingData?.flight) {
      return [];
    }
    return [{
      direction: 'single',
      title: 'Uçuş',
      productId: this.bookingData.productId || this.bookingData.flight.id,
      selectedBrand: this.bookingData.selectedBrand || null,
      flight: this.bookingData.flight,
    }];
  }

  get averageFarePerPassenger(): number {
    return this.payableAmount / this.totalPassengerCount;
  }

  getLegTotalFare(leg: FlightLegData): number {
    return leg.selectedBrand?.totalFare || leg.flight.price || 0;
  }

  getLegPackageName(leg: FlightLegData): string {
    return leg.selectedBrand?.brandName || leg.selectedBrand?.brandCode || 'Standart';
  }

  getLegRoute(leg: FlightLegData): string {
    return `${leg.flight.departure.airportCode} → ${leg.flight.arrival.airportCode}`;
  }

  get bookingCode(): string | null {
    return this.bookingData?.prebooking?.bookingCode ?? null;
  }

  get isPriceChanged(): boolean {
    return this.bookingData?.prebooking?.isPriceChanged ?? false;
  }

  get isFlightInfoChanged(): boolean {
    return this.bookingData?.prebooking?.isFlightInfoChanged ?? false;
  }

  get cardNumberGroups(): string[] {
    const raw = (this.paymentForm.get('cardNumber')?.value || '').replace(/\D/g, '');
    const groups: string[] = [];
    for (let i = 0; i < 4; i++) {
      const chunk = raw.substring(i * 4, i * 4 + 4);
      groups.push(chunk || '••••');
    }
    return groups;
  }

  get cardNumberDisplay(): string {
    return this.paymentForm.get('cardNumber')?.value || '•••• •••• •••• ••••';
  }

  get cardHolderDisplay(): string {
    return (this.paymentForm.get('cardHolder')?.value || 'AD SOYAD').toUpperCase();
  }

  get expiryDisplay(): string {
    const m = this.paymentForm.get('expiryMonth')?.value || 'AA';
    const y = this.paymentForm.get('expiryYear')?.value || 'YY';
    // 4 haneli yıl gelirse sadece son 2 hanesini göster (kart üzerinde)
    const yDisplay = y.length === 4 ? y.slice(2) : y;
    return `${m}/${yDisplay}`;
  }

  get cvvDisplay(): string {
    const v = this.paymentForm.get('cvv')?.value || '';
    return v ? '•'.repeat(v.length) : '•••';
  }

  get cardBrand(): string {
    const num = (this.paymentForm.get('cardNumber')?.value || '').replace(/\D/g, '');
    if (!num) return '';
    if (num.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (num.startsWith('34') || num.startsWith('37')) return 'amex';
    if (num.startsWith('9792')) return 'troy';
    return '';
  }

  get cvvMaxLength(): number {
    return this.cardBrand === 'amex' ? 4 : 3;
  }

  get cvvPlaceholder(): string {
    return this.cardBrand === 'amex' ? '••••' : '•••';
  }

  get cvvHint(): string {
    return this.cardBrand === 'amex' ? '4 haneli güvenlik kodu (ön yüz)' : '3 haneli güvenlik kodu (arka yüz)';
  }

  private updateCvvValidator(): void {
    const cvvCtrl = this.paymentForm.get('cvv');
    if (!cvvCtrl) return;
    const pattern = this.cardBrand === 'amex' ? /^\d{4}$/ : /^\d{3}$/;
    cvvCtrl.setValidators([Validators.required, Validators.pattern(pattern)]);
    cvvCtrl.updateValueAndValidity({ emitEvent: false });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;
    this.paymentForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  onSubmit(): void {
    this.paymentError = null;
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.snackBar.open('Lütfen tüm kart bilgilerini eksiksiz doldurun.', 'Tamam', {
        duration: 3000, panelClass: ['error-snackbar'],
      });
      return;
    }

    const pd = this.bookingData;
    if (!pd?.sessionId || !pd?.sessionToken) {
      this.snackBar.open('Oturum bilgileri bulunamadı. Lütfen yeniden arama yapın.', 'Tamam', {
        duration: 5000, panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/']);
      return;
    }

    const shoppingFileId = pd.prebooking?.shoppingFileId || pd.allocateId || '';
    if (!shoppingFileId) {
      this.snackBar.open('Rezervasyon bilgisi eksik. Lütfen yeniden arama yapın.', 'Tamam', {
        duration: 5000, panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;

    const fv = this.paymentForm.value;
    const cleanCardNumber = (fv.cardNumber as string).replace(/\D/g, '');

    // Callback URL: Angular uygulamasının /payment/callback rotası
    const callbackUrl = `${window.location.origin}/payment/callback`;

    const request: Init3DPaymentRequestDto = {
      sessionId: pd.sessionId,
      sessionToken: pd.sessionToken,
      shoppingFileId,
      amount: this.payableAmount,
      currency: this.currency,
      isPartialPayment: false,
      cardNumber: cleanCardNumber,
      cardHolderName: (fv.cardHolder as string).trim().toUpperCase(),
      expireMonth: (fv.expiryMonth as string).trim().padStart(2, '0'),
      expireYear: (fv.expiryYear as string).trim(),
      cvv: (fv.cvv as string).trim(),
      callbackUrl,
    };

    firstValueFrom(this.api.init3DPayment(request))
      .then((res) => {
        this.isLoading = false;
        if (!res?.success) {
          throw new Error(res?.message || '3D ödeme başlatılamadı');
        }

        // paymentId'yi callback sonrası kullanmak için sakla
        if (res.paymentId) {
          sessionStorage.setItem('payment_3d_id', res.paymentId);
          void this.persistPendingReservation(res.paymentId);
        }

        // 3D HTML form varsa: sayfaya enjekte et, otomatik submit et
        if (res.threeDSHtmlContent) {
          this.submit3DForm(res.threeDSHtmlContent);
          return;
        }

        // Redirect URL varsa: doğrudan yönlendir
        if (res.threeDSUrl) {
          window.location.href = res.threeDSUrl;
          return;
        }

        // Ne HTML ne URL gelmediyse — test ortamında direkt başarı olabilir
        this.snackBar.open('Ödeme işlemi tamamlandı.', '', { duration: 2000, panelClass: ['success-snackbar'] });
        this.finalizeSuccess({ bookingCode: this.bookingCode || undefined });
      })
      .catch((error: any) => {
        this.isLoading = false;
        const errBody = error?.error;
        const rawMsg = errBody?.message;
        const msg: string =
          typeof rawMsg === 'string' ? rawMsg :
          (rawMsg && typeof rawMsg === 'object' && typeof rawMsg.message === 'string') ? rawMsg.message :
          Array.isArray(rawMsg) ? rawMsg.join('. ') :
          errBody?.error || error?.message || 'Ödeme işlemi sırasında bir hata oluştu.';

        // Hata detaylarını ekranda göster (BiletBank destek ekibine iletilebilir)
        const soapReq = rawMsg?.soapRequestXml || errBody?.soapRequestXml;
        const soapRes = rawMsg?.soapResponseXml || errBody?.soapResponseXml;
        const corrId = rawMsg?.correlationId || errBody?.correlationId;

        this.paymentError = {
          message: error?.status === 401 ? 'Oturum süreniz dolmuş.' : msg,
          correlationId: corrId,
          soapRequestXml: soapReq,
          soapResponseXml: soapRes,
        };

        this.snackBar.open(
          error?.status === 401 ? 'Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.' : msg,
          'Kapat',
          { duration: 8000, panelClass: ['error-snackbar'] },
        );

        void this.persistInitFailedReservation(msg, corrId);
      });
  }

  private bookingCodeFromPaymentId(paymentId: string): string {
    const cleaned = String(paymentId).replace(/[^a-zA-Z0-9_-]/g, '');
    return `PAY-${cleaned || 'X'}`.toUpperCase().slice(0, 80);
  }

  /** 3D ödeme başlatıldı — aynı paymentId ile callback’te finalize / hata güncellemesi yapılır */
  private async persistPendingReservation(paymentId: string): Promise<void> {
    const pd = this.bookingData;
    if (!pd) return;
    const shoppingFileId = pd.prebooking?.shoppingFileId || pd.allocateId || '';
    const bookingCode = this.bookingCodeFromPaymentId(paymentId);
    const flightDto = this.buildReservationFlightDto();
    const passengersDto = this.buildReservationPassengers();
    const dto: CreateReservationDto = {
      bookingCode,
      status: 'PENDING',
      type: 'flight',
      shoppingFileId: shoppingFileId || undefined,
      totalFare: this.payableAmount,
      currency: this.currency,
      flight: flightDto,
      passengers: passengersDto?.length ? passengersDto : undefined,
      payment: { paymentId },
    };
    try {
      await firstValueFrom(this.api.createReservation(dto));
    } catch (e) {
      console.warn('Bekleyen rezervasyon (ödeme başlatıldı) kaydedilemedi:', e);
    }
  }

  /** init3DPayment hatası — ödeme bankaya gitmeden düştü */
  private async persistInitFailedReservation(reason: string, correlationId?: string): Promise<void> {
    const pd = this.bookingData;
    if (!pd) return;
    const shoppingFileId = pd.prebooking?.shoppingFileId || pd.allocateId || '';
    const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const safeCorr = correlationId
      ? String(correlationId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40)
      : '';
    const bookingCode = (
      safeCorr ? `FAIL-INIT-${safeCorr}` : `FAIL-INIT-${suffix}`
    ).toUpperCase().slice(0, 80);

    const flightDto = this.buildReservationFlightDto();
    const passengersDto = this.buildReservationPassengers();
    const dto: CreateReservationDto = {
      bookingCode,
      status: 'PAYMENT_FAILED',
      type: 'flight',
      shoppingFileId: shoppingFileId || undefined,
      totalFare: this.payableAmount,
      currency: this.currency,
      failureReason: reason.slice(0, 2000),
      flight: flightDto,
      passengers: passengersDto?.length ? passengersDto : undefined,
      correlationId: correlationId || undefined,
    };
    try {
      await firstValueFrom(this.api.createReservation(dto));
    } catch (e) {
      console.warn('Ödeme başlatma hatası rezervasyon kaydı yazılamadı:', e);
    }
  }

  private buildReservationFlightDto(): CreateReservationDto['flight'] | undefined {
    const f = this.bookingData?.flight;
    if (!f) return undefined;
    const dep = f.departure;
    const arr = f.arrival;
    if (
      !dep?.airportCode ||
      !dep.time ||
      !dep.date ||
      !arr?.airportCode ||
      !arr.time ||
      !arr.date ||
      !f.airline ||
      !f.flightNumber
    ) {
      return undefined;
    }
    return {
      airline: f.airline,
      flightNumber: f.flightNumber,
      departure: {
        airportCode: dep.airportCode,
        time: dep.time,
        date: dep.date,
      },
      arrival: {
        airportCode: arr.airportCode,
        time: arr.time,
        date: arr.date,
      },
      duration: f.duration,
      brandName: this.bookingData?.selectedBrand?.brandName,
      baggageDescription: this.bookingData?.selectedBrand?.baggageDescription,
    };
  }

  private buildReservationPassengers(): CreateReservationDto['passengers'] {
    const list = this.bookingData?.passengers || [];
    return list
      .filter(
        (p) =>
          p.firstName?.trim() &&
          p.lastName?.trim() &&
          p.type?.trim(),
      )
      .map((p) => ({
        firstName: p.firstName.trim(),
        lastName: p.lastName.trim(),
        type: p.type.trim(),
        citizenNo: p.citizenNo,
        birthDate: p.birthDate,
        gender: p.gender,
        nationality: p.nationality,
        passportNo: p.passportNo,
        passportCountry: p.passportCountry,
        passportValidDate: p.passportValidDate,
        idType: p.idType,
        email: p.email,
        phone: p.phone,
      }));
  }

  copyToClipboard(text: string): void {
    if (!this.isBrowser) return;
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Panoya kopyalandı!', '', { duration: 2000 });
    }).catch(() => {
      this.snackBar.open('Kopyalama başarısız.', '', { duration: 2000 });
    });
  }

  copyAllDebugInfo(): void {
    if (!this.isBrowser || !this.paymentError) return;
    const parts: string[] = [];
    if (this.paymentError.message) {
      parts.push(`=== HATA MESAJI ===\n${this.paymentError.message}`);
    }
    if (this.paymentError.correlationId) {
      parts.push(`=== CORRELATION ID ===\n${this.paymentError.correlationId}`);
    }
    if (this.paymentError.soapRequestXml) {
      parts.push(`=== SOAP REQUEST XML ===\n${this.paymentError.soapRequestXml}`);
    }
    if (this.paymentError.soapResponseXml) {
      parts.push(`=== SOAP RESPONSE XML ===\n${this.paymentError.soapResponseXml}`);
    }
    this.copyToClipboard(parts.join('\n\n'));
  }

  /** BiletBank'tan gelen 3D HTML formunu sayfaya yerleştir ve otomatik gönder */
  private submit3DForm(htmlContent: string): void {
    if (!this.isBrowser) return;
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    const form = container.querySelector('form');
    if (form) {
      form.submit();
    } else {
      // Form bulunamazsa yeni pencerede göster
      const w = window.open('', '_self');
      if (w) {
        w.document.open();
        w.document.write(htmlContent);
        w.document.close();
      }
    }
  }

  /** Ödeme başarıyla tamamlandığında (callback'ten geldiğinde de kullanılır) */
  finalizeSuccess(data: { paymentId?: string; bookingCode?: string; status?: string; totalFare?: number; currency?: string }): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.isBrowser) {
      sessionStorage.removeItem('booking_allocate_data');
      sessionStorage.removeItem('booking_payment_data');
      sessionStorage.removeItem('booking_session_start');
      sessionStorage.removeItem('payment_3d_id');
    }
    this.paymentResult = {
      paymentId: data.paymentId,
      bookingCode: data.bookingCode || this.bookingCode || undefined,
      status: data.status,
      totalFare: data.totalFare ?? this.payableAmount,
      currency: data.currency ?? this.currency,
    };
    this.paymentSuccess = true;
  }

  goBack(): void {
    this.router.navigate(['/rezervasyon']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  private handleExpiry(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.isBrowser) {
      sessionStorage.removeItem('booking_allocate_data');
      sessionStorage.removeItem('booking_payment_data');
      sessionStorage.removeItem('booking_session_start');
    }
    this.snackBar.open('Ön rezervasyon süreniz doldu. Lütfen yeniden arama yapın.', 'Tamam', {
      duration: 6000, panelClass: ['error-snackbar'],
    });
    this.router.navigate(['/']);
  }
}
