import {
  Component,
  Inject,
  PLATFORM_ID,
  afterNextRender,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import {
  BiletbankApiService,
  FinalizeShoppingResponseDto,
  CreateReservationDto,
} from '../../core/biletbank-api.service';

@Component({
  selector: 'app-payment-callback',
  templateUrl: './payment-callback.component.html',
  styleUrl: './payment-callback.component.scss',
  standalone: false,
})
export class PaymentCallbackComponent {
  isProcessing = true;
  isSuccess = false;
  isError = false;
  errorMessage = '';

  paymentId = '';
  bookingCode = '';
  status = '';
  totalFare?: number;
  currency = '';
  passengerName = '';
  cardNumber = '';
  bankName = '';
  finalizedDate = '';
  shoppingFileId = '';

  // Uçuş bilgileri
  flight: {
    airline: string;
    airlineLogo?: string;
    resolvedLogoUrl?: string;
    flightNumber: string;
    departure: { airportCode: string; airportName?: string; city?: string; time: string; date: string };
    arrival: { airportCode: string; airportName?: string; city?: string; time: string; date: string };
    duration: string;
    cabinClass?: string;
  } | null = null;

  // Gidiş+dönüş için tüm bacaklar (flightLegs varsa flight'tan öncelikli)
  flightLegs: {
    flight: {
      airline: string;
      airlineLogo?: string;
      resolvedLogoUrl?: string;
      flightNumber: string;
      departure: { airportCode: string; airportName?: string; city?: string; time: string; date: string };
      arrival: { airportCode: string; airportName?: string; city?: string; time: string; date: string };
      duration: string;
      cabinClass?: string;
    };
    selectedBrand?: { brandName: string; baggageDescription?: string } | null;
    fare?: number;
    currency?: string;
  }[] = [];

  selectedBrand: { brandName: string; baggageDescription?: string } | null = null;
  passengers: {
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
  }[] = [];
  reservationId = '';
  airlinesByCode: Map<string, { name: string; logoUrl?: string }> = new Map();

  readonly isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private api: BiletbankApiService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    /**
     * SSR + hydration: ngOnInit sunucuda çalışır (isBrowser=false) ve erken çıkar;
     * istemcide genelde tekrar çalışmaz — sessionStorage / API hiç tetiklenmez.
     * afterNextRender yalnızca tarayıcıda çalışır (Angular 16+).
     *
     * setTimeout(0): aynı CD turunda isProcessing vb. değişince NG0100 oluşur; bir sonraki makro göreve ertelenir.
     * NgZone + detectChanges: setTimeout/hydration sonrası zone dışı kalıp şablonun güncellenmemesi (takılı yükleme) önlenir.
     */
    afterNextRender(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.runPaymentCallback();
          this.cdr.detectChanges();
        });
      }, 0);
    });
  }

  /** Asenkron / HTTP sonrası şablonun kesin güncellenmesi */
  private touchUi(): void {
    this.ngZone.run(() => this.cdr.detectChanges());
  }

  private runPaymentCallback(): void {
    const params = this.route.snapshot.queryParams;
    const paymentId =
      params['paymentId'] ?? params['PaymentId'] ?? sessionStorage.getItem('payment_3d_id') ?? '';

    /** Test / bazı gateway'ler: ?Fail=true&ErrorMessage=... — BiletBank Ok/Approved kullanmaz */
    const failRaw = String(
      params['Fail'] ?? params['fail'] ?? params['Failed'] ?? params['failed'] ?? '',
    ).trim();
    const gatewayExplicitFail = ['true', 'True', '1', 'yes', 'Yes'].includes(failRaw);

    const decodeQueryMessage = (s: string): string => {
      if (!s) return '';
      try {
        return decodeURIComponent(String(s).replace(/\+/g, ' '));
      } catch {
        return String(s);
      }
    };
    const gatewayErrorMsg = decodeQueryMessage(
      String(params['ErrorMessage'] ?? params['errorMessage'] ?? params['Message'] ?? ''),
    );

    if (gatewayExplicitFail) {
      this.paymentId = paymentId;
      this.status = 'Declined';
      this.isProcessing = false;
      this.isError = true;
      this.errorMessage =
        gatewayErrorMsg || 'Ödeme onaylanmadı veya 3D doğrulama reddedildi. Lütfen tekrar deneyin.';
      void this.persistFailedReservation(this.errorMessage);
      return;
    }

    // Havayolu logolarını arka planda yükle
    this.api.getAirlines().subscribe({
      next: (res) => {
        (res.airlines || []).forEach((a) => {
          this.airlinesByCode.set(a.code.trim().toUpperCase(), { name: a.name, logoUrl: a.logoUrl });
        });
        if (this.flight) {
          this.flight.resolvedLogoUrl = this.resolveAirlineLogo(this.flight.airlineLogo, this.flight.airline);
        }
        this.flightLegs.forEach(leg => {
          leg.flight.resolvedLogoUrl = this.resolveAirlineLogo(leg.flight.airlineLogo, leg.flight.airline);
        });
      },
      error: () => { /* Logo yoksa devam et */ },
    });

    // BiletBank Asseco: Ok=true&Approved=true&PaymentId=...
    const okParam       = params['Ok'] ?? params['ok'] ?? '';
    const approvedParam = params['Approved'] ?? params['approved'] ?? '';
    // Genel "status=true" query bazen 3D sonucu değil; yalnızca mdStatus / MdStatus (Fail yukarıda ele alındı)
    const mdStatus = params['mdStatus'] ?? params['MdStatus'] ?? '';

    const okTrue       = okParam === 'true' || okParam === 'True' || okParam === '1';
    const approvedTrue = approvedParam === 'true' || approvedParam === 'True' || approvedParam === '1';
    const biletbankSuccess = okTrue && approvedTrue;
    const biletbankFailed  = okTrue && !approvedTrue;

    const mdSuccess = ['1', 'true', 'True', 'success', 'Success', 'Y'].includes(mdStatus);
    const mdFailed  = ['0', 'false', 'N', 'error', 'fail'].includes(mdStatus);

    /** Bazı gateway'ler Success=false gönderir; Asseco Ok+Approved varsa onlara öncelik ver */
    const explicitDenySuccess = ['false', 'False', '0', 'no', 'No'].includes(
      String(params['Success'] ?? params['success'] ?? '').trim(),
    );
    const success =
      biletbankSuccess || (!explicitDenySuccess && mdSuccess);
    const failed =
      biletbankFailed ||
      mdFailed ||
      (explicitDenySuccess && !biletbankSuccess);

    this.paymentId = paymentId;
    this.status = mdStatus || (biletbankSuccess ? 'Approved' : biletbankFailed ? 'Declined' : 'Unknown');

    if (success) {
      this.callFinalizeShopping();
    } else if (failed) {
      this.isProcessing = false;
      this.isError = true;
      this.errorMessage =
        gatewayErrorMsg || '3D doğrulama başarısız. Lütfen tekrar deneyin.';
      void this.persistFailedReservation(this.errorMessage);
    } else {
      this.isProcessing = false;
      this.isError = true;
      this.errorMessage = 'Ödeme sonucu alınamadı. Lütfen müşteri hizmetleri ile iletişime geçin.';
      void this.persistFailedReservation(this.errorMessage);
    }
  }

  private async callFinalizeShopping(): Promise<void> {
    const raw = sessionStorage.getItem('booking_payment_data') || sessionStorage.getItem('booking_allocate_data');
    if (!raw) {
      this.isProcessing = false;
      this.isError = true;
      this.errorMessage = 'Oturum bilgisi bulunamadı. Lütfen yeniden rezervasyon yapın.';
      void this.persistFailedReservation(this.errorMessage);
      this.touchUi();
      return;
    }

    let pd: any;
    try {
      pd = JSON.parse(raw);
    } catch {
      this.isProcessing = false;
      this.isError = true;
      this.errorMessage = 'Oturum verisi hatalı.';
      void this.persistFailedReservation(this.errorMessage);
      this.touchUi();
      return;
    }

    this.applyPayloadToView(pd);

    const sessionId = pd.sessionId || '';
    const sessionToken = pd.sessionToken || '';
    const shoppingFileId =
      pd.prebooking?.shoppingFileId || pd.shoppingFileId || pd.allocateId || '';
    const passengerName = `${pd.passengers?.[0]?.firstName ?? ''} ${pd.passengers?.[0]?.lastName ?? ''}`.trim();

    if (!sessionId || !shoppingFileId) {
      this.isProcessing = false;
      this.isError = true;
      this.errorMessage = 'Rezervasyon bilgisi eksik. Lütfen yeniden rezervasyon yapın.';
      void this.persistFailedReservation(this.errorMessage, pd);
      this.touchUi();
      return;
    }

    try {
      const res: FinalizeShoppingResponseDto = await firstValueFrom(
        this.api.finalizeShopping({
          sessionId,
          sessionToken,
          shoppingFileId,
          billingName: passengerName || 'MUSTERI',
          countryCode: 'TR',
          ifCompany: 0,
          taxNo: '0000000000',
          taxOffice: 'TEST',
          addressCity: 'ISTANBUL',
          addressDetail: '-',
          addressDistrict: '-',
          addressZipCode: '00000',
        }),
      );

      this.isProcessing = false;

      if (res.success) {
        this.bookingCode = res.bookingCode ?? '';
        this.totalFare = res.totalFare;
        this.currency = res.currency ?? 'TRY';
        this.passengerName = res.passengerName ?? passengerName;
        this.shoppingFileId = res.shoppingFileId ?? shoppingFileId;
        this.cardNumber = res.payment?.cardNumber ?? '';
        this.bankName = res.payment?.bankName ?? '';
        this.finalizedDate = res.payment?.finalizedDate ?? '';

        await this.saveReservation(res, shoppingFileId);

        sessionStorage.removeItem('booking_allocate_data');
        sessionStorage.removeItem('booking_payment_data');
        sessionStorage.removeItem('booking_session_start');
        sessionStorage.removeItem('payment_3d_id');

        this.isSuccess = true;
        this.snackBar.open('Biletiniz başarıyla oluşturuldu!', '', {
          duration: 4000,
          panelClass: ['success-snackbar'],
        });
        this.touchUi();
      } else {
        this.isError = true;
        this.errorMessage = res.message || 'Rezervasyon tamamlanamadı.';
        await this.persistFailedReservation(this.errorMessage, pd);
        this.touchUi();
      }
    } catch (err: any) {
      this.isProcessing = false;
      this.isError = true;
      const msg = err?.error?.message;
      this.errorMessage =
        (typeof msg === 'string' ? msg : msg?.message) || 'Rezervasyon tamamlanırken hata oluştu.';
      await this.persistFailedReservation(this.errorMessage, pd);
      this.touchUi();
    }
  }

  private applyPayloadToView(pd: any): void {
    // Gidiş+dönüş: flightLegs varsa her bacağı ayrı göster
    if (Array.isArray(pd.flightLegs) && pd.flightLegs.length > 0) {
      this.flightLegs = pd.flightLegs.map((leg: any) => ({
        flight: {
          ...leg.flight,
          resolvedLogoUrl: this.resolveAirlineLogo(leg.flight?.airlineLogo, leg.flight?.airline),
        },
        selectedBrand: leg.selectedBrand ?? null,
        fare:
          typeof leg.selectedBrand?.totalFare === 'number'
            ? leg.selectedBrand.totalFare
            : typeof leg.flight?.price === 'number'
              ? leg.flight.price
              : undefined,
        currency: leg.selectedBrand?.currency ?? leg.flight?.currency,
      }));
      // Eski tekil flight alanını da doldur (fallback / koltuk chip vs)
      const first = pd.flightLegs[0];
      if (first?.flight) {
        this.flight = {
          ...first.flight,
          resolvedLogoUrl: this.resolveAirlineLogo(first.flight.airlineLogo, first.flight.airline),
        };
        this.selectedBrand = first.selectedBrand ?? pd.selectedBrand ?? null;
      }
    } else if (pd.flight) {
      // Tek yön
      this.flight = pd.flight;
      if (this.flight) {
        this.flight.resolvedLogoUrl = this.resolveAirlineLogo(pd.flight.airlineLogo, pd.flight.airline);
      }
      if (pd.selectedBrand) {
        this.selectedBrand = pd.selectedBrand;
      }
    }
    if (pd.passengers?.length) {
      this.passengers = pd.passengers;
    }
  }

  /**
   * Ödeme / 3D / finalize başarısız — mümkünse sepet bilgisiyle rezervasyon kaydı (PAYMENT_FAILED).
   */
  private bookingCodeFromPaymentId(paymentId: string): string {
    const cleaned = String(paymentId).replace(/[^a-zA-Z0-9_-]/g, '');
    return `PAY-${cleaned || 'X'}`.toUpperCase().slice(0, 80);
  }

  /** Destek için: gateway’in döndürdüğü query parametrelerini (kısaltılmış) failureReason’a ekler */
  private enrichFailureReason(reason: string): string {
    const base = (reason || 'Ödeme başarısız').slice(0, 1200);
    const q = this.route.snapshot.queryParams;
    if (!Object.keys(q).length) {
      return base.slice(0, 2000);
    }
    const extra = ` | callbackQs=${JSON.stringify(q).slice(0, 750)}`;
    return (base + extra).slice(0, 2000);
  }

  private async persistFailedReservation(reason: string, pd?: any): Promise<void> {
    const payload = pd ?? this.parseBookingSessionRaw();
    const shoppingFileId =
      payload?.prebooking?.shoppingFileId ||
      payload?.shoppingFileId ||
      payload?.allocateId ||
      '';
    const paymentIdFromPayload = payload?.paymentId as string | undefined;
    const effectivePaymentId = (this.paymentId || paymentIdFromPayload || '').trim();

    const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    const bookingCode = effectivePaymentId
      ? this.bookingCodeFromPaymentId(effectivePaymentId)
      : `FAIL-UNK-${suffix}`.toUpperCase();

    if (payload) {
      this.applyPayloadToView(payload);
    }

    const totalFare =
      typeof payload?.prebooking?.totalFare === 'number'
        ? payload.prebooking.totalFare
        : typeof payload?.totalFare === 'number'
          ? payload.totalFare
          : undefined;
    const currency = payload?.currency || payload?.prebooking?.currency || 'TRY';

    const flightDto = this.buildFlightDtoIfValidForApi();
    const passengersDto = this.buildPassengerDtosIfValidForApi();

    const dto: CreateReservationDto = {
      bookingCode,
      status: 'PAYMENT_FAILED',
      type: 'flight',
      shoppingFileId: shoppingFileId || undefined,
      totalFare,
      currency,
      failureReason: this.enrichFailureReason(reason),
      flight: flightDto,
      passengers: passengersDto,
      payment: effectivePaymentId ? { paymentId: effectivePaymentId } : undefined,
    };

    try {
      await firstValueFrom(this.api.createReservation(dto));
    } catch (e) {
      console.warn('Başarısız rezervasyon kaydı gönderilemedi:', e);
    }
  }

  /**
   * client-api ReservationFlight şeması zorunlu alanlar ister; eksik uçuş gövdesi 500 (Mongoose validation) üretebilir.
   * Başarısız kayıtta uçuşu yalnızca tam ise gönder.
   */
  private buildFlightDtoIfValidForApi(): CreateReservationDto['flight'] {
    const f = this.flight;
    if (!f) return undefined;
    const dep = f.departure as any;
    const arr = f.arrival as any;
    const depOk =
      !!dep &&
      typeof dep.airportCode === 'string' &&
      dep.airportCode.trim().length > 0 &&
      typeof dep.time === 'string' &&
      dep.time.trim().length > 0 &&
      typeof dep.date === 'string' &&
      dep.date.trim().length > 0;
    const arrOk =
      !!arr &&
      typeof arr.airportCode === 'string' &&
      arr.airportCode.trim().length > 0 &&
      typeof arr.time === 'string' &&
      arr.time.trim().length > 0 &&
      typeof arr.date === 'string' &&
      arr.date.trim().length > 0;
    const baseOk =
      typeof f.airline === 'string' &&
      f.airline.trim().length > 0 &&
      typeof f.flightNumber === 'string' &&
      f.flightNumber.trim().length > 0;
    if (!baseOk || !depOk || !arrOk) {
      return undefined;
    }
    return {
      airline: f.airline,
      airlineLogo: f.airlineLogo,
      flightNumber: f.flightNumber,
      departure: {
        airportCode: dep.airportCode,
        airportName: dep.airportName,
        city: dep.city,
        time: dep.time,
        date: dep.date,
      },
      arrival: {
        airportCode: arr.airportCode,
        airportName: arr.airportName,
        city: arr.city,
        time: arr.time,
        date: arr.date,
      },
      duration: f.duration,
      cabinClass: f.cabinClass,
      brandName: this.selectedBrand?.brandName,
      baggageDescription: this.selectedBrand?.baggageDescription,
    };
  }

  private buildPassengerDtosIfValidForApi(): CreateReservationDto['passengers'] {
    const list = (this.passengers || [])
      .filter(
        (p) =>
          !!p &&
          typeof p.firstName === 'string' &&
          p.firstName.trim().length > 0 &&
          typeof p.lastName === 'string' &&
          p.lastName.trim().length > 0 &&
          typeof p.type === 'string' &&
          p.type.trim().length > 0,
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
    return list.length > 0 ? list : undefined;
  }

  private parseBookingSessionRaw(): any | null {
    const raw = sessionStorage.getItem('booking_payment_data') || sessionStorage.getItem('booking_allocate_data');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private async saveReservation(
    res: FinalizeShoppingResponseDto,
    shoppingFileId: string,
  ): Promise<void> {
    try {
      const dto: CreateReservationDto = {
        bookingCode: res.bookingCode ?? this.bookingCode,
        status: 'CONFIRMED',
        type: 'flight',
        shoppingFileId,
        totalFare: res.totalFare,
        currency: res.currency ?? 'TRY',
        flight: this.flight
          ? {
              airline: this.flight.airline,
              airlineLogo: this.flight.airlineLogo,
              flightNumber: this.flight.flightNumber,
              departure: this.flight.departure,
              arrival: this.flight.arrival,
              duration: this.flight.duration,
              cabinClass: this.flight.cabinClass,
              brandName: this.selectedBrand?.brandName,
              baggageDescription: this.selectedBrand?.baggageDescription,
            }
          : undefined,
        flightLegs: this.flightLegs.length > 0
          ? this.flightLegs.map((leg) => ({
              airline: leg.flight.airline,
              airlineLogo: leg.flight.airlineLogo,
              flightNumber: leg.flight.flightNumber,
              departure: leg.flight.departure,
              arrival: leg.flight.arrival,
              duration: leg.flight.duration,
              cabinClass: leg.flight.cabinClass,
              brandName: leg.selectedBrand?.brandName,
              baggageDescription: leg.selectedBrand?.baggageDescription,
              fare: leg.fare,
              currency: leg.currency ?? res.currency ?? 'TRY',
            }))
          : undefined,
        passengers: this.passengers.map((p) => ({
          firstName: p.firstName,
          lastName: p.lastName,
          type: p.type,
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
        })),
        payment: {
          amount: res.totalFare,
          currency: res.currency ?? 'TRY',
          cardNumber: res.payment?.cardNumber,
          cardHolder: res.payment?.cardHolder,
          bankName: res.payment?.bankName,
          installmentCount: res.payment?.installmentCount,
          finalizedDate: res.payment?.finalizedDate,
          paymentId: this.paymentId,
        },
      };

      const result = await firstValueFrom(this.api.createReservation(dto));
      if (result.success) {
        this.reservationId = result.reservationId ?? '';
      }
    } catch (err) {
      // Kaydetme hatası kritik değil, sadece logla
      console.warn('Rezervasyon kaydedilemedi:', err);
    }
  }

  /** airlineLogo (IATA kodu veya URL) veya airline adından logo URL'si çözer */
  resolveAirlineLogo(airlineLogo?: string, airline?: string): string | undefined {
    // Eğer zaten URL ise döndür
    if (airlineLogo && (airlineLogo.startsWith('http') || airlineLogo.startsWith('/'))) {
      return airlineLogo;
    }
    // IATA kodu ile admin panel'den bak
    const code = (airlineLogo || airline || '').trim().toUpperCase();
    if (code && this.airlinesByCode.has(code)) {
      return this.airlinesByCode.get(code)?.logoUrl;
    }
    return undefined;
  }

  retryPayment(): void {
    this.router.navigate(['/payment']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goMyReservations(): void {
    this.router.navigate(['/my-reservations']);
  }

  private static readonly TR_MONTHS = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];
  private static readonly TR_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  /** "2026-06-21" → "21 Haz 2026, Cmt" (SSR güvenli, locale gerektirmez) */
  formatFlightDate(dateStr?: string): string {
    if (!dateStr) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
    if (!m) return dateStr;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    if (month < 0 || month > 11) return dateStr;
    const d = new Date(Date.UTC(year, month, day));
    const weekday = PaymentCallbackComponent.TR_DAYS[d.getUTCDay()];
    return `${day} ${PaymentCallbackComponent.TR_MONTHS[month]} ${year}, ${weekday}`;
  }
}
