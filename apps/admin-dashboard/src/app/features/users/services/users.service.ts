import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface User {
    _id?: string;
    name: string;
    surName: string;
    username: string;
    email: string;
    phone?: string;
    passwordHash?: string;
    roles: any[];
    status: 'active' | 'inactive';
    lastLoginAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private apiUrl = `${environment.apiUrl}/admin/users`;

    constructor(private http: HttpClient) { }

    getUsers(page = 1, limit = 10, search?: string): Observable<{ data: User[]; total: number }> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<{ data: User[]; total: number }>(this.apiUrl, { params });
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    createUser(user: Partial<User>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    changePassword(id: string, currentPassword: string, newPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/password`, {
            currentPassword,
            newPassword
        });
    }
}
