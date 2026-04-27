import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-url.token';

// Backend'in döndürdüğü FlightCard modeline yakın bir tip
export interface AirSearchFlightDto {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departure: {
    airport: string;
    airportCode: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    airportCode: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  stopDetails?: string;
  price: number;
  currency: string;
  baggage: string;
  cabinClass: string;
  aircraft?: string;
  segments?: {
    marketingAirline?: string;
    operatingAirline?: string;
    flightNumber?: string;
    cabinClass?: string;
    originCode?: string;
    destinationCode?: string;
    departureDateTime?: string;
    arrivalDateTime?: string;
    duration?: string;
  }[];
  brandOptions?: {
    id: string;
    brandId?: string;
    brandCode?: string;
    brandName?: string;
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
  }[];
}

export interface AirSearchResponseDto {
  success: boolean;
  message: string;
  hasError?: boolean;
  searchId?: string;
  shoppingFileId?: string;
  sessionId?: string; // Allocate için gerekli
  sessionToken?: string; // Allocate için gerekli
  flights?: AirSearchFlightDto[];
}

export interface AllocateRequestDto {
  productId: string;
  brandedFareItemId?: string;
  sessionId: string;
  sessionToken: string;
  shoppingFileId: string;
  flightId?: string;
  selectedServiceFeeAmount?: number; // Komisyon miktarı (default: 0)
}

export interface AllocatePaxRefDto {
  localSequenceNo?: number;
  passengerId?: string;
  paxReferenceId?: string;
}

export interface AllocateResponseDto {
  success: boolean;
  message: string;
  allocateId?: string;
  productId?: string;
  shoppingFileId?: string;
  paxReferences?: AllocatePaxRefDto[];
  correlationId?: string;
  details?: any;
}

/** UpdatePassenger yolcu bilgisi */
export interface UpdatePassengerItemDto {
  birthDate: string; // YYYY-MM-DD
  citizenNo: string; // TC veya 00000000000
  email: string;
  firstName: string;
  gender: 'M' | 'F';
  id: string; // UUID
  ifContact: boolean;
  lastName: string;
  nationality: string; // TR, US vb.
  passportCountry: string;
  passportNo: string;
  passportValidDate?: string; // YYYY-MM-DD (pasaport için)
  phone: string;
  sequenceNo: number;
  tempTag: string; // UUID
  type: 'ADT' | 'CHD' | 'INF';
  wheelChairServiceType?: number;
}

export interface UpdatePassengerRequestDto {
  sessionId: string;
  sessionToken: string;
  productIds: string[];
  newPassengers: UpdatePassengerItemDto[];
}

export interface UpdatePassengerResponseDto {
  success: boolean;
  message: string;
  shoppingFileId?: string;
  correlationId?: string;
  details?: any;
}

export interface Init3DPaymentRequestDto {
  sessionId: string;
  sessionToken: string;
  shoppingFileId: string;
  amount: number;
  currency: string;
  isPartialPayment: boolean;
  cardNumber: string;
  cardHolderName: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
  callbackUrl: string;
  installmentOptionId?: string;
}

export interface Init3DPaymentResponseDto {
  success: boolean;
  message: string;
  correlationId?: string;
  paymentId?: string;
  /** 3D Secure HTML form içeriği (auto-submit edilecek) */
  threeDSHtmlContent?: string;
  /** 3D Secure yönlendirme URL'si */
  threeDSUrl?: string;
  status?: string;
  rawDetails?: any;
}

export interface MakePaymentRequestDto {
  sessionId: string;
  sessionToken: string;
  /** MakePreBooking response'undan gelen ShoppingFileId */
  shoppingFileId: string;
  /** RemainingSum veya TotalFare */
  amount: number;
  currency: string;
  /** false = tam ödeme */
  isPartialPayment: boolean;
  /** RA_BALANCE_PAYMENT */
  paymentType: string;
  deductLastSellerCommission?: boolean;
}

export interface MakePaymentResponseDto {
  success: boolean;
  message: string;
  correlationId?: string;
  paymentId?: string;
  shoppingFileId?: string;
  ifFinalized?: boolean;
  isPriceChanged?: boolean;
  isFlightInfoChanged?: boolean;
  isReservationCancelled?: boolean;
  isCcPaymentEnabled?: boolean;
  isRaPaymentEnabled?: boolean;
  remainingSum?: number;
  grandTotal?: number;
  bookingCode?: string;
  status?: string;
  totalFare?: number;
  baseFare?: number;
  taxes?: number;
  serviceFee?: number;
  currency?: string;
  isRefundable?: boolean;
  type?: string;
  reservationDate?: string;
  prebookingExpiresAt?: string;
  reservationExpiresAt?: string;
}

export interface MakePrebookingRequestDto {
  sessionId: string;
  sessionToken: string;
  productId: string;
  shoppingFileId: string;
  brandedFareItemId?: string;
  brandedCode?: string;
}

export interface MakePrebookingPaxRefDto {
  localSequenceNo?: number;
  passengerId?: string;
  paxReferenceId?: string;
  localPaxType?: string;
}

export interface MakePrebookingResponseDto {
  success: boolean;
  message: string;
  correlationId?: string;
  shoppingFileId?: string;
  ifFinalized?: boolean;
  isPriceChanged?: boolean;
  isFlightInfoChanged?: boolean;
  isReservationCancelled?: boolean;
  isCcPaymentEnabled?: boolean;
  isRaPaymentEnabled?: boolean;
  remainingSum?: number;
  maxSc?: number;
  minSc?: number;
  bookingCode?: string;
  status?: string;
  totalFare?: number;
  baseFare?: number;
  taxes?: number;
  serviceFee?: number;
  currency?: string;
  canBeReserved?: boolean;
  prebookingExpiresAt?: string;
  reservationExpiresAt?: string;
  reservationDate?: string;
  paxReferences?: MakePrebookingPaxRefDto[];
}

export interface FinalizeShoppingRequestDto {
  sessionId: string;
  sessionToken: string;
  shoppingFileId: string;
  billingName: string;
  addressCity?: string;
  addressDetail?: string;
  addressDistrict?: string;
  addressZipCode?: string;
  countryCode?: string;
  ifCompany?: number;
  taxNo?: string;
  taxOffice?: string;
}

export interface FinalizeShoppingResponseDto {
  success: boolean;
  message?: string;
  correlationId?: string;
  bookingCode?: string;
  status?: string;
  ifFinalized?: boolean;
  totalFare?: number;
  currency?: string;
  shoppingFileId?: string;
  passengerName?: string;
  payment?: {
    amount?: number;
    confirmedAmount?: number;
    currency?: string;
    cardNumber?: string;
    cardHolder?: string;
    bankName?: string;
    installmentCount?: number;
    finalizedDate?: string;
  };
}

// ── Rezervasyon kaydetme ──────────────────────────────────────────────────

export interface CreateReservationFlightPoint {
  airportCode: string;
  airportName?: string;
  city?: string;
  time: string;
  date: string;
}

export interface CreateReservationFlight {
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  departure: CreateReservationFlightPoint;
  arrival: CreateReservationFlightPoint;
  duration?: string;
  cabinClass?: string;
  brandName?: string;
  baggageDescription?: string;
}

export interface CreateReservationPassenger {
  firstName: string;
  lastName: string;
  type: string;
  citizenNo?: string;
  passportNo?: string;
  passportCountry?: string;
  passportValidDate?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  idType?: string;
  email?: string;
  phone?: string;
}

export interface CreateReservationPayment {
  amount?: number;
  currency?: string;
  cardNumber?: string;
  cardHolder?: string;
  bankName?: string;
  installmentCount?: number;
  finalizedDate?: string;
  paymentId?: string;
}

export interface CreateReservationDto {
  bookingCode: string;
  status?: string;
  type?: string;
  flight?: CreateReservationFlight;
  passengers?: CreateReservationPassenger[];
  payment?: CreateReservationPayment;
  shoppingFileId?: string;
  totalFare?: number;
  currency?: string;
  correlationId?: string;
  /** Ödeme başarısız kayıtları için */
  failureReason?: string;
}

export interface CreateReservationResponseDto {
  success: boolean;
  reservationId?: string;
  bookingCode?: string;
}

export interface MyReservationDto {
  id: string;
  bookingCode: string;
  status: string;
  type: string;
  flight?: CreateReservationFlight;
  passengers: CreateReservationPassenger[];
  payment?: CreateReservationPayment;
  totalFare?: number;
  currency?: string;
  createdAt?: string;
}

export interface MyReservationsResponseDto {
  success: boolean;
  reservations: MyReservationDto[];
}

export interface AirSearchRequestBody {
  tripType: 'OW' | 'RT';
  originCode: string;
  originCountryCode: string;
  originIsCity: boolean;
  destinationCode: string;
  destinationCountryCode: string;
  destinationIsCity: boolean;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  searchReason: 'SearchOnly' | 'SearchAndBook';
}

export interface AirportCountryDto {
  countryCode: string;
  countryName: string;
}

export interface AirportDto {
  cityCode: string;
  cityName: string;
  airportCode: string;
  airportName: string;
  countryCode: string;
  countryName: string;
  timeZoneId?: string;
}

@Injectable({ providedIn: 'root' })
export class BiletbankApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  searchFlights(body: AirSearchRequestBody): Observable<AirSearchResponseDto> {
    // Geçici olarak custom header kaldırıldı (CORS hatası nedeniyle)
    return this.http.post<AirSearchResponseDto>(`${this.baseUrl}/biletbank/airsearch`, body);
  }

  getCountries(): Observable<{ success: boolean; countries: AirportCountryDto[] }> {
    return this.http.get<{ success: boolean; countries: AirportCountryDto[] }>(
      `${this.baseUrl}/airports/countries`,
    );
  }

  searchAirports(params: {
    countryCode?: string;
    q?: string;
    limit?: number;
  }): Observable<{ success: boolean; airports: AirportDto[] }> {
    const queryParams: string[] = [];
    if (params.countryCode) {
      queryParams.push(`countryCode=${encodeURIComponent(params.countryCode)}`);
    }
    if (params.q) {
      queryParams.push(`q=${encodeURIComponent(params.q)}`);
    }
    if (params.limit) {
      queryParams.push(`limit=${params.limit}`);
    }
    const qs = queryParams.length ? `?${queryParams.join('&')}` : '';
    return this.http.get<{ success: boolean; airports: AirportDto[] }>(
      `${this.baseUrl}/airports${qs}`,
    );
  }

  /** Bilet kartlarında havayolu adı ve logo için kullanılır */
  getAirlines(): Observable<{ success: boolean; airlines: { code: string; name: string; logoUrl?: string }[] }> {
    return this.http.get<{ success: boolean; airlines: { code: string; name: string; logoUrl?: string }[] }>(
      `${this.baseUrl}/airlines`,
    );
  }

  /** Allocate (Koltuk Tahsisi) - Seçilen uçuş için koltuk tahsisi yapar */
  allocate(body: AllocateRequestDto): Observable<AllocateResponseDto> {
    return this.http.post<AllocateResponseDto>(`${this.baseUrl}/biletbank/allocate`, body);
  }

  /** UpdatePassengers - Yolcu bilgilerini günceller (Allocate sonrası) */
  updatePassengers(body: UpdatePassengerRequestDto): Observable<UpdatePassengerResponseDto> {
    return this.http.post<UpdatePassengerResponseDto>(
      `${this.baseUrl}/biletbank/update-passengers`,
      body,
    );
  }

  /** MakePreBooking - Ön rezervasyon oluşturur (UpdatePassenger sonrası) */
  makePrebooking(body: MakePrebookingRequestDto): Observable<MakePrebookingResponseDto> {
    return this.http.post<MakePrebookingResponseDto>(
      `${this.baseUrl}/biletbank/make-prebooking`,
      body,
    );
  }

  /** MakePayment - RA bakiyesiyle ödeme (MakePreBooking sonrası) */
  makePayment(body: MakePaymentRequestDto): Observable<MakePaymentResponseDto> {
    return this.http.post<MakePaymentResponseDto>(
      `${this.baseUrl}/biletbank/make-payment`,
      body,
    );
  }

  /** Init3DPayment - Kredi kartı 3D Secure ödeme başlatır */
  init3DPayment(body: Init3DPaymentRequestDto): Observable<Init3DPaymentResponseDto> {
    return this.http.post<Init3DPaymentResponseDto>(
      `${this.baseUrl}/biletbank/init-3d-payment`,
      body,
    );
  }

  /** FinalizeShopping - 3D onayı sonrası bileti keser */
  finalizeShopping(body: FinalizeShoppingRequestDto): Observable<FinalizeShoppingResponseDto> {
    return this.http.post<FinalizeShoppingResponseDto>(
      `${this.baseUrl}/biletbank/finalize-shopping`,
      body,
    );
  }

  /** Rezervasyon kaydet */
  createReservation(body: CreateReservationDto): Observable<CreateReservationResponseDto> {
    return this.http.post<CreateReservationResponseDto>(
      `${this.baseUrl}/reservations`,
      body,
    );
  }

  /** Üyenin tüm rezervasyonları */
  getMyReservations(): Observable<MyReservationsResponseDto> {
    return this.http.get<MyReservationsResponseDto>(`${this.baseUrl}/reservations/mine`);
  }
}

