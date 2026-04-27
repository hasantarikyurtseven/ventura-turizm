import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from './api-url.token';

export interface ContractListItem {
  slug: string;
  title: string;
}

export interface ContractDetail {
  slug: string;
  title: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ContractsService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getList(): Observable<ContractListItem[]> {
    return this.http
      .get<{ success: boolean; data: ContractListItem[] }>(`${this.baseUrl}/contracts`)
      .pipe(map((res) => (res.success ? res.data : [])));
  }

  getBySlug(slug: string): Observable<ContractDetail | null> {
    return this.http
      .get<{ success: boolean; contract: ContractDetail | null }>(
        `${this.baseUrl}/contracts/slug/${encodeURIComponent(slug)}`
      )
      .pipe(map((res) => (res.success && res.contract ? res.contract : null)));
  }
}
