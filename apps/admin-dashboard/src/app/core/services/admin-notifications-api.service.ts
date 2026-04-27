import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminNotificationItem {
    id: string;
    message: string;
    icon: string;
    read: boolean;
    time: string;
    bookingCode: string | null;
    reservationId: string | null;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminNotificationsApiService {
    private readonly baseUrl = `${environment.apiUrl}/admin/notifications`;

    constructor(private readonly http: HttpClient) {}

    list(limit = 30): Observable<AdminNotificationItem[]> {
        const params = new HttpParams().set('limit', String(limit));
        return this.http.get<AdminNotificationItem[]>(this.baseUrl, { params });
    }

    markAllRead(): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.baseUrl}/mark-all-read`, {});
    }
}
