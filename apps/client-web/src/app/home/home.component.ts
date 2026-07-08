import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../core/toast.service';
import { LocationSelection, LocationSelectorComponent } from '../shared/location-selector/location-selector.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('fromSelector') fromSelector!: LocationSelectorComponent;
  @ViewChild('toSelector') toSelector!: LocationSelectorComponent;

  selectedService: string = 'flight';
  tripType: string = 'round-trip';

  // Airport fields
  fromAirportControl = new FormControl<string>('');
  toAirportControl = new FormControl<string>('');
  departureDateControl = new FormControl<Date | null>(null);
  returnDateControl = new FormControl<Date | null>(null);

  // Görünen metin (swap için)
  fromDisplay = '';
  toDisplay = '';

  // Location metadata (countryCode, isCity vb.)
  fromLocation: LocationSelection | null = null;
  toLocation: LocationSelection | null = null;

  // Yolcu sayıları
  adults = 1;
  children = 0;
  infants = 0;
  passengerPanelOpen = false;

  // Bugünün tarihi (geçmiş tarih seçimini engellemek için)
  today = new Date();

  constructor(
    private readonly router: Router,
    private readonly toast: ToastService,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.passengerPanelOpen && !target.closest('.passenger-selector-wrapper')) {
      this.passengerPanelOpen = false;
    }
  }

  ngOnInit() {}

  onFromLocationSelected(selection: LocationSelection): void {
    this.fromLocation = selection.code ? selection : null;
    this.fromDisplay = selection.displayText || '';
  }

  onToLocationSelected(selection: LocationSelection): void {
    this.toLocation = selection.code ? selection : null;
    this.toDisplay = selection.displayText || '';
  }

  swapAirports() {
    const tempValue = this.fromAirportControl.value;
    this.fromAirportControl.setValue(this.toAirportControl.value);
    this.toAirportControl.setValue(tempValue);

    const tempLocation = this.fromLocation;
    this.fromLocation = this.toLocation;
    this.toLocation = tempLocation;

    const tempDisplay = this.fromDisplay;
    this.fromDisplay = this.toDisplay;
    this.toDisplay = tempDisplay;
  }

  /** Dönüş tarihi seçicide gidiş tarihinden önce seçim engellensin */
  get minReturnDate(): Date | null {
    const d = this.departureDateControl.value;
    return d ? new Date(d.getTime()) : null;
  }

  onTripTypeChange(): void {
    if (this.tripType === 'one-way') {
      this.returnDateControl.setValue(null);
    }
  }

  // Yolcu seçici
  get passengerSummary(): string {
    const parts: string[] = [];
    if (this.adults > 0) parts.push(`${this.adults} Yetişkin`);
    if (this.children > 0) parts.push(`${this.children} Çocuk`);
    if (this.infants > 0) parts.push(`${this.infants} Bebek`);
    return parts.join(', ') || '1 Yetişkin';
  }

  get totalPassengers(): number {
    return this.adults + this.children + this.infants;
  }

  adjustPassenger(type: 'adults' | 'children' | 'infants', delta: number): void {
    const val = this[type] + delta;
    if (type === 'adults' && val >= 1 && val <= 9) this.adults = val;
    if (type === 'children' && val >= 0 && val <= 8) this.children = val;
    if (type === 'infants' && val >= 0 && val <= this.adults) this.infants = val;
    // Bebek sayısı yetişkin sayısını aşamaz
    if (this.infants > this.adults) this.infants = this.adults;
  }

  togglePassengerPanel(event?: Event): void {
    if (event) event.stopPropagation();
    this.passengerPanelOpen = !this.passengerPanelOpen;
  }

  closePassengerPanel(): void {
    this.passengerPanelOpen = false;
  }

  private readonly MONTHS_TR = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];

  /** Tarih görüntüleme: "25 Oca 2026" */
  formatDateDisplay(d: Date | null): string {
    if (!d) return '';
    const day = d.getDate();
    const month = this.MONTHS_TR[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /** API'ye gönderilecek format: "2026-01-25" */
  private formatDate(d: Date | null): string | undefined {
    if (!d) return undefined;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private showWarning(message: string): void {
    this.toast.warning(message);
  }

  /** Location seçilmediyse isCity'yi bilinen şehir kodlarından çıkar (BiletBank API uyumu) */
  private inferIsCity(code: string): boolean {
    const c = (code || '').trim().toUpperCase();
    if (!c || c.length !== 3) return false;
    const cityCodes = new Set(['IST', 'AYT', 'ADB', 'BJV', 'DLM', 'EZS', 'GZT', 'KYS', 'NAV', 'VAN']);
    return cityCodes.has(c);
  }

  searchFlights() {
    const origin = (this.fromAirportControl.value || '').trim().toUpperCase();
    const destination = (this.toAirportControl.value || '').trim().toUpperCase();
    const departureDate = this.formatDate(this.departureDateControl.value);
    const returnDate = this.tripType === 'round-trip' ? this.formatDate(this.returnDateControl.value) : undefined;

    if (!origin || !destination) {
      this.showWarning('Lütfen kalkış ve varış noktalarını seçin.');
      return;
    }

    if (!departureDate) {
      this.showWarning('Lütfen gidiş tarihini seçin.');
      return;
    }

    if (this.tripType === 'round-trip' && !returnDate) {
      this.showWarning('Lütfen dönüş tarihini seçin veya "Tek Yön" seçeneğini kullanın.');
      return;
    }

    if (this.tripType === 'round-trip' && returnDate && departureDate && returnDate < departureDate) {
      this.showWarning('Dönüş tarihi gidiş tarihinden önce olamaz.');
      return;
    }

    const tripTypeCode = this.tripType === 'round-trip' ? 'RT' : 'OW';

    // Location seçilmediyse (manuel yazım vb.) isCity'yi bilinen şehir kodlarından çıkar
    const originIsCity = this.fromLocation?.isCity ?? this.inferIsCity(origin);
    const destinationIsCity = this.toLocation?.isCity ?? this.inferIsCity(destination);

    this.router.navigate(['/flight-results'], {
      queryParams: {
        tripType: tripTypeCode,
        origin,
        destination,
        departureDate,
        returnDate,
        adults: this.adults,
        children: this.children || undefined,
        infants: this.infants || undefined,
        originCountryCode: this.fromLocation?.countryCode || 'TR',
        originIsCity,
        destinationCountryCode: this.toLocation?.countryCode || 'TR',
        destinationIsCity,
      },
    });
  }

  onTabClick(tab: { id: string; active: boolean }): void {
    if (tab.active) {
      this.selectedService = tab.id;
    } else {
      this.toast.info('Bu hizmet yakında aktif olacaktır.');
    }
  }

  serviceTabs = [
    { id: 'flight', label: 'Uçak', icon: 'flight', active: true },
    { id: 'hotel', label: 'Otel', icon: 'hotel', active: false, badge: 'Yakında' },
    { id: 'car', label: 'Araç', icon: 'directions_car', active: false, badge: 'Yakında' },
    { id: 'ferry', label: 'Feribot', icon: 'directions_boat', active: false, badge: 'Yakında' },
    { id: 'tour', label: 'Tur', icon: 'explore', active: false, badge: 'Yakında' },
    { id: 'bus', label: 'Otobüs', icon: 'directions_bus', active: false, badge: 'Yakında' },
    { id: 'cruise', label: 'Gemi', icon: 'sailing', active: false, badge: 'Yakında' },
    { id: 'transfer', label: 'Transfer', icon: 'transfer_within_a_station', active: false, badge: 'Yakında' },
  ];
  mainServices = [
    { 
      icon: 'flight', 
      title: 'Uçak Bileti', 
      description: 'Tüm havayolları için en uygun fiyatlı uçak biletlerini bulun. Yurt içi ve yurt dışı seyahatleriniz için anında rezervasyon.',
      route: '/flights',
      color: '#4088b3'
    },
    { 
      icon: 'directions_bus', 
      title: 'Otobüs Bileti', 
      description: 'Türkiye\'nin her yerine otobüs bileti. Güvenli ve konforlu yolculuk için tüm firmaların seferlerini karşılaştırın.',
      route: '/buses',
      color: '#4088b3'
    },
    { 
      icon: 'explore', 
      title: 'Tur Paketleri', 
      description: 'Yurt içi ve yurt dışı tur paketleri. Kapadokya\'dan Antalya\'ya, Avrupa\'dan Asya\'ya unutulmaz tatil deneyimleri.',
      route: '/tours',
      color: '#4088b3'
    },
    { 
      icon: 'directions_car', 
      title: 'Araç Kiralama', 
      description: 'Günlük, haftalık ve aylık araç kiralama seçenekleri. Ekonomik sınıftan lüks araçlara kadar geniş filo.',
      route: '/rentals',
      color: '#4088b3'
    }
  ];

  featuredOffers = [
    { 
      type: 'flight',
      title: 'Erken Rezervasyon Uçak Bileti',
      description: 'Avrupa destinasyonları için %30\'a varan indirimler',
      price: '₺1.299\'dan başlayan fiyatlarla',
      icon: 'flight',
      badge: 'Özel Fırsat'
    },
    { 
      type: 'tour',
      title: 'Kapadokya Balon Turu',
      description: '3 gün 2 gece konaklamalı özel tur paketi',
      price: '₺3.500',
      icon: 'explore',
      badge: 'Popüler'
    },
    { 
      type: 'bus',
      title: 'Otobüs Bileti Kampanyası',
      description: 'Tüm hatlarda %20 indirim fırsatı',
      price: '₺150\'den başlayan fiyatlarla',
      icon: 'directions_bus',
      badge: 'Kampanya'
    },
    { 
      type: 'rental',
      title: 'Araç Kiralama Özel Fiyat',
      description: 'Haftalık kiralama için özel indirimler',
      price: '₺2.500/hafta',
      icon: 'directions_car',
      badge: 'Fırsat'
    }
  ];

  whyChooseUs = [
    { 
      icon: 'verified', 
      title: 'Güvenilir Hizmet', 
      description: '25 yıllık deneyimimiz ve binlerce mutlu müşterimiz ile güvenilir hizmet garantisi' 
    },
    { 
      icon: 'savings', 
      title: 'En İyi Fiyat', 
      description: 'Tüm hizmetlerimizde en uygun fiyat garantisi ve özel kampanyalar' 
    },
    { 
      icon: 'support_agent', 
      title: '7/24 Destek', 
      description: 'Seyahatiniz boyunca her zaman yanınızdayız. Anında çözüm ve destek' 
    },
    { 
      icon: 'payments', 
      title: 'Kolay Ödeme', 
      description: 'Taksitli ödeme seçenekleri ve güvenli ödeme sistemi' 
    },
    { 
      icon: 'cancel', 
      title: 'Esnek İptal', 
      description: 'Değişiklik ve iptal işlemlerinde esnek çözümler' 
    },
    { 
      icon: 'star', 
      title: 'Kaliteli Hizmet', 
      description: '4.8/5 müşteri memnuniyeti puanı ile kaliteli hizmet garantisi' 
    }
  ];

  stats = [
    { number: '50.000+', label: 'Mutlu Müşteri', icon: 'people' },
    { number: '500+', label: 'Günlük Sefer', icon: 'flight_takeoff' },
    { number: '25+', label: 'Yıllık Deneyim', icon: 'calendar_today' },
    { number: '4.8', label: 'Müşteri Puanı', icon: 'star' }
  ];

  testimonials = [
    { 
      name: 'Ayşe Yılmaz', 
      location: 'İstanbul', 
      text: 'Uçak bileti rezervasyonum çok kolay oldu. Fiyatlar çok uygundu ve müşteri hizmetleri çok yardımcı oldu. Kesinlikle tavsiye ederim!', 
      rating: 5,
      service: 'Uçak Bileti'
    },
    { 
      name: 'Mehmet Demir', 
      location: 'Ankara', 
      text: 'Kapadokya turumuz harikaydı! Her şey çok iyi organize edilmişti. Rehberimiz çok bilgiliydi ve konaklama mükemmeldi.', 
      rating: 5,
      service: 'Tur Paketi'
    },
    { 
      name: 'Zeynep Kaya', 
      location: 'İzmir', 
      text: 'Otobüs bileti için en uygun fiyatı burada buldum. Rezervasyon süreci çok hızlı ve kolaydı. Teşekkürler!', 
      rating: 5,
      service: 'Otobüs Bileti'
    }
  ];
}
