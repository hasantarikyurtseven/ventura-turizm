import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
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
export class LocationSelectorComponent implements OnInit {
  @Input() label: string = '';
  @Input() control!: FormControl<string | null>;
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

  openPanel(): void {
    if (!this.panelOpen) {
      this.loadRecentSearches();
      this.panelOpen = true;
      if (!this.countriesLoaded) {
        this.loadCountries();
      } else if (this.countries.length && !this.selectedCountry) {
        const defaultCountry = this.getDefaultCountry();
        this.selectCountry(defaultCountry);
      }
      setTimeout(() => this.updatePanelPosition(), 0);
    }
  }

  private updatePanelPosition(): void {
    if (!this.inputRef?.nativeElement) return;
    const rect = this.inputRef.nativeElement.getBoundingClientRect();
    const w = Math.min(900, Math.max(720, rect.width));
    this.panelStyle = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${w}px`,
    };
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
    this.panelOpen = false;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.panelOpen) this.closePanel();
  }

  private loadCountries(): void {
    this.api.getCountries().subscribe({
      next: (res) => {
        const list = res.countries || [];
        this.countries = this.sortTurkeyFirst(list);
        this.countriesLoaded = true;
        if (this.panelOpen && !this.selectedCountry && this.countries.length) {
          const defaultCountry = this.getDefaultCountry();
          this.selectCountry(defaultCountry);
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

  onSearchChange(value: string): void {
    this.searchQuery = value;
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

