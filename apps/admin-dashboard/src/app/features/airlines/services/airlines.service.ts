import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Airline {
    _id?: string;
    code: string;
    name: string;
    logoUrl?: string;
    status: 'active' | 'passive';
}

@Injectable({
    providedIn: 'root'
})
export class AirlinesService {
    private apiUrl = `${environment.apiUrl}/admin/airlines`;

    constructor(private http: HttpClient) { }

    getAirlines(page = 1, limit = 50, search?: string): Observable<{ data: Airline[]; total: number }> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<{ data: Airline[]; total: number }>(this.apiUrl, { params });
    }

    getAirline(id: string): Observable<Airline> {
        return this.http.get<Airline>(`${this.apiUrl}/${id}`);
    }

    createAirline(airline: Partial<Airline>): Observable<Airline> {
        return this.http.post<Airline>(this.apiUrl, airline);
    }

    updateAirline(id: string, airline: Partial<Airline>): Observable<Airline> {
        return this.http.put<Airline>(`${this.apiUrl}/${id}`, airline);
    }

    deleteAirline(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
