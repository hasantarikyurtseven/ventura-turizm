import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  status: 'pending' | 'active' | 'suspended';
  marketingConsent: boolean;
  contractAcceptances: {
    slug: string;
    acceptedAt: string;
    ipAddress: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface MemberStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private apiUrl = `${environment.apiUrl}/admin/members`;

  constructor(private http: HttpClient) {}

  getMembers(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    emailVerified?: string,
  ): Observable<{ data: Member[]; total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (emailVerified) {
      params = params.set('emailVerified', emailVerified);
    }

    return this.http.get<{ data: Member[]; total: number }>(this.apiUrl, { params });
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<MemberStats> {
    return this.http.get<MemberStats>(`${this.apiUrl}/stats`);
  }

  updateStatus(id: string, status: string): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}/status`, { status });
  }
}
