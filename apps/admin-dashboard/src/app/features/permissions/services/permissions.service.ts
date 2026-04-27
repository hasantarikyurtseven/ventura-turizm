import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Permission {
    _id?: string;
    code: string;
    name: string;
    description: string;
    module: string;
    status: 'active' | 'inactive';
}

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    private apiUrl = `${environment.apiUrl}/admin/permissions`;

    constructor(private http: HttpClient) { }

    getPermissions(page = 1, limit = 100, search?: string): Observable<{ data: Permission[]; total: number }> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<{ data: Permission[]; total: number }>(this.apiUrl, { params });
    }

    getPermission(id: string): Observable<Permission> {
        return this.http.get<Permission>(`${this.apiUrl}/${id}`);
    }

    createPermission(permission: Partial<Permission>): Observable<Permission> {
        return this.http.post<Permission>(this.apiUrl, permission);
    }

    updatePermission(id: string, permission: Partial<Permission>): Observable<Permission> {
        return this.http.put<Permission>(`${this.apiUrl}/${id}`, permission);
    }

    deletePermission(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
