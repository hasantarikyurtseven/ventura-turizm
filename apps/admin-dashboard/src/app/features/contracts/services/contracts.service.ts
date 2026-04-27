import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Contract {
    _id?: string;
    slug: string;
    title: string;
    content?: string;
    order?: number;
    active?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ContractsService {
    private apiUrl = `${environment.apiUrl}/admin/contracts`;

    constructor(private http: HttpClient) { }

    getContracts(): Observable<{ data: Contract[] }> {
        return this.http.get<{ data: Contract[] }>(this.apiUrl);
    }

    getContract(id: string): Observable<Contract> {
        return this.http.get<Contract>(`${this.apiUrl}/${id}`);
    }

    createContract(data: { title: string; content?: string }): Observable<Contract> {
        return this.http.post<Contract>(this.apiUrl, data);
    }

    updateContract(id: string, data: { title?: string; content?: string }): Observable<Contract> {
        return this.http.put<Contract>(`${this.apiUrl}/${id}`, data);
    }
}
