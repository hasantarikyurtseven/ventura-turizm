import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';
import {
  AirportCountryDto,
  AirportDto,
  BiletbankApiService,
} from '../../core/biletbank-api.service';

const RECENT_LOCATIONS_KEY = 'ventura-recent-locations';
const RECENT_LOCATIONS_MAX = 10;

/** Türkçe ülke adı → ISO ülke kodu (ülke aramasında eşleşme için) */
const TURKISH_COUNTRY_ALIASES: Record<string, string> = {
  almanya: 'DE',
  fransa: 'FR',
  ingiltere: 'GB',
  britanya: 'GB',
  italya: 'IT',
  ispanya: 'ES',
  hollanda: 'NL',
  belçika: 'BE',
  avusturya: 'AT',
  isviçre: 'CH',
  yunanistan: 'GR',
  portekiz: 'PT',
  rusya: 'RU',
  amerika: 'US',
  abd: 'US',
  birleşik_arap_emirlikleri: 'AE',
  bae: 'AE',
  mısır: 'EG',
  suudi_arabistan: 'SA',
  katar: 'QA',
  iran: 'IR',
  irak: 'IQ',
  azerbaycan: 'AZ',
  gürcistan: 'GE',
  bulgaristan: 'BG',
  romanya: 'RO',
  ukrayna: 'UA',
  polonya: 'PL',
  macaristan: 'HU',
  çekya: 'CZ',
  çek_cumhuriyeti: 'CZ',
  isveç: 'SE',
  norveç: 'NO',
  danimarka: 'DK',
  finlandiya: 'FI',
  irlanda: 'IE',
  iskoçya: 'GB',
  türkiye: 'TR',
  turkiye: 'TR',
};

/** Seçilen lokasyonun tüm metadata bilgilerini taşır */
export interface LocationSelection {
  code: string;
  countryCode: string;
  isCity: boolean;
  cityCode: string;
  displayText: string;
}

export interface RecentLocationItem {
  code: string;
  displayText: string;
  countryCode?: string;
  isCity?: boolean;
  cityCode?: string;
}

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss'],
  standalone: false,
})
export class LocationSelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() label: string = '';
  @Input() control!: FormControl<string | null>;
  @Input() presetDisplay: string = '';
  @Output() locationSelected = new EventEmitter<LocationSelection>();

  panelOpen = false;
  isLoading = false;

  countries: AirportCountryDto[] = [];
  selectedCountry?: AirportCountryDto;

  airports: AirportDto[] = [];
  searchQuery: string = '';
  countrySearchQuery: string = '';

  displayText: string = '';

  recentSearches: RecentLocationItem[] = [];

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLElement>;
  @ViewChild('panelRef') panelRef?: ElementRef<HTMLElement>;
  private panelOriginalParent: HTMLElement | null = null;
  panelStyle: { top: string; left: string; width: string } = {
    top: '0',
    left: '0',
    width: '720px',
  };

  get filteredCountries(): AirportCountryDto[] {
    const q = (this.countrySearchQuery || '').trim().toLowerCase();
    if (!q) return this.countries;
    const normalizedQ = q.replace(/\s+/g, '_');
    const matchedCode = TURKISH_COUNTRY_ALIASES[normalizedQ] || TURKISH_COUNTRY_ALIASES[q];
    return this.countries.filter(
      (c) =>
        (c.countryName || '').toLowerCase().includes(q) ||
        (matchedCode && (c.countryCode || '').toUpperCase() === matchedCode)
    );
  }

  private isBrowser: boolean;

  constructor(
    private readonly api: BiletbankApiService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private countriesLoaded = false;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['presetDisplay']) {
      this.displayText = changes['presetDisplay'].currentValue ?? '';
    }
  }

  /** Mobil ekran kontrolü (SSR güvenli) */
  private get isMobile(): boolean {
    return this.isBrowser && window.innerWidth <= 768;
  }

  openPanel(): void {
    if (!this.panelOpen) {
      this.loadRecentSearches();
      this.panelOpen = true;
      if (!this.countriesLoaded) {
        this.loadCountries();
      } else if (this.countries.length && !this.selectedCountry) {
        if (this.isMobile) {
          // Mobilde varsayılan ülke yok — tüm dünyadan listele
          this.loadAirports();
        } else {
          const defaultCountry = this.getDefaultCountry();
          this.selectCountry(defaultCountry);
        }
      }
      setTimeout(() => {
        this.updatePanelPosition();
        this.movePanelToBodyIfMobile();
      }, 0);
    }
  }

  /** Mobilde panel'i body'ye taşır — parent'taki transform'ların position:fixed'i bozmasını engeller */
  private movePanelToBodyIfMobile(): void {
    if (!this.isBrowser) return;
    if (window.innerWidth > 768) return;
    const panelEl = this.panelRef?.nativeElement;
    if (!panelEl) return;
    if (panelEl.parentElement === document.body) return;
    this.panelOriginalParent = panelEl.parentElement;
    document.body.appendChild(panelEl);
    document.body.classList.add('lp-mobile-open');
  }

  /** Panel kapanırken orijinal yerine geri taşı (Angular DOM tutarlılığı için) */
  private restorePanelFromBody(): void {
    if (!this.isBrowser) return;
    const panelEl = this.panelRef?.nativeElement;
    if (!panelEl) return;
    if (this.panelOriginalParent && panelEl.parentElement === document.body) {
      this.panelOriginalParent.appendChild(panelEl);
    }
    this.panelOriginalParent = null;
    document.body.classList.remove('lp-mobile-open');
  }

  private updatePanelPosition(): void {
    if (!this.inputRef?.nativeElement || !this.isBrowser) return;
    const rect = this.inputRef.nativeElement.getBoundingClientRect();
    const vw = window.innerWidth;

    if (vw <= 768) {
      // Mobil: tam ekran. Konum/boyut tamamen CSS'te yönetiliyor (inset: 0).
      // ngStyle ile gelen değerler CSS !important'i ezmesin diye boş.
      this.panelStyle = { top: '', left: '', width: '' };
    } else {
      const w = Math.min(900, Math.max(720, rect.width));
      const left = Math.max(0, Math.min(rect.left, vw - w - 16));
      this.panelStyle = {
        top: `${rect.bottom + 8}px`,
        left: `${left}px`,
        width: `${w}px`,
      };
    }
  }

  private loadRecentSearches(): void {
    try {
      const raw = localStorage.getItem(RECENT_LOCATIONS_KEY);
      this.recentSearches = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(this.recentSearches)) this.recentSearches = [];
    } catch {
      this.recentSearches = [];
    }
  }

  private saveRecentSearch(selection: LocationSelection): void {
    const item: RecentLocationItem = {
      code: selection.code,
      displayText: selection.displayText,
      countryCode: selection.countryCode,
      isCity: selection.isCity,
      cityCode: selection.cityCode,
    };
    const list: RecentLocationItem[] = [
      item,
      ...this.recentSearches.filter((r) => r.code !== selection.code),
    ].slice(0, RECENT_LOCATIONS_MAX);
    this.recentSearches = list;
    try {
      localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(list));
    } catch {}
  }

  selectRecent(item: RecentLocationItem): void {
    if (this.control) this.control.setValue(item.code);
    this.displayText = item.displayText;
    this.locationSelected.emit({
      code: item.code,
      countryCode: item.countryCode || 'TR',
      isCity: item.isCity ?? false,
      cityCode: item.cityCode || item.code,
      displayText: item.displayText,
    });
    this.closePanel();
  }

  private getDefaultCountry(): AirportCountryDto {
    const turkey = this.countries.find(
      (c) =>
        c.countryCode === 'TR' ||
        (c.countryName || '').toLowerCase().includes('Turkiye') ||
        (c.countryName || '').toLowerCase().includes('Turkiye')
    );
    return turkey ?? this.countries[0];
  }

  closePanel(): void {
    this.restorePanelFromBody();
    this.panelOpen = false;
  }

  ngOnDestroy(): void {
    this.restorePanelFromBody();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Mobilde scroll ile kapatma — klavye açılınca da scroll tetikleniyor, bozar
    if (this.isBrowser && window.innerWidth <= 768) return;
    if (this.panelOpen) this.closePanel();
  }

  private loadCountries(): void {
    this.api.getCountries().subscribe({
      next: (res) => {
        const list = res.countries || [];
        this.countries = this.sortTurkeyFirst(list);
        this.countriesLoaded = true;
        if (this.panelOpen && !this.selectedCountry && this.countries.length) {
          if (this.isMobile) {
            // Mobilde varsayılan ülke yok — tüm dünyadan listele
            this.loadAirports();
          } else {
            const defaultCountry = this.getDefaultCountry();
            this.selectCountry(defaultCountry);
          }
        }
      },
      error: () => {
        this.countriesLoaded = true;
      },
    });
  }

  private sortTurkeyFirst(list: AirportCountryDto[]): AirportCountryDto[] {
    const isTurkey = (c: AirportCountryDto) =>
      c.countryCode === 'TR' ||
      (c.countryName || '').toLowerCase().includes('Turkiye') ||
      (c.countryName || '').toLowerCase().includes('Turkiye');
    const turkey = list.find(isTurkey);
    if (!turkey) return list;
    const rest = list.filter((c) => c !== turkey);
    return [turkey, ...rest];
  }

  selectCountry(country: AirportCountryDto): void {
    this.selectedCountry = country;
    this.searchQuery = '';
    this.loadAirports();
  }

  /** Ülke filtresini kaldırır → tüm ülkelerden arama */
  selectAllCountries(): void {
    this.selectedCountry = undefined;
    this.loadAirports();
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
    // Mobilde kullanıcı arama yazınca ülke filtresini otomatik kaldır
    // (tüm dünyadan en alakalı sonuçlar için)
    if (
      this.isBrowser &&
      window.innerWidth <= 768 &&
      value.trim().length >= 2 &&
      this.selectedCountry
    ) {
      this.selectedCountry = undefined;
    }
    this.loadAirports();
  }

  onCountrySearchChange(value: string): void {
    this.countrySearchQuery = value;
  }

  clearCountrySelection($event: Event): void {
    $event.stopPropagation();
    this.selectedCountry = undefined;
    this.airports = [];
    this.searchQuery = '';
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.countrySearchQuery = '';
    this.selectedCountry = undefined;
    this.airports = [];
    if (this.control) {
      this.control.setValue(null);
    }
    this.displayText = '';
    this.locationSelected.emit({
      code: '',
      countryCode: '',
      isCity: false,
      cityCode: '',
      displayText: '',
    });
  }

  private loadAirports(): void {
    this.isLoading = true;
    this.api
      .searchAirports({
        countryCode: this.selectedCountry?.countryCode,
        q: this.searchQuery,
        limit: 100,
      })
      .subscribe({
        next: (res) => {
          this.airports = res.airports || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  selectAirport(airport: AirportDto): void {
    // Kullanılacak kod: AirportCode (Biletbank Code olarak)
    const code = airport.airportCode || airport.cityCode;
    if (this.control) {
      this.control.setValue(code);
    }

    // Input'ta görünecek metin
    const parts: string[] = [];
    if (airport.cityName) parts.push(airport.cityName);
    if (airport.countryName) parts.push(airport.countryName);
    const right = parts.join(', ');
    const left =
      airport.airportName && airport.airportCode
        ? `${airport.airportName} (${airport.airportCode})`
        : airport.airportCode || airport.cityCode;

    this.displayText = right ? `${left} · ${right}` : left || '';

    const isCity = !!airport.cityCode && airport.airportCode === airport.cityCode;
    const selection: LocationSelection = {
      code,
      countryCode: airport.countryCode || this.selectedCountry?.countryCode || 'TR',
      isCity,
      cityCode: airport.cityCode || code,
      displayText: this.displayText,
    };

    this.locationSelected.emit(selection);
    this.saveRecentSearch(selection);
    this.closePanel();
  }
}

