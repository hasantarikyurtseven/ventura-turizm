import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type TripType = 'OW' | 'RT';
type SearchReason = 'SearchOnly' | 'SearchAndBook';

@Component({
  selector: 'app-airsearch-test',
  templateUrl: './airsearch-test.component.html',
  styleUrls: ['./airsearch-test.component.scss'],
  standalone: false,
})
export class AirsearchTestComponent {
  loading = false;
  error?: string;
  response?: any;

  form;

  get debugUrl(): string {
    const url = this.form?.get?.('apiBaseUrl')?.value || 'http://localhost:3002';
    return `${String(url).replace(/\/+$/, '')}/biletbank/airsearch/debug`;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
  ) {
    this.form = this.fb.nonNullable.group({
      apiBaseUrl: ['http://localhost:3002', [Validators.required]],

      tripType: ['RT' as TripType, [Validators.required]],
      searchReason: ['SearchOnly' as SearchReason, [Validators.required]],

      originCode: ['ESB', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      originCountryCode: ['TR', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      originIsCity: [false],

      destinationCode: ['IST', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      destinationCountryCode: ['TR', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      destinationIsCity: [true],

      // Destek ekibi örneğiyle uyumlu test tarihleri
      departureDate: ['2026-03-14', [Validators.required]],
      returnDate: ['2026-03-15'],

      adults: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
      children: [0, [Validators.min(0), Validators.max(8)]],
      infants: [0, [Validators.min(0), Validators.max(8)]],
    });
  }

  async submit() {
    this.error = undefined;
    this.response = undefined;

    if (this.form.invalid) {
      this.error = 'Form geçersiz. Zorunlu alanları kontrol edin.';
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const apiBaseUrl = v.apiBaseUrl.replace(/\/+$/, '');

    // OW ise returnDate’i backend’e göndermeyelim
    const payload: any = {
      tripType: v.tripType,
      searchReason: v.searchReason,
      originCode: v.originCode,
      originCountryCode: v.originCountryCode,
      originIsCity: v.originIsCity,
      destinationCode: v.destinationCode,
      destinationCountryCode: v.destinationCountryCode,
      destinationIsCity: v.destinationIsCity,
      departureDate: v.departureDate,
      adults: v.adults,
      children: v.children,
      infants: v.infants,
    };
    if (v.tripType === 'RT') payload.returnDate = v.returnDate;

    this.loading = true;
    try {
      this.response = await this.http
        .post(`${apiBaseUrl}/biletbank/airsearch`, payload)
        .toPromise();
    } catch (e: any) {
      this.error = e?.error?.message || e?.message || 'İstek başarısız';
      this.response = e?.error;
    } finally {
      this.loading = false;
    }
  }
}

