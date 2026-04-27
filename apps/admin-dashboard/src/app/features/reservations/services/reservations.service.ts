import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Passenger {
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: string;
  tcNo?: string;
  passportNo?: string;
  nationality?: string;
  /** client-api: ADT | CHD | INF */
  passengerType?: string;
}

export interface FlightSegment {
  airline?: string;
  flightNo?: string;
  origin?: string;
  destination?: string;
  departureAt?: string;
  arrivalAt?: string;
  cabinClass?: string;
}

export interface PaymentInfo {
  method?: string;
  transactionId?: string;
  paidAt?: string;
  amount?: number;
  currency?: string;
}

export interface Reservation {
  _id: string;
  reservationNo: string;
  /** client-api rezervasyon kodu (normalize edilmiş yanıtta reservationNo ile aynı) */
  bookingCode?: string;
  type: 'flight' | 'bus' | 'tour' | 'car_rental' | 'hotel' | 'car';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'payment_failed';
  memberId?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberEmail?: string;
  memberPhone?: string;
  passengers: Passenger[];
  segments: FlightSegment[];
  payment?: PaymentInfo;
  totalAmount: number;
  currency: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  /** client-api: ödeme başarısız kayıtları */
  failureReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  /** CONFIRMED + COMPLETED (onaylı bilet / tamamlanan işlem) */
  approved: number;
  cancelled: number;
  /** PAYMENT_FAILED */
  paymentFailed: number;
  totalRevenue: number;
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private apiUrl = `${environment.apiUrl}/admin/reservations`;

  constructor(private http: HttpClient) {}

  getReservations(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    type?: string,
    startDate?: string,
    endDate?: string,
  ): Observable<{ data: Reservation[]; total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<{ data: Reservation[]; total: number }>(this.apiUrl, { params });
  }

  getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<ReservationStats> {
    return this.http.get<ReservationStats>(`${this.apiUrl}/stats`);
  }

  updateStatus(id: string, status: string, reason?: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/status`, { status, reason });
  }
}
