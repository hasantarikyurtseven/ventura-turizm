import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Faq { _id: string; question: string; answer: string; category: string; order: number; active: boolean; }
export interface ContactMessage { _id: string; name: string; email: string; phone: string; subject: string; message: string; status: string; adminNote: string; createdAt: string; }

@Injectable({ providedIn: 'root' })
export class HelpAdminService {
  private helpUrl = `${environment.apiUrl}/admin/help`;

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> { return this.http.get<Faq[]>(`${this.helpUrl}/faqs`); }
  createFaq(dto: Partial<Faq>): Observable<Faq> { return this.http.post<Faq>(`${this.helpUrl}/faqs`, dto); }
  updateFaq(id: string, dto: Partial<Faq>): Observable<Faq> { return this.http.put<Faq>(`${this.helpUrl}/faqs/${id}`, dto); }
  deleteFaq(id: string): Observable<any> { return this.http.delete(`${this.helpUrl}/faqs/${id}`); }

  getMessages(page = 1, limit = 20, status?: string): Observable<{ data: ContactMessage[]; total: number }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http.get<{ data: ContactMessage[]; total: number }>(`${this.helpUrl}/messages`, { params });
  }

  getMessageStats(): Observable<{ total: number; new: number; read: number; replied: number }> {
    return this.http.get<any>(`${this.helpUrl}/messages/stats`);
  }

  updateMessageStatus(id: string, status: string, adminNote?: string): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.helpUrl}/messages/${id}/status`, { status, adminNote });
  }
}
