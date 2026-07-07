import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BiletbankApiService, AirSearchFlightDto } from '../../core/biletbank-api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { FlightSearchLoadingDialogComponent } from '../../shared/flight-search-loading-dialog/flight-search-loading-dialog.component';

export interface Flight {
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
  optionFlag?: string;
}

type FlightBrandOption = NonNullable<Flight['brandOptions']>[number];

@Component({
  selector: 'app-flight-results',
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.scss',
  standalone: false
})
export class FlightResultsComponent implements OnInit {
  // Mock data - will be replaced with API call
  flights: Flight[] = [
    {
      id: '1',
      airline: 'Turkish Airlines',
      airlineLogo: 'TK',
      flightNumber: 'TK1234',
      departure: {
        airport: 'İstanbul Havalimanı',
        airportCode: 'IST',
        city: 'İstanbul',
        time: '08:30',
        date: '2026-01-25'
      },
      arrival: {
        airport: 'Paris Charles de Gaulle',
        airportCode: 'CDG',
        city: 'Paris',
        time: '11:45',
        date: '2026-01-25'
      },
      duration: '3s 15d',
      stops: 0,
      price: 1250,
      currency: '₺',
      baggage: '20kg',
      cabinClass: 'Ekonomi',
      aircraft: 'Boeing 737-800'
    },
    {
      id: '2',
      airline: 'Pegasus Airlines',
      airlineLogo: 'PC',
      flightNumber: 'PC5678',
      departure: {
        airport: 'İstanbul Sabiha Gökçen',
        airportCode: 'SAW',
        city: 'İstanbul',
        time: '10:15',
        date: '2026-01-25'
      },
      arrival: {
        airport: 'Paris Orly',
        airportCode: 'ORY',
        city: 'Paris',
        time: '13:30',
        date: '2026-01-25'
      },
      duration: '3s 15d',
      stops: 0,
      price: 890,
      currency: '₺',
      baggage: '15kg',
      cabinClass: 'Ekonomi',
      aircraft: 'Airbus A320'
    },
    {
      id: '3',
      airline: 'Lufthansa',
      airlineLogo: 'LH',
      flightNumber: 'LH9012',
      departure: {
        airport: 'İstanbul Havalimanı',
        airportCode: 'IST',
        city: 'İstanbul',
        time: '14:20',
        date: '2026-01-25'
      },
      arrival: {
        airport: 'Paris Charles de Gaulle',
        airportCode: 'CDG',
        city: 'Paris',
        time: '18:45',
        date: '2026-01-25'
      },
      duration: '4s 25d',
      stops: 1,
      stopDetails: 'Frankfurt (FRA)',
      price: 1450,
      currency: '₺',
      baggage: '23kg',
      cabinClass: 'Ekonomi',
      aircraft: 'Airbus A330'
    },
    {
      id: '4',
      airline: 'Air France',
      airlineLogo: 'AF',
      flightNumber: 'AF3456',
      departure: {
        airport: 'İstanbul Havalimanı',
        airportCode: 'IST',
        city: 'İstanbul',
        time: '22:00',
        date: '2026-01-25'
      },
      arrival: {
        airport: 'Paris Charles de Gaulle',
        airportCode: 'CDG',
        city: 'Paris',
        time: '01:15',
        date: '2026-01-26'
      },
      duration: '4s 15d',
      stops: 0,
      price: 1320,
      currency: '₺',
      baggage: '23kg',
      cabinClass: 'Ekonomi',
      aircraft: 'Boeing 777'
    },
    {
      id: '5',
      airline: 'Turkish Airlines',
      airlineLogo: 'TK',
      flightNumber: 'TK7890',
      departure: {
        airport: 'İstanbul Havalimanı',
        airportCode: 'IST',
        city: 'İstanbul',
        time: '06:45',
        date: '2026-01-25'
      },
      arrival: {
        airport: 'Paris Charles de Gaulle',
        airportCode: 'CDG',
        city: 'Paris',
        time: '10:00',
        date: '2026-01-25'
      },
      duration: '3s 15d',
      stops: 0,
      price: 1180,
      currency: '₺',
      baggage: '20kg',
      cabinClass: 'Ekonomi',
      aircraft: 'Boeing 737-800'
    }
  ];

  filteredFlights: Flight[] = [];
  /** Gidiş-dönüş aramada tek ürün olarak gelen uçuşlar */
  filteredRoundTripFlights: Flight[] = [];
  /** Gidiş uçuşları (origin → destination) */
  filteredOutboundFlights: Flight[] = [];
  /** Dönüş uçuşları (destination → origin), sadece gidiş-dönüş aramada */
  filteredReturnFlights: Flight[] = [];

  /** Arama parametreleri (gidiş/dönüş başlıkları için) */
  searchTripType: 'OW' | 'RT' = 'RT';
  searchOriginCode: string = '';
  searchDestinationCode: string = '';
  searchDepartureDate: string = '';
  searchReturnDate: string = '';
  searchAdults = 1;
  searchChildren = 0;
  searchInfants = 0;

  sortBy: string = 'price';

  /** Uçuş fiyatlarına göre hesaplanan slider sınırları */
  priceSliderMin: number = 0;
  priceSliderMax: number = 50000;

  filterBy: {
    priceRange: { min: number; max: number };
    stops: number | null;
    airlines: string[];
    departureTime: { min: string; max: string };
  } = {
    priceRange: { min: 0, max: 50000 },
    stops: null,
    airlines: [],
    departureTime: { min: '00:00', max: '23:59' }
  };

  selectedFlight: Flight | null = null;
  showFilters: boolean = false;
  expandedBrandOptions: Set<string> = new Set(); // Açık olan paket seçenekleri (flight.id)
  brandSliderIndex: Map<string, number> = new Map(); // Her flight için slider index (flight.id -> index)
  isLoading: boolean = false; // Servisten sonuç bekleniyor mu?
  hasSearchResult: boolean = false; // En az bir kere gerçek arama sonucu geldi mi?
  skeletonItems: number[] = [1, 2, 3]; // Skeleton kart sayısı
  selectedBrandByFlight: Map<string, string> = new Map(); // Her uçuş için seçili paket (flight.id -> brand.id)
  selectedOutboundFlightId?: string;
  selectedReturnFlightId?: string;

  /** Detaylar paneli açık olan uçuş (tek seferde bir kart) */
  expandedDetailsFlightId: string | null = null;

  /** IATA koda göre havayolu adı ve logo (client-api /admin havayollarından) */
  airlinesByCode: Map<string, { name: string; logoUrl?: string }> = new Map();

  /** AirSearch session bilgileri - Allocate için gerekli */
  currentSessionId?: string;
  currentSessionToken?: string;
  currentShoppingFileId?: string;

  sortOptions = [
    { value: 'price', label: 'Fiyat (Düşükten Yükseğe)', icon: 'attach_money' },
    { value: 'duration', label: 'Süre (Kısadan Uzuna)', icon: 'schedule' },
    { value: 'departure', label: 'Kalkış Saati (Erken-Geç)', icon: 'flight_takeoff' },
    { value: 'arrival', label: 'Varış Saati (Erken-Geç)', icon: 'flight_land' }
  ];

  getSortLabel(): string {
    const option = this.sortOptions.find(opt => opt.value === this.sortBy);
    return option ? option.label : 'Sıralama Seçeneği';
  }

  getCurrentSortIcon(): string {
    const option = this.sortOptions.find(opt => opt.value === this.sortBy);
    return option ? option.icon : 'sort';
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  private isBrowser: boolean;

  private loadingDialogRef: MatDialogRef<FlightSearchLoadingDialogComponent> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly api: BiletbankApiService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: object,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // SSR'da API çağrısı yapma - browser'da çalışsın
    if (!this.isBrowser) {
      this.isLoading = true;
      return;
    }

    // Hydration tamamlandıktan sonra çalıştır
    setTimeout(() => {
      this.loadAirlines();
      this.initSearch();
    }, 0);
  }

  private initSearch(): void {
    this.route.queryParams.subscribe(params => {
      const origin = (params['origin'] || '').toString().toUpperCase();
      const destination = (params['destination'] || '').toString().toUpperCase();
      const departureDate = params['departureDate'] as string | undefined;
      const returnDate = params['returnDate'] as string | undefined;
      const tripType = (params['tripType'] || 'RT') as 'OW' | 'RT';
      const adults = Number(params['adults'] || 1);
      const children = Number(params['children'] || 0);
      const infants = Number(params['infants'] || 0);

      // Location metadata (LocationSelector'dan gelen dinamik değerler, fallback: TR / false)
      const originCountryCode = (params['originCountryCode'] || 'TR').toString().toUpperCase();
      const originIsCity = params['originIsCity'] === 'true';
      const destinationCountryCode = (params['destinationCountryCode'] || 'TR').toString().toUpperCase();
      const destinationIsCity = params['destinationIsCity'] === 'true';

      if (origin && destination && departureDate) {
        this.searchTripType = tripType;
        this.searchOriginCode = origin;
        this.searchDestinationCode = destination;
        this.searchDepartureDate = departureDate || '';
        this.searchReturnDate = returnDate || '';
        this.searchAdults = adults;
        this.searchChildren = children;
        this.searchInfants = infants;
        this.isLoading = true;
        this.hasSearchResult = false;
        this.filteredFlights = [];

        // Üyeliksiz (misafir) akış da dahil olmak üzere her zaman SearchAndBook kullan.
        // SearchOnly session bilgisi (sessionId/sessionToken/shoppingFileId) döndürmediğinden
        // Allocate adımına geçilemez. Misafir kullanıcılar da bilet satın alabilmeli.
        const searchReason: 'SearchAndBook' = 'SearchAndBook';
        
        this.loadFromApi({
          tripType,
          originCode: origin,
          originCountryCode,
          originIsCity,
          destinationCode: destination,
          destinationCountryCode,
          destinationIsCity,
          departureDate,
          returnDate,
          adults,
          children,
          infants,
          searchReason,
        });
      } else {
        this.searchTripType = 'RT';
        this.searchOriginCode = '';
        this.searchDestinationCode = '';
        this.searchDepartureDate = '';
        this.searchReturnDate = '';
        this.searchAdults = 1;
        this.searchChildren = 0;
        this.searchInfants = 0;
        this.recalcPriceBounds();
        this.filteredFlights = [...this.flights];
        this.sortFlights();
        this.updateOutboundReturnLists();
        this.hasSearchResult = true;
      }
    });
  }

  private loadAirlines(): void {
    this.api.getAirlines().subscribe({
      next: (res) => {
        this.airlinesByCode = new Map();
        (res.airlines || []).forEach((a: { code: string; name: string; logoUrl?: string }) => {
          const code = (a.code || '').trim().toUpperCase();
          if (code) {
            this.airlinesByCode.set(code, { name: a.name || code, logoUrl: a.logoUrl });
          }
        });
      },
      error: () => {
        this.airlinesByCode = new Map();
      },
    });
  }

  /** Uçuş arama loading dialog'unu kapatır */
  private closeLoadingDialog(): void {
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      this.loadingDialogRef = null;
    }
  }

  /** Uçuş kartında göstermek için havayolu adı ve logo (veritabanı eşlemesi) */
  getAirlineForFlight(flight: Flight): { name: string; logoUrl?: string } {
    const code = (flight.airlineLogo || flight.airline || '').trim().toUpperCase();
    const found = code ? this.airlinesByCode.get(code) : undefined;
    if (found) {
      return found;
    }
    const fallbackName = (flight.airline || flight.airlineLogo || '—').trim();
    return { name: fallbackName, logoUrl: undefined };
  }

  private loadFromApi(body: import('../../core/biletbank-api.service').AirSearchRequestBody): void {
    if (this.isBrowser && !this.loadingDialogRef) {
      this.loadingDialogRef = this.dialog.open(FlightSearchLoadingDialogComponent, {
        disableClose: true,
        panelClass: 'flight-search-loading-dialog-panel',
        width: '480px',
      });
    }

    this.api.searchFlights(body).subscribe({
      next: (res: import('../../core/biletbank-api.service').AirSearchResponseDto) => {
        const dtoFlights = (res.flights || []) as AirSearchFlightDto[];
        
        this.isLoading = false;
        this.hasSearchResult = true;
        this.closeLoadingDialog();

        // Session bilgilerini sakla (Allocate için gerekli)
        if (res.sessionId && res.sessionToken && res.shoppingFileId) {
          this.currentSessionId = res.sessionId;
          this.currentSessionToken = res.sessionToken;
          this.currentShoppingFileId = res.shoppingFileId;
        }

        if (!dtoFlights.length) {
          this.filteredFlights = [];
          this.updateOutboundReturnLists();
          this.toast.warning('Arama kriterlerinize uygun uçuş bulunamadı.');
        } else {
          this.flights = dtoFlights.map(f => this.mapDtoToFlight(f));
          this.recalcPriceBounds();
          this.filteredFlights = [...this.flights];
          this.sortFlights();
        }

        // Hydration sonrası DOM güncellemesini zorla
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        // 401 hatası - token geçersiz veya süresi dolmuş
        if (error?.status === 401) {
          if (body.searchReason === 'SearchAndBook') {
            // Token geçersiz veya süresi dolmuş, SearchOnly ile tekrar dene
            this.toast.warning('Oturum süreniz dolmuş veya giriş yapmanız gerekiyor. Sadece arama yapılıyor...');
            const fallbackBody = { ...body, searchReason: 'SearchOnly' as const };
            this.loadFromApi(fallbackBody);
            return;
          }
          // SearchOnly ile bile 401 alınıyorsa, bu beklenmeyen bir durum
          // Backend'de SearchOnly için auth gerekmez, bu durumda backend hatası var
        }
        
        this.isLoading = false;
        this.hasSearchResult = true;
        this.filteredFlights = [];
        this.updateOutboundReturnLists();
        this.closeLoadingDialog();
        this.cdr.detectChanges();
        
        // Hata mesajı göster
        const rawMsg: string = error?.error?.message || error?.message || '';
        const errorMessage = this.toUserFriendlySearchError(rawMsg);
        this.toast.error(errorMessage);
      },
    });
  }

  /** "2026-07-09" → "9 Temmuz 2026, Perşembe" */
  formatSearchDate(dateStr: string): string {
    if (!dateStr) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
    if (!m) return dateStr;
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const days   = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
    const y = +m[1], mo = +m[2] - 1, d = +m[3];
    const weekday = days[new Date(Date.UTC(y, mo, d)).getUTCDay()];
    return `${d} ${months[mo]} ${y}, ${weekday}`;
  }

  /** Teknik hata mesajlarını kullanıcı dostu metne çevirir */
  private toUserFriendlySearchError(raw: string): string {
    const r = raw.toLowerCase();
    if (r.includes('eai_again') || r.includes('getaddrinfo') || r.includes('enotfound')) {
      return 'Uçuş sağlayıcısına bağlanılamıyor. Lütfen birkaç dakika sonra tekrar deneyin.';
    }
    if (r.includes('econnrefused') || r.includes('econnreset') || r.includes('etimedout') || r.includes('timeout')) {
      return 'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.';
    }
    if (r.includes('network') || r.includes('fetch') || r.includes('socket')) {
      return 'Ağ hatası oluştu. İnternet bağlantınızı kontrol edip tekrar deneyin.';
    }
    if (r.includes('500') || r.includes('internal server')) {
      return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
    }
    if (raw && raw.length < 120 && !r.includes('apitest') && !r.includes('http')) {
      return raw; // Güvenli, kısa backend mesajı — göster
    }
    return 'Uçuş arama sırasında bir hata oluştu. Lütfen tekrar deneyin.';
  }

  /** Filtrelenmiş listeyi gidiş / dönüş olarak ayırır */
  private updateOutboundReturnLists(): void {
    const origin = this.searchOriginCode.trim().toUpperCase();
    const dest = this.searchDestinationCode.trim().toUpperCase();
    if (this.searchTripType !== 'RT' || !origin || !dest) {
      this.filteredRoundTripFlights = [];
      this.filteredOutboundFlights = [...this.filteredFlights];
      this.filteredReturnFlights = [];
      return;
    }

    this.filteredRoundTripFlights = [];
    this.filteredOutboundFlights = [];
    this.filteredReturnFlights = [];

    this.filteredFlights.forEach((flight) => {
      const direction = this.getFlightDirection(flight, origin, dest);
      if (direction === 'outbound') {
        this.filteredOutboundFlights.push(flight);
      } else if (direction === 'return') {
        this.filteredReturnFlights.push(flight);
      } else {
        this.filteredRoundTripFlights.push(flight);
      }
    });
  }

  private getFlightDirection(flight: Flight, origin: string, dest: string): 'outbound' | 'return' | 'roundTrip' {
    const segments = flight.segments || [];
    const hasOutbound = this.hasJourney(segments, origin, dest);
    const hasReturn = this.hasJourney(segments, dest, origin);

    if (hasOutbound && hasReturn) return 'roundTrip';

    const optionFlag = (flight.optionFlag || '').trim().toUpperCase();
    if (optionFlag === 'OUT') return 'outbound';
    if (optionFlag === 'IN') return 'return';

    const dep = (flight.departure.airportCode || '').toUpperCase();
    const arr = (flight.arrival.airportCode || '').toUpperCase();

    if (dep === origin && arr === dest) return 'outbound';
    if (dep === dest && arr === origin) return 'return';
    if (hasOutbound) return 'outbound';
    if (hasReturn) return 'return';

    return 'roundTrip';
  }

  private hasJourney(segments: Flight['segments'], from: string, to: string): boolean {
    if (!segments?.length) return false;

    let started = false;
    for (const segment of segments) {
      const origin = (segment.originCode || '').trim().toUpperCase();
      const destination = (segment.destinationCode || '').trim().toUpperCase();

      if (origin === from) {
        started = true;
      }
      if (started && destination === to) {
        return true;
      }
    }

    return false;
  }

  getDisplayDeparture(flight: Flight): Flight['departure'] {
    if (this.searchTripType !== 'RT') return flight.departure;

    const origin = this.searchOriginCode.trim().toUpperCase();
    const dest = this.searchDestinationCode.trim().toUpperCase();
    if (!origin || !dest || this.getFlightDirection(flight, origin, dest) !== 'roundTrip') {
      return flight.departure;
    }

    const segment = (flight.segments || []).find((s) => (s.originCode || '').trim().toUpperCase() === origin);
    if (!segment) return flight.departure;

    const airportCode = (segment.originCode || flight.departure.airportCode || '').trim().toUpperCase();
    return {
      airport: this.getAirportLabel(airportCode),
      airportCode,
      city: '',
      time: this.formatSegmentTime(segment.departureDateTime),
      date: this.formatSegmentDate(segment.departureDateTime),
    };
  }

  getDisplayArrival(flight: Flight): Flight['arrival'] {
    if (this.searchTripType !== 'RT') return flight.arrival;

    const origin = this.searchOriginCode.trim().toUpperCase();
    const dest = this.searchDestinationCode.trim().toUpperCase();
    if (!origin || !dest || this.getFlightDirection(flight, origin, dest) !== 'roundTrip') {
      return flight.arrival;
    }

    let started = false;
    const segment = (flight.segments || []).find((s) => {
      const segmentOrigin = (s.originCode || '').trim().toUpperCase();
      const segmentDestination = (s.destinationCode || '').trim().toUpperCase();
      if (segmentOrigin === origin) started = true;
      return started && segmentDestination === dest;
    });
    if (!segment) return flight.arrival;

    const airportCode = (segment.destinationCode || flight.arrival.airportCode || '').trim().toUpperCase();
    return {
      airport: this.getAirportLabel(airportCode),
      airportCode,
      city: '',
      time: this.formatSegmentTime(segment.arrivalDateTime),
      date: this.formatSegmentDate(segment.arrivalDateTime),
    };
  }

  private mapDtoToFlight(src: AirSearchFlightDto): Flight {
    // Süre stringini mevcut parseDuration ile uyumlu hale getirelim
    let duration = src.duration;
    if (duration && duration.includes(':')) {
      const [h, m] = duration.split(':').map(v => parseInt(v, 10) || 0);
      duration = `${h}s ${m}d`;
    }

    return {
      id: src.id,
      airline: src.airline,
      airlineLogo: src.airlineLogo,
      flightNumber: src.flightNumber,
      departure: {
        airport: src.departure.airport || '',
        airportCode: src.departure.airportCode,
        city: src.departure.city || '',
        time: src.departure.time,
        date: src.departure.date,
      },
      arrival: {
        airport: src.arrival.airport || '',
        airportCode: src.arrival.airportCode,
        city: src.arrival.city || '',
        time: src.arrival.time,
        date: src.arrival.date,
      },
      duration: duration || '',
      stops: src.stops,
      stopDetails: src.stopDetails,
      price: src.price,
      currency: src.currency,
      baggage: src.baggage,
      cabinClass: src.cabinClass,
      aircraft: src.aircraft,
      segments: (src as any).segments,
      brandOptions: src.brandOptions,
      optionFlag: src.optionFlag,
    };
  }

  private mapFlightForBooking(flight: Flight) {
    return {
      id: flight.id,
      airline: flight.airline,
      airlineLogo: this.airlinesByCode.get((flight.airlineLogo || flight.airline || '').trim().toUpperCase())?.logoUrl || flight.airlineLogo,
      flightNumber: flight.flightNumber,
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      price: flight.price,
      currency: flight.currency,
    };
  }

  private mapBrandForBooking(brand: FlightBrandOption) {
    return {
      id: brand.id,
      brandId: brand.brandId,
      brandName: brand.brandName,
      brandCode: brand.brandCode,
      baggageAllowanceId: brand.baggageAllowanceId,
      baggageDescription: brand.baggageDescription,
      rules: brand.rules,
      totalFare: brand.totalFare,
      totalTaxes: brand.totalTaxes,
      currency: brand.currency,
    };
  }

  private createBookingLeg(direction: 'outbound' | 'return' | 'roundTrip' | 'single', flight: Flight) {
    const selectedBrandId = this.selectedBrandByFlight.get(flight.id);
    const selectedBrand = selectedBrandId
      ? flight.brandOptions?.find((brand) => brand.id === selectedBrandId)
      : undefined;

    return {
      direction,
      title:
        direction === 'outbound'
          ? 'Gidiş'
          : direction === 'return'
            ? 'Dönüş'
            : direction === 'roundTrip'
              ? 'Gidiş-Dönüş'
              : 'Uçuş',
      productId: flight.id,
      brandedFareItemId: selectedBrandId,
      selectedBrand: selectedBrand ? this.mapBrandForBooking(selectedBrand) : null,
      flight: this.mapFlightForBooking(flight),
      allBrandOptions: flight.brandOptions ? flight.brandOptions.map((brand) => this.mapBrandForBooking(brand)) : [],
    };
  }

  private buildBookingLegs(selectedFlight: Flight) {
    const direction = this.getCurrentFlightDirection(selectedFlight);
    if (direction === 'return' && this.selectedOutboundFlightId) {
      const outboundFlight = this.flights.find((flight) => flight.id === this.selectedOutboundFlightId);
      if (outboundFlight) {
        return [
          this.createBookingLeg('outbound', outboundFlight),
          this.createBookingLeg('return', selectedFlight),
        ];
      }
    }

    return [
      this.createBookingLeg(direction === 'roundTrip' ? 'roundTrip' : 'single', selectedFlight),
    ];
  }

  /** Uçuş fiyatlarına göre slider sınırlarını ve filterBy değerlerini günceller */
  private recalcPriceBounds(): void {
    if (!this.flights.length) return;
    const prices = this.flights.map(f => f.price);
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const step = 50;
    this.priceSliderMin = Math.max(0, Math.floor(rawMin / step) * step);
    this.priceSliderMax = Math.ceil(rawMax / step) * step + step;
    this.filterBy.priceRange.min = this.priceSliderMin;
    this.filterBy.priceRange.max = this.priceSliderMax;
  }

  sortFlights(): void {
    this.filteredFlights = [...this.filteredFlights].sort((a, b) => {
      switch (this.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          const aDuration = this.parseDuration(a.duration);
          const bDuration = this.parseDuration(b.duration);
          return aDuration - bDuration;
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time);
        case 'arrival':
          return a.arrival.time.localeCompare(b.arrival.time);
        default:
          return 0;
      }
    });
    this.updateOutboundReturnLists();
  }

  parseDuration(duration: string): number {
    // Parse "3s 15d" format to minutes
    const parts = duration.split(' ');
    let totalMinutes = 0;
    parts.forEach(part => {
      if (part.includes('s')) {
        totalMinutes += parseInt(part.replace('s', '')) * 60;
      } else if (part.includes('d')) {
        totalMinutes += parseInt(part.replace('d', ''));
      }
    });
    return totalMinutes;
  }

  onSortChange(sortBy: string): void {
    this.sortFlights();
  }

  onFilterChange(): void {
    this.filteredFlights = this.flights.filter(flight => {
      if (flight.price < this.filterBy.priceRange.min || flight.price > this.filterBy.priceRange.max) {
        return false;
      }

      if (this.filterBy.stops !== null && flight.stops !== this.filterBy.stops) {
        return false;
      }

      if (this.filterBy.airlines.length > 0) {
        const airlineName = this.getAirlineForFlight(flight).name;
        if (!this.filterBy.airlines.includes(airlineName)) {
          return false;
        }
      }

      const depTime = flight.departure.time;
      if (depTime && this.filterBy.departureTime.min && depTime < this.filterBy.departureTime.min) {
        return false;
      }
      if (depTime && this.filterBy.departureTime.max && depTime > this.filterBy.departureTime.max) {
        return false;
      }

      return true;
    });

    this.sortFlights();
  }

  resetFilters(): void {
    this.filterBy.priceRange.min = this.priceSliderMin;
    this.filterBy.priceRange.max = this.priceSliderMax;
    this.filterBy.stops = null;
    this.filterBy.airlines = [];
    this.filterBy.departureTime = { min: '00:00', max: '23:59' };
    this.filteredFlights = [...this.flights];
    this.sortFlights();
  }

  getUniqueAirlines(): string[] {
    return [...new Set(this.flights.map((f) => this.getAirlineForFlight(f).name))];
  }

  getUniqueAirlinesWithLogo(): { name: string; logoUrl?: string }[] {
    const seen = new Map<string, { name: string; logoUrl?: string }>();
    for (const f of this.flights) {
      const info = this.getAirlineForFlight(f);
      if (!seen.has(info.name)) {
        seen.set(info.name, { name: info.name, logoUrl: info.logoUrl });
      }
    }
    return [...seen.values()];
  }

  // Math.max için template'te kullanmak üzere
  Math = Math;

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  selectFlight(flight: Flight): void {
    this.selectedFlight = flight;
    this.markRoundTripSelection(flight);
    // Paket seçeneklerini aç/kapat
    if (flight.brandOptions && flight.brandOptions.length > 0) {
      if (this.expandedBrandOptions.has(flight.id)) {
        this.expandedBrandOptions.delete(flight.id);
      } else {
        this.expandedBrandOptions.add(flight.id);
      }
    }
  }

  isBrandOptionsExpanded(flightId: string): boolean {
    return this.expandedBrandOptions.has(flightId);
  }

  isCompactOutboundFlight(flight: Flight): boolean {
    if (!this.selectedOutboundFlightId || flight.id === this.selectedOutboundFlightId) {
      return false;
    }
    return this.getCurrentFlightDirection(flight) === 'outbound';
  }

  getServiceGroupIcon(serviceGroup?: string): string {
    switch (serviceGroup) {
      case 'BG':
        return 'luggage';
      case 'CY':
        return 'work';
      case 'SE':
        return 'airline_seat_recline_normal';
      case 'VC':
        return 'swap_horiz';
      case 'ML':
        return 'restaurant';
      default:
        return 'info';
    }
  }

  getServiceGroupLabel(serviceGroup?: string): string {
    switch (serviceGroup) {
      case 'BG':
        return 'Bagaj';
      case 'CY':
        return 'El Bagajı';
      case 'SE':
        return 'Koltuk';
      case 'VC':
        return 'Değişiklik/İptal';
      case 'ML':
        return 'Yemek';
      default:
        return 'Diğer';
    }
  }

  /** Detaylar butonuna tıklanınca paneli aç/kapat */
  toggleFlightDetails(flightId: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.expandedDetailsFlightId = this.expandedDetailsFlightId === flightId ? null : flightId;
  }

  isDetailsExpanded(flightId: string): boolean {
    return this.expandedDetailsFlightId === flightId;
  }

  /** Segment tarih/saat string'ini HH:mm formatına çevirir */
  formatSegmentTime(isoOrEmpty?: string): string {
    if (!isoOrEmpty) return '—';
    const d = new Date(isoOrEmpty);
    if (Number.isNaN(d.getTime())) return isoOrEmpty;
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  formatSegmentDate(isoOrEmpty?: string): string {
    if (!isoOrEmpty) return '';
    const d = new Date(isoOrEmpty);
    if (Number.isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Havalimanı kodu → okunabilir etiket (Şehir / Havalimanı adı) */
  private static readonly AIRPORT_LABELS: Record<string, string> = {
    IST: 'İstanbul Havalimanı',
    SAW: 'Sabiha Gökçen (İstanbul)',
    AYT: 'Antalya',
    ADB: 'İzmir',
    ESB: 'Ankara Esenboğa',
    FCO: 'Roma Fiumicino',
    BRI: 'Bari',
    MXP: 'Milano Malpensa',
    VCE: 'Venedik',
    CDG: 'Paris Charles de Gaulle',
    ORY: 'Paris Orly',
    LHR: 'Londra Heathrow',
    AMS: 'Amsterdam',
    FRA: 'Frankfurt',
    MUC: 'Münih',
    DXB: 'Dubai',
  };

  getAirportLabel(code: string): string {
    if (!code || !code.trim()) return '—';
    const c = code.trim().toUpperCase();
    return FlightResultsComponent.AIRPORT_LABELS[c] || c;
  }

  /** Süreyi "01:05" → "1 saat 5 dk" formatına çevirir */
  formatDurationReadable(duration?: string): string {
    if (!duration || !duration.trim()) return '—';
    const s = duration.trim();
    const m = s.match(/^(\d+):(\d+)$/);
    if (m) {
      const h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      if (h > 0 && min > 0) return `${h} saat ${min} dk`;
      if (h > 0) return `${h} saat`;
      if (min > 0) return `${min} dk`;
    }
    return s;
  }

  /** Segment havayolu kodu için tam ad (TK → Turkish Airlines) */
  getAirlineNameForCode(code: string): string {
    if (!code) return '—';
    const c = code.trim().toUpperCase();
    const info = this.airlinesByCode.get(c);
    return info?.name || c;
  }

  selectBrand(flight: Flight, brand: { id: string }, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (!brand?.id || !flight?.id) {
      return;
    }
    this.selectedFlight = flight;
    this.markRoundTripSelection(flight);
    this.selectedBrandByFlight.set(flight.id, brand.id);
  }

  isBrandSelected(flightId: string, brandId: string): boolean {
    return this.selectedBrandByFlight.get(flightId) === brandId;
  }

  /** Bilinen marka kodları → Türkçe etiket haritası */
  private static readonly BRAND_LABEL_MAP: Record<string, string> = {
    ECO: 'Ekonomi',
    ECONOMY: 'Ekonomi',
    SUPER_ECO: 'Süper Ekonomi',
    SUPER_ECONOMY: 'Süper Ekonomi',
    BASIC: 'Temel',
    BASIC_ECONOMY: 'Temel Ekonomi',
    ADVANTAGE: 'Avantaj',
    EXTRA: 'Ekstra',
    COMFORT: 'Konfor',
    COMFORT_FLEX: 'Konfor Flex',
    BUSINESS: 'Business',
    BUSINESS_FLEX: 'Business Flex',
    PREMIUM: 'Premium',
    PREMIUM_ECO: 'Premium Ekonomi',
    FLEX: 'Esnek',
    PROMO: 'Promosyon',
  };

  /** Paket kural açıklamaları (İngilizce → Türkçe) – madde madde gelen metinler */
  private static readonly RULE_DESCRIPTION_TR: Record<string, string> = {
    // Bagaj
    '1 Piece Carry On Baggage (55x40x20 cm)': '1 adet el bagajı (55x40x20 cm)',
    '1 Piece Carry On Baggage': '1 adet el bagajı',
    'Carry On Baggage': 'El bagajı',
    'Checked Baggage': 'Bagaj hakkı',
    'No Carry On Baggage': 'El bagajı dahil değil',
    'No Checked Baggage': 'Bagaj hakkı yok',
    'Personal Item': 'Kişisel eşya (el çantası)',
    'One personal item': '1 adet kişisel eşya',
    'Hand baggage': 'El bagajı',
    'Cabin baggage': 'Kabin bagajı',
    'Piece': 'Adet',
    // Koltuk
    'Seat Selection': 'Koltuk seçimi',
    'Seat selection': 'Koltuk seçimi',
    'No seat selection': 'Koltuk seçimi dahil değil',
    'Standard seat': 'Standart koltuk',
    'Extra legroom seat': 'Ekstra bacak mesafeli koltuk',
    'Extra Legroom': 'Ekstra bacak mesafesi',
    'Recline': 'Yatırılabilir koltuk',
    'No recline': 'Yatırılamaz koltuk',
    'Preferred seat': 'Tercihli koltuk',
    'Standard seat only': 'Sadece standart koltuk',
    // Yemek / İkram
    'Meal': 'Yemek servisi',
    'Meal Service': 'Yemek servisi',
    'No meal': 'Yemek dahil değil',
    'Snack': 'Atıştırmalık',
    'Beverage': 'İçecek',
    'Complimentary meal': 'Ücretsiz yemek',
    'Buy on board': 'Uçakta satın alınabilir',
    'No complimentary meal': 'Ücretsiz yemek yok',
    // İade / Değişiklik / İptal
    'Non-refundable': 'İade edilmez',
    'Refundable': 'İade edilebilir',
    'Change/Cancel': 'Değişiklik / İptal',
    'Change and Cancel': 'Değişiklik ve iptal',
    'Fare is non-refundable': 'Ücret iade edilmez',
    'Fare is refundable': 'Ücret iade edilebilir',
    'Changes allowed': 'Değişiklik yapılabilir',
    'No changes allowed': 'Değişiklik yapılamaz',
    'Cancellation allowed': 'İptal yapılabilir',
    'No cancellation': 'İptal yapılamaz',
    'Change fee applies': 'Değişiklik ücreti uygulanır',
    'Cancellation fee applies': 'İptal ücreti uygulanır',
    'Refundable with fee': 'Ücret karşılığında iade edilebilir',
    'Non-refundable fare': 'İade edilmeyen tarife',
    // Biniş / Öncelik
    'Priority Boarding': 'Öncelikli biniş',
    'Priority boarding': 'Öncelikli biniş',
    'Standard boarding': 'Standart biniş',
    'Group boarding': 'Grup binişi',
    // Uçuş içi hizmetler
    'In-flight Entertainment': 'Uçuş içi eğlence',
    'In-Flight Entertainment': 'Uçuş içi eğlence',
    'Inflight Entertainment': 'Uçuş içi eğlence',
    'No In-flight Entertainment': 'Uçuş içi eğlence dahil değil',
    // Genel
    'Included': 'Dahil',
    'Not included': 'Dahil değil',
    'Free': 'Ücretsiz',
    'Paid': 'Ücretli',
    'Available': 'Mevcut',
    'Not available': 'Mevcut değil',
    'Optional': 'İsteğe bağlı',
    'Chargeable': 'Ücretli',
    'Pre-reserved seat': 'Önceden rezerve koltuk',
    'Advance seat selection': 'Önceden koltuk seçimi',
    'No advance seat selection': 'Önceden koltuk seçimi yok',
    '15 * KG Checked Baggage': '15 kg bagaj hakkı',
    '20 * KG Checked Baggage': '20 kg bagaj hakkı',
    '23 * KG Checked Baggage': '23 kg bagaj hakkı',
    '15 * KG Checked Baggage.': '15 kg bagaj hakkı',
    '20 * KG Checked Baggage.': '20 kg bagaj hakkı',
    '23 * KG Checked Baggage.': '23 kg bagaj hakkı',
    // BiletBank / API’den gelen tam İngilizce ifadeler
    'NONCHANGEABLE': 'Değişiklik yapılamaz',
    'NONREFUNDABLE': 'İade edilmez',
    'ONLINE MESSAGE RIGHT': 'Çevrimiçi mesaj hakkı',
    'CHANGE WITH PENALTY': 'Ücret karşılığında değişiklik',
    'CHANGE WITHOUT PENALTY': 'Ücretsiz değişiklik',
    'REFUND WITH PENALTY': 'Ücret karşılığında iade',
    'REFUND WITHOUT PENALTY': 'Ücretsiz iade',
    'STANDARD Koltuk seçimi': 'Standart koltuk seçimi',
    'FRONT Koltuk seçimi': 'Ön koltuk seçimi',
    '25 PERCENT EXTRA MILES': '%25 ekstra mil',
    '50 PERCENT EXTRA MILES': '%50 ekstra mil',
    'LOUNGE USE IF AVAILABLE': 'Salon kullanımı (müsaitse)',
    'INTERNET PACKAGE RIGHT': 'İnternet paketi hakkı',
    'PRIORITY CHECK IN': 'Öncelikli check-in',
    'FAST TRACK IF AVAILABLE': 'Hızlı geçiş (müsaitse)',
    'SAMEDAY CHANGE TO EARLY FLIGHT': 'Aynı gün erken uçuşa değişiklik',
    '1 adet X 8 KG CABIN Bagaj': '1 adet 8 kg kabin bagajı',
    '2 PIECES X 8 KG CABIN Bagaj': '2 adet 8 kg kabin bagajı',
    'PIECES': 'adet',
    'CABIN': 'kabin',
    'Changeable Ticket': 'Değiştirilebilir bilet',
    'Refundable Ticket': 'İade edilebilir bilet',
    'Non-refundable Ticket': 'İade edilmez bilet',
    'İade edilebilir TICKET': 'İade edilebilir bilet',
    'İade edilmez TICKET': 'İade edilmez bilet',
    'PREFERRED Koltuk seçimi': 'Tercihli koltuk seçimi',
    'Preferred Seat selection': 'Tercihli koltuk seçimi',
    'TICKET': 'bilet',
    'PREFERRED': 'Tercihli',
  };

  getBrandDisplayName(brand: { brandName?: string; brandCode?: string }): string {
    const raw = (brand?.brandName || brand?.brandCode || '').trim().toUpperCase();
    if (!raw) return 'Paket';
    return FlightResultsComponent.BRAND_LABEL_MAP[raw] || brand?.brandName?.trim() || brand?.brandCode?.trim() || 'Paket';
  }

  /** Kural açıklamasını Türkçe’ye çevirir (API genelde İngilizce döner). */
  getRuleDescriptionLabel(rule: { ruleDescription?: string }): string {
    const raw = this.getRuleDescription(rule);
    if (!raw || !raw.trim()) return '';
    const trimmed = raw.trim();
    const exact = FlightResultsComponent.RULE_DESCRIPTION_TR[trimmed]
      ?? FlightResultsComponent.RULE_DESCRIPTION_TR[trimmed.toLowerCase()];
    if (exact) return exact;
    for (const [en, tr] of Object.entries(FlightResultsComponent.RULE_DESCRIPTION_TR)) {
      if (trimmed.toLowerCase() === en.toLowerCase()) return tr;
    }
    const kgMatch = trimmed.match(/^(\d+)\s*\*\s*KG\s+Checked\s+Baggage/i);
    if (kgMatch) return `${kgMatch[1]} kg bagaj hakkı`;
    const pieceCmMatch = trimmed.match(/^(\d+)\s*Piece\s+Carry\s+On\s+Baggage\s*\(([^)]+)\)/i);
    if (pieceCmMatch) return `${pieceCmMatch[1]} adet el bagajı (${pieceCmMatch[2]})`;
    const pieceMatch = trimmed.match(/^(\d+)\s*Piece\s+Carry\s+On\s+Baggage/i);
    if (pieceMatch) return `${pieceMatch[1]} adet el bagajı`;
    const kgOnlyMatch = trimmed.match(/(\d+)\s*\*\s*KG/i);
    if (kgOnlyMatch && /baggage|bagaj|checked|el\s+bagaj/i.test(trimmed)) return `${kgOnlyMatch[1]} kg bagaj hakkı`;
    if (/carry\s+on\s+baggage/i.test(trimmed) && /^\d+\s*piece/i.test(trimmed)) {
      const n = trimmed.match(/^(\d+)/);
      if (n) return `${n[1]} adet el bagajı`;
    }
    return this.translateRuleDescriptionFallback(trimmed);
  }

  /** Haritada yoksa metin içindeki İngilizce ifadeleri Türkçe ile değiştirir. */
  private translateRuleDescriptionFallback(text: string): string {
    const replacements: [RegExp | string, string][] = [
      [/\bNONCHANGEABLE\b/gi, 'Değişiklik yapılamaz'],
      [/\bNONREFUNDABLE\b/gi, 'İade edilmez'],
      [/\bONLINE MESSAGE RIGHT\b/gi, 'Çevrimiçi mesaj hakkı'],
      [/\bCHANGE WITH PENALTY\b/gi, 'Ücret karşılığında değişiklik'],
      [/\bCHANGE WITHOUT PENALTY\b/gi, 'Ücretsiz değişiklik'],
      [/\bREFUND WITH PENALTY\b/gi, 'Ücret karşılığında iade'],
      [/\bREFUND WITHOUT PENALTY\b/gi, 'Ücretsiz iade'],
      [/\bSTANDARD Koltuk seçimi\b/gi, 'Standart koltuk seçimi'],
      [/\bFRONT Koltuk seçimi\b/gi, 'Ön koltuk seçimi'],
      [/\b25 PERCENT EXTRA MILES\b/gi, '%25 ekstra mil'],
      [/\b50 PERCENT EXTRA MILES\b/gi, '%50 ekstra mil'],
      [/\bLOUNGE USE IF AVAILABLE\b/gi, 'Salon kullanımı (müsaitse)'],
      [/\bINTERNET PACKAGE RIGHT\b/gi, 'İnternet paketi hakkı'],
      [/\bIn-flight Entertainment\b/gi, 'Uçuş içi eğlence'],
      [/\bIn-Flight Entertainment\b/gi, 'Uçuş içi eğlence'],
      [/\bInflight Entertainment\b/gi, 'Uçuş içi eğlence'],
      [/\bPRIORITY CHECK IN\b/gi, 'Öncelikli check-in'],
      [/\bFAST TRACK IF AVAILABLE\b/gi, 'Hızlı geçiş (müsaitse)'],
      [/\bSAMEDAY CHANGE TO EARLY FLIGHT\b/gi, 'Aynı gün erken uçuşa değişiklik'],
      [/X\s*(\d+)\s*KG\s+CABIN\s+Bagaj/gi, '$1 kg kabin bagajı'],
      [/(\d+)\s*KG\s+CABIN\s+Bagaj/gi, '$1 kg kabin bagajı'],
      [/\b(\d+)\s*PIECES\b/gi, '$1 adet'],
      [/\bPIECES\b/gi, 'adet'],
      [/\bCABIN\s+Bagaj\b/gi, 'kabin bagajı'],
      [/\bCABIN\b/gi, 'kabin'],
      [/\bChangeable Ticket\b/gi, 'Değiştirilebilir bilet'],
      [/\bRefundable Ticket\b/gi, 'İade edilebilir bilet'],
      [/\bNon-refundable Ticket\b/gi, 'İade edilmez bilet'],
      [/\bPREFERRED Koltuk seçimi\b/gi, 'Tercihli koltuk seçimi'],
      [/\bPREFERRED\b/gi, 'Tercihli'],
      [/\bTICKET\b/gi, 'bilet'],
      [/\bNo Carry On Baggage\b/gi, 'El bagajı dahil değil'],
      [/\bNo Checked Baggage\b/gi, 'Bagaj hakkı yok'],
      [/\bCarry On Baggage\b/gi, 'El bagajı'],
      [/\bChecked Baggage\b/gi, 'Bagaj hakkı'],
      [/\b(\d+)\s*Piece\b/gi, '$1 adet'],
      [/\bPiece\b/gi, 'adet'],
      [/\bSeat Selection\b/gi, 'Koltuk seçimi'],
      [/\bSeat selection\b/gi, 'Koltuk seçimi'],
      [/\bMeal Service\b/gi, 'Yemek servisi'],
      [/\bNon-refundable\b/gi, 'İade edilmez'],
      [/\bRefundable\b/gi, 'İade edilebilir'],
      [/\bPriority Boarding\b/gi, 'Öncelikli biniş'],
      [/\bExtra Legroom\b/gi, 'Ekstra bacak mesafesi'],
      [/\bPersonal Item\b/gi, 'Kişisel eşya'],
      [/\bStandard seat\b/gi, 'Standart koltuk'],
      [/\bSTANDARD\b/gi, 'Standart'],
      [/\bFRONT\b/gi, 'Ön'],
      [/\bIncluded\b/gi, 'Dahil'],
      [/\bNot included\b/gi, 'Dahil değil'],
      [/\bFree\b/gi, 'Ücretsiz'],
      [/\bPaid\b/gi, 'Ücretli'],
      [/\bOptional\b/gi, 'İsteğe bağlı'],
      [/\bChargeable\b/gi, 'Ücretli'],
      [/\bAllowance\b/gi, 'Hak'],
      [/\bBaggage\b/gi, 'Bagaj'],
    ];
    let result = text;
    for (const [pattern, replacement] of replacements) {
      result = typeof pattern === 'string'
        ? result.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replacement)
        : result.replace(pattern, replacement);
    }
    return result.trim() || text;
  }

  /** cabinClass (brand ismi olabilir) için Türkçe etiket */
  getCabinClassLabel(cabinClass: string): string {
    const raw = (cabinClass || '').trim().toUpperCase();
    return FlightResultsComponent.BRAND_LABEL_MAP[raw] || cabinClass || 'Ekonomi';
  }

  getFilteredRules(rules?: {
    application?: string;
    displayType?: string;
    ruleDescription?: string;
    serviceGroup?: string;
  }[]): {
    application?: string;
    displayType?: string;
    ruleDescription?: string;
    serviceGroup?: string;
  }[] {
    if (!rules || !Array.isArray(rules)) return [];
    return rules.filter(rule => {
      const desc = this.getRuleDescription(rule);
      return desc && desc.trim() !== '' && desc !== '[object Object]' && desc !== 'true' && desc !== 'false';
    });
  }

  getRuleDescription(rule: { ruleDescription?: string | any }): string {
    if (!rule?.ruleDescription) return '';
    
    const desc = rule.ruleDescription;
    
    // Boolean değerleri filtrele
    if (typeof desc === 'boolean') {
      return '';
    }
    
    // Eğer string ise direkt döndür
    if (typeof desc === 'string') {
      const trimmed = desc.trim();
      // "[object Object]" ve geçersiz string'leri filtrele
      if (trimmed === '[object Object]' || trimmed === 'undefined' || trimmed === 'null' || trimmed === 'true' || trimmed === 'false') {
        return '';
      }
      return trimmed;
    }
    
    // Eğer obje ise, tüm olası property'leri kontrol et
    if (typeof desc === 'object' && desc !== null) {
      // Önce yaygın property'leri kontrol et
      if (desc.text && typeof desc.text === 'string') {
        return desc.text.trim();
      }
      if (desc.value && typeof desc.value === 'string') {
        return desc.value.trim();
      }
      if (desc._text && typeof desc._text === 'string') {
        return desc._text.trim();
      }
      if (desc._ && typeof desc._ === 'string') {
        return desc._.trim();
      }
      
      // Eğer array ise ilk elemanı al
      if (Array.isArray(desc) && desc.length > 0) {
        const first = desc[0];
        return typeof first === 'string' ? first.trim() : '';
      }
      
      // Tek property'li obje ise onu al
      const keys = Object.keys(desc);
      if (keys.length === 1) {
        const value = desc[keys[0]];
        if (typeof value === 'string') {
          return value.trim();
        }
      }
      
      // Obje ise ve anlamlı bir property yoksa boş string döndür
      return '';
    }
    
    // Diğer durumlar için string'e çevir ama geçersiz değerleri filtrele
    const str = String(desc).trim();
    if (str === '[object Object]' || str === 'undefined' || str === 'null' || str === 'true' || str === 'false') {
      return '';
    }
    return str;
  }

  shouldShowSlider(flightId: string, brandOptionsCount: number): boolean {
    return brandOptionsCount > 3;
  }

  getSliderIndex(flightId: string): number {
    return this.brandSliderIndex.get(flightId) || 0;
  }

  setSliderIndex(flightId: string, index: number): void {
    this.brandSliderIndex.set(flightId, index);
  }

  slideBrandOptions(flightId: string, direction: 'prev' | 'next', totalCount: number): void {
    const currentIndex = this.getSliderIndex(flightId);
    let newIndex = currentIndex;

    if (direction === 'prev') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      const maxIndex = this.getSliderMaxIndex(totalCount);
      newIndex = Math.min(maxIndex, currentIndex + 1);
    }

    this.setSliderIndex(flightId, newIndex);
  }

  canSlidePrev(flightId: string): boolean {
    return this.getSliderIndex(flightId) > 0;
  }

  canSlideNext(flightId: string, totalCount: number): boolean {
    const currentIndex = this.getSliderIndex(flightId);
    const maxIndex = this.getSliderMaxIndex(totalCount);
    return currentIndex < maxIndex;
  }

  getVisibleBrandOptions(flightId: string, brandOptions: any[]): any[] {
    // Slider modunda bile tüm kartları render ediyoruz, transform ile görünür yapıyoruz
    return brandOptions;
  }

  getSliderTransform(flightId: string, brandOptionsCount: number): string {
    if (!this.shouldShowSlider(flightId, brandOptionsCount)) {
      return 'none';
    }
    const index = this.getSliderIndex(flightId);
    // Her slide'da 3 kart gösteriyoruz, her kart %33.333 genişliğinde
    // Gap'i hesaba katmak için: her kart + gap = calc(33.333% + gap/3)
    // Basitleştirilmiş: her slide için %33.333 kaydır
    const slideWidth = 100 / 3; // 3 kart gösteriyoruz
    return `translateX(-${index * slideWidth}%)`;
  }

  getSliderMaxIndex(brandOptionsCount: number): number {
    // Her slide'da 3 kart gösteriyoruz
    // Max index = toplam kart sayısı - 3 (son slide'da en az 1 kart kalmalı)
    // Ama eğer tam 3'ün katıysa, bir ekstra slide daha olabilir
    if (brandOptionsCount <= 3) return 0;
    // Her slide'da 3 kart gösteriyoruz, bu yüzden max index = Math.ceil(totalCount / 3) - 1
    // Ama daha basit: totalCount - 3 (son slide'da en az 1 kart kalmalı)
    // Ama bu yanlış çünkü 6 kart için max index 3 olmalı ama 6-3=3 ✓
    // 7 kart için max index 4 olmalı ama 7-3=4 ✓
    // Ama 4 kart için max index 1 olmalı (0 ve 1), 4-3=1 ✓
    return Math.max(0, brandOptionsCount - 3);
  }

  getSliderTotalPages(brandOptionsCount: number): number {
    if (brandOptionsCount <= 3) return 1;
    return Math.ceil(brandOptionsCount / 3);
  }

  trackBrandById(_index: number, brand: { id: string }): string {
    return brand.id;
  }

  /** Uçuş seçildiğinde Allocate'e geçiş yapar */
  async proceedToBooking(flight: Flight, event?: MouseEvent): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    // Session bilgileri kontrolü
    if (!this.currentSessionId || !this.currentSessionToken || !this.currentShoppingFileId) {
      this.toast.error('Oturum bilgileri bulunamadı. Lütfen tekrar arama yapın.');
      return;
    }

    const bookingBlockMessage = this.getBookingBlockMessage(flight);
    if (bookingBlockMessage) {
      this.toast.warning(bookingBlockMessage);
      return;
    }

    const selectedBrandId = this.selectedBrandByFlight.get(flight.id);
    if (flight.brandOptions && flight.brandOptions.length > 0 && !selectedBrandId) {
      this.toast.warning('Lütfen bir paket seçin.');
      return;
    }

    const bookingLegs = this.buildBookingLegs(flight);
    const selectedItems = bookingLegs.map((leg) => ({
      productId: leg.productId,
      brandedFareItemId: leg.brandedFareItemId,
    }));
    const productIds = Array.from(new Set(selectedItems.map((item) => item.productId)));
    const missingPackageLeg = bookingLegs.find((leg) => leg.allBrandOptions.length > 0 && !leg.brandedFareItemId);
    if (missingPackageLeg) {
      this.toast.warning(`${missingPackageLeg.title} için lütfen bir paket seçin.`);
      return;
    }

    // Seçili paket bilgisini al
    const selectedBrand = selectedBrandId 
      ? flight.brandOptions?.find(b => b.id === selectedBrandId)
      : null;
    
    // Allocate isteği
    this.isLoading = true;
    try {
      const allocateResult = await firstValueFrom(this.api.allocate({
        productId: flight.id,
        selectedItems,
        brandedFareItemId: selectedBrandId,
        sessionId: this.currentSessionId!,
        sessionToken: this.currentSessionToken!,
        shoppingFileId: this.currentShoppingFileId!,
        selectedServiceFeeAmount: 0, // Komisyon hesaplaması gerekmiyorsa 0
      }));

      if (allocateResult?.success) {
        // Allocate başarılı - session bilgilerini ve allocate sonucunu sakla
        // Sonraki adım (MakePreBooking) için gerekli bilgileri sessionStorage'a kaydet
        if (this.isBrowser) {
          const bookingData = {
            allocateId: allocateResult.allocateId,
            allocateProductId: allocateResult.productId, // Allocate yanıtındaki ProductItemId
            productId: flight.id,
            productIds,
            sessionId: this.currentSessionId,
            sessionToken: this.currentSessionToken,
            shoppingFileId: this.currentShoppingFileId,
            brandedFareItemId: selectedBrandId,
            selectedBrand: selectedBrand ? {
              id: selectedBrand.id,
              brandName: selectedBrand.brandName,
              brandCode: selectedBrand.brandCode,
              totalFare: selectedBrand.totalFare,
              totalTaxes: selectedBrand.totalTaxes || 0,
              currency: selectedBrand.currency,
              baggageDescription: selectedBrand.baggageDescription,
            } : null,
            flight: this.mapFlightForBooking(flight),
            flightLegs: bookingLegs,
            passengerCounts: {
              adults: this.searchAdults,
              children: this.searchChildren,
              infants: this.searchInfants,
            },
            // Tüm paket seçeneklerini kaydet (paket değiştirme için)
            allBrandOptions: flight.brandOptions ? flight.brandOptions.map(brand => ({
              id: brand.id,
              brandId: brand.brandId,
              brandName: brand.brandName,
              brandCode: brand.brandCode,
              baggageAllowanceId: brand.baggageAllowanceId,
              baggageDescription: brand.baggageDescription,
              rules: brand.rules,
              totalFare: brand.totalFare,
              totalTaxes: brand.totalTaxes,
              currency: brand.currency,
            })) : [],
            // Allocate response'undan gelen PaxReference bilgileri (UpdatePassenger için gerekli)
            paxReferences: allocateResult.paxReferences || [],
            correlationId: allocateResult.correlationId,
            timestamp: new Date().toISOString(),
          };
          sessionStorage.setItem('booking_allocate_data', JSON.stringify(bookingData));
        }

        // Başarı bildirimi
        const brandName = selectedBrand?.brandName || selectedBrand?.brandCode || 'Seçili paket';
        this.toast.success(`${brandName} paketi seçildi. Yolcu bilgileri sayfasına yönlendiriliyorsunuz...`);

        // Kısa bir gecikme sonrası yönlendir (kullanıcı mesajı görebilsin)
        setTimeout(() => {
          this.router.navigate(['/booking']);
        }, 3000);
      } else {
        throw new Error(allocateResult?.message || 'Koltuk tahsisi yapılamadı');
      }
    } catch (error: any) {
      // 401 Unauthorized hatası - token geçersiz veya süresi dolmuş
      if (error?.status === 401 || error?.error?.statusCode === 401) {
        this.toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', { action: 'Giriş Yap' })
          .onAction().subscribe(() => {
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          });
      } else {
        this.toast.error(this.toUserFriendlySearchError(error?.error?.message || error?.message || ''));
      }
    } finally {
      this.isLoading = false;
    }
  }

  /** Uçuş seçilebilir mi? (Session bilgileri var mı, paket seçilmiş mi?) */
  canProceedToBooking(flight?: Flight): boolean {
    // Session bilgileri kontrolü
    const hasSession = !!(this.currentSessionId && this.currentSessionToken && this.currentShoppingFileId);
    if (!hasSession) return false;

    // Eğer uçuş verilmişse, paket seçimi kontrolü yap
    if (flight) {
      if (this.getBookingBlockMessage(flight)) {
        return false;
      }

      // Eğer paket seçenekleri varsa, bir paket seçilmiş olmalı
      if (flight.brandOptions && flight.brandOptions.length > 0) {
        const selectedBrandId = this.selectedBrandByFlight.get(flight.id);
        return !!selectedBrandId;
      }
      // Paket seçenekleri yoksa direkt devam edebilir
      return true;
    }

    return hasSession;
  }

  getBookingHint(flight: Flight): string {
    if (!this.currentSessionId || !this.currentSessionToken || !this.currentShoppingFileId) {
      return 'Oturum bilgileri bulunamadı. Lütfen tekrar arama yapın.';
    }
    return this.getBookingBlockMessage(flight) || 'Lütfen bir paket seçin';
  }

  private markRoundTripSelection(flight: Flight): void {
    const direction = this.getCurrentFlightDirection(flight);
    if (direction === 'outbound') {
      this.selectedOutboundFlightId = flight.id;
    } else if (direction === 'return') {
      this.selectedReturnFlightId = flight.id;
    }
  }

  private getCurrentFlightDirection(flight: Flight): 'outbound' | 'return' | 'roundTrip' | null {
    if (this.searchTripType !== 'RT') return null;
    const origin = this.searchOriginCode.trim().toUpperCase();
    const dest = this.searchDestinationCode.trim().toUpperCase();
    if (!origin || !dest) return null;
    return this.getFlightDirection(flight, origin, dest);
  }

  private getBookingBlockMessage(flight: Flight): string | null {
    const direction = this.getCurrentFlightDirection(flight);
    if (!direction || direction === 'roundTrip') {
      return null;
    }

    if (direction === 'outbound') {
      return 'Gidiş-dönüş aramada booking aşamasına geçmek için dönüş uçuşunu da seçin.';
    }

    if (!this.selectedOutboundFlightId) {
      return 'Booking aşamasına geçmek için önce gidiş uçuşunu seçin.';
    }

    if (this.selectedReturnFlightId !== flight.id) {
      return 'Booking aşamasına geçmek için dönüş uçuşunu seçin.';
    }

    return null;
  }
}
