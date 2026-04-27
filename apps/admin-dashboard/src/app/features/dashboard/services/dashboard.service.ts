import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStatistics {
    totalMembers: number;
    totalReservations: number;
    totalRevenue: number;
    /** İptal edilmiş rezervasyon sayısı */
    faultyReservations: number;
}

export interface RecentActivity {
    _id: string;
    action: string;
    user: string;
    userName: string;
    entity: string;
    time: string;
    status: string;
    statusClass: string;
    icon: string;
    createdAt: Date;
}

export interface DashboardRecentReservation {
    _id: string;
    reservationNo: string;
    status: string;
    type: string;
    memberFirstName?: string;
    memberLastName?: string;
    memberEmail?: string;
    totalAmount: number;
    currency: string;
    createdAt: string;
}

export interface DashboardRecentMember {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/admin/dashboard`;

    constructor(private http: HttpClient) { }

    getStatistics(): Observable<DashboardStatistics> {
        return this.http.get<DashboardStatistics>(`${this.apiUrl}/statistics`);
    }

    getRecentActivities(): Observable<RecentActivity[]> {
        return this.http.get<RecentActivity[]>(`${this.apiUrl}/activities`);
    }

    getRecentReservations(limit = 8): Observable<DashboardRecentReservation[]> {
        const params = new HttpParams().set('limit', String(limit));
        return this.http.get<DashboardRecentReservation[]>(
            `${this.apiUrl}/recent-reservations`,
            { params },
        );
    }

    getRecentMembers(limit = 8): Observable<DashboardRecentMember[]> {
        const params = new HttpParams().set('limit', String(limit));
        return this.http.get<DashboardRecentMember[]>(`${this.apiUrl}/recent-members`, {
            params,
        });
    }
}
