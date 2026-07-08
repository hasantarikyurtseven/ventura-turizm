import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from './api-url.token';

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

@Injectable({ providedIn: 'root' })
export class HelpService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getFaqs(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`${this.baseUrl}/help/faqs`)
      .pipe(catchError(() => of([])));
  }

  submitContact(dto: { name: string; email: string; phone?: string; subject: string; message: string }): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/help/contact`, dto);
  }
}
