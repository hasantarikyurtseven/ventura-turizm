import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Country {
    countryCode: string;
    countryName: string;
    airportCount: number;
    cityCount: number;
}

export interface CountryAirport {
    airportCode: string;
    airportName: string;
    cityCode: string;
    cityName: string;
}

@Injectable({
    providedIn: 'root'
})
export class CountriesService {
    private apiUrl = `${environment.apiUrl}/admin/countries`;

    constructor(private http: HttpClient) { }

    getCountries(page = 1, limit = 50, search?: string): Observable<{ data: Country[]; total: number }> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<{ data: Country[]; total: number }>(this.apiUrl, { params });
    }

    getCountryAirports(countryCode: string): Observable<CountryAirport[]> {
        return this.http.get<CountryAirport[]>(`${this.apiUrl}/${countryCode}/airports`);
    }
}
