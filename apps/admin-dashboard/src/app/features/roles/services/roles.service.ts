import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Role {
    _id?: string;
    name: string;
    description: string;
    permissions: any[];
    status: 'active' | 'inactive';
}

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    private apiUrl = `${environment.apiUrl}/admin/roles`;

    constructor(private http: HttpClient) { }

    getRoles(page = 1, limit = 10, search?: string): Observable<{ data: Role[]; total: number }> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<{ data: Role[]; total: number }>(this.apiUrl, { params });
    }

    getRole(id: string): Observable<Role> {
        return this.http.get<Role>(`${this.apiUrl}/${id}`);
    }

    createRole(role: Partial<Role>): Observable<Role> {
        return this.http.post<Role>(this.apiUrl, role);
    }

    updateRole(id: string, role: Partial<Role>): Observable<Role> {
        return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
    }

    deleteRole(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
