import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BiletbankApiService,
  MemberProfileDto,
  SavedPassengerDto,
  SavedPassengerFormDto,
  MyReservationDto,
} from '../../core/biletbank-api.service';
import { ToastService } from '../../core/toast.service';
import { AuthService } from '../../core/auth.service';

type ProfileTab = 'info' | 'reservations' | 'passengers';
type ReservationFilter = 'upcoming' | 'past' | 'all';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  activeTab: ProfileTab = 'info';
  isBrowser: boolean;

  // ── Profil Bilgileri ──────────────────────────────────────────────────────
  profile: MemberProfileDto | null = null;
  profileForm!: FormGroup;
  profileLoading = false;
  profileSaving = false;

  // ── Rezervasyonlar ────────────────────────────────────────────────────────
  allReservations: MyReservationDto[] = [];
  reservationFilter: ReservationFilter = 'upcoming';
  reservationsLoading = false;
  readonly emptyPassenger: any[] = [{ firstName: 'YOLCU', lastName: '', type: 'ADT' }];

  private static readonly TR_MONTHS = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];
  private static readonly TR_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  // ── Kayıtlı Yolcular ─────────────────────────────────────────────────────
  savedPassengers: SavedPassengerDto[] = [];
  passengersLoading = false;
  showPassengerForm = false;
  editingPassengerId: string | null = null;
  passengerForm!: FormGroup;
  passengerSaving = false;

  readonly paxTypeLabels: Record<string, string> = {
    ADT: 'Yetişkin',
    CHD: 'Çocuk',
    INF: 'Bebek',
  };

  readonly genderLabels: Record<string, string> = { M: 'Erkek', F: 'Kadın' };

  constructor(
    private readonly api: BiletbankApiService,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.buildForms();
    this.loadProfile();
    this.loadReservations();
    this.loadSavedPassengers();
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Form kurulumu
  // ──────────────────────────────────────────────────────────────────────────

  private buildForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(64)]],
      lastName: ['', [Validators.required, Validators.maxLength(64)]],
      phone: ['', [Validators.maxLength(20)]],
    });

    this.passengerForm = this.fb.group({
      label: [''],
      firstName: ['', [Validators.required, Validators.maxLength(64)]],
      lastName: ['', [Validators.required, Validators.maxLength(64)]],
      birthDate: ['', [Validators.required]],
      gender: ['M', Validators.required],
      nationality: ['TR', [Validators.required, Validators.maxLength(2)]],
      paxType: ['ADT', Validators.required],
      tcNo: [''],
      passportNumber: [''],
      passportExpiry: [''],
      email: [''],
      phone: [''],
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Profil
  // ──────────────────────────────────────────────────────────────────────────

  loadProfile(): void {
    this.profileLoading = true;

    // Local auth verisinden hızlı bir ön doldurma yap (API beklenmeden)
    const localUser = this.authService.currentUser;
    if (localUser) {
      this.profileForm.patchValue({
        firstName: localUser.firstName,
        lastName: localUser.lastName,
      });
    }

    this.api.getProfile().subscribe({
      next: (res) => {
        this.profile = res.user;
        this.profileForm.patchValue({
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          phone: res.user.phone,
        });
        this.profileLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // API hatası → toast gösterme; local veriden profile nesnesi oluştur
        if (localUser) {
          this.profile = {
            _id: '',
            firstName: localUser.firstName,
            lastName: localUser.lastName,
            email: localUser.email,
            phone: '',
            emailVerified: false,
            status: 'active',
            marketingConsent: false,
            createdAt: '',
          };
        }
        this.profileLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.profileSaving) return;
    this.profileSaving = true;

    this.api.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        this.profile = res.user;
        this.profileSaving = false;
        this.toast.success('Profil bilgileriniz güncellendi.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.profileSaving = false;
        this.toast.error(err?.error?.message || 'Güncelleme başarısız.');
      },
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Rezervasyonlar
  // ──────────────────────────────────────────────────────────────────────────

  loadReservations(): void {
    this.reservationsLoading = true;
    this.api.getMyReservations().subscribe({
      next: (res) => {
        this.allReservations = this.deduplicateByPnr(res.reservations || []);
        this.reservationsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.reservationsLoading = false;
      },
    });
  }

  get filteredReservations(): MyReservationDto[] {
    const now = new Date();
    return this.allReservations.filter((r) => {
      const depDate = this.getDepartureDate(r);
      if (!depDate) return this.reservationFilter === 'all' || this.reservationFilter === 'past';
      if (this.reservationFilter === 'upcoming') return depDate >= now;
      if (this.reservationFilter === 'past') return depDate < now;
      return true;
    });
  }

  getOwFlight(r: MyReservationDto): MyReservationDto['flight'] | null {
    if (r.flightLegs && r.flightLegs.length >= 1) return r.flightLegs[0] as any;
    if (r.flight) return r.flight;
    return null;
  }

  private getDepartureDate(r: MyReservationDto): Date | null {
    const leg: any = this.getOwFlight(r);
    const dateStr = leg?.departure?.date || leg?.departure?.dateTime;
    if (!dateStr) return null;
    return new Date(dateStr);
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  formatFlightDate(dateStr?: string): string {
    if (!dateStr) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
    if (!m) return dateStr;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    if (month < 0 || month > 11) return dateStr;
    const d = new Date(Date.UTC(year, month, day));
    const weekday = ProfileComponent.TR_DAYS[d.getUTCDay()];
    return `${day} ${ProfileComponent.TR_MONTHS[month]} ${year}, ${weekday}`;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 'Onaylandı', CANCELLED: 'İptal',
      PENDING: 'Beklemede', PAYMENT_FAILED: 'Ödeme Başarısız',
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 'status-confirmed', CANCELLED: 'status-cancelled',
      PENDING: 'status-pending', PAYMENT_FAILED: 'status-pending',
    };
    return map[status] ?? '';
  }

  // (eski metodlar — geriye uyumluluk için kalsın)
  statusLabel(status: string): string { return this.getStatusLabel(status); }
  statusClass(status: string): string { return this.getStatusClass(status); }

  private deduplicateByPnr(list: MyReservationDto[]): MyReservationDto[] {
    const priority: Record<string, number> = {
      CONFIRMED: 0, CANCELLED: 1, PENDING: 2, PAYMENT_FAILED: 3,
    };
    const map = new Map<string, MyReservationDto>();
    for (const r of list) {
      const key = r.bookingCode?.trim().toUpperCase();
      if (!key) continue;
      const existing = map.get(key);
      if (!existing) { map.set(key, r); continue; }
      const pR = priority[r.status] ?? 4;
      const pE = priority[existing.status] ?? 4;
      if (pR < pE) {
        map.set(key, r);
      } else if (pR === pE) {
        const tR = new Date(r.createdAt ?? 0).getTime();
        const tE = new Date(existing.createdAt ?? 0).getTime();
        if (tR > tE) map.set(key, r);
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
    );
  }

  getDepDate(r: MyReservationDto): string | undefined {
    const leg: any = r.flightLegs?.[0] ?? r.flight;
    return leg?.departure?.date ?? leg?.departure?.dateTime ?? undefined;
  }

  getFlightRoute(r: MyReservationDto): string {
    const leg = r.flightLegs?.[0] ?? r.flight;
    if (!leg) return r.bookingCode ?? '—';
    const dep = (leg as any)?.departure?.airportCode ?? (leg as any)?.departure?.airport ?? '';
    const arr = (leg as any)?.arrival?.airportCode ?? (leg as any)?.arrival?.airport ?? '';
    return dep && arr ? `${dep} → ${arr}` : r.bookingCode ?? '—';
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Kayıtlı Yolcular
  // ──────────────────────────────────────────────────────────────────────────

  loadSavedPassengers(): void {
    this.passengersLoading = true;
    this.api.getSavedPassengers().subscribe({
      next: (res) => {
        this.savedPassengers = res.passengers || [];
        this.passengersLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.passengersLoading = false;
      },
    });
  }

  openAddPassenger(): void {
    this.editingPassengerId = null;
    this.passengerForm.reset({
      gender: 'M', nationality: 'TR', paxType: 'ADT',
    });
    this.showPassengerForm = true;
  }

  openEditPassenger(p: SavedPassengerDto): void {
    this.editingPassengerId = p._id;
    this.passengerForm.patchValue({
      label: p.label,
      firstName: p.firstName,
      lastName: p.lastName,
      birthDate: p.birthDate,
      gender: p.gender,
      nationality: p.nationality,
      paxType: p.paxType,
      tcNo: p.tcNo,
      passportNumber: p.passportNumber,
      passportExpiry: p.passportExpiry,
      email: p.email,
      phone: p.phone,
    });
    this.showPassengerForm = true;
  }

  cancelPassengerForm(): void {
    this.showPassengerForm = false;
    this.editingPassengerId = null;
  }

  savePassenger(): void {
    if (this.passengerForm.invalid || this.passengerSaving) return;
    this.passengerSaving = true;

    const body: SavedPassengerFormDto = this.passengerForm.value;
    const obs = this.editingPassengerId
      ? this.api.updateSavedPassenger(this.editingPassengerId, body)
      : this.api.createSavedPassenger(body);

    obs.subscribe({
      next: (res) => {
        if (this.editingPassengerId) {
          const idx = this.savedPassengers.findIndex((p) => p._id === this.editingPassengerId);
          if (idx !== -1) this.savedPassengers[idx] = res.passenger;
        } else {
          this.savedPassengers.unshift(res.passenger);
        }
        this.passengerSaving = false;
        this.showPassengerForm = false;
        this.editingPassengerId = null;
        this.toast.success(
          this.editingPassengerId ? 'Yolcu güncellendi.' : 'Yolcu kaydedildi.',
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.passengerSaving = false;
        this.toast.error(err?.error?.message || 'Kayıt başarısız.');
      },
    });
  }

  deletePassenger(p: SavedPassengerDto): void {
    if (!confirm(`"${p.firstName} ${p.lastName}" silinsin mi?`)) return;
    this.api.deleteSavedPassenger(p._id).subscribe({
      next: () => {
        this.savedPassengers = this.savedPassengers.filter((x) => x._id !== p._id);
        this.toast.success('Yolcu silindi.');
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Silme işlemi başarısız.'),
    });
  }

  get passengerDisplayName(): string {
    const v = this.passengerForm.value;
    return v.firstName && v.lastName ? `${v.firstName} ${v.lastName}` : 'Yeni Yolcu';
  }
}
