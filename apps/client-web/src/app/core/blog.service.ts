import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from './api-url.token';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  viewCount: number;
  metaTitle: string;
  metaDescription: string;
  content?: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getPosts(page = 1, limit = 10, category?: string): Observable<{ data: BlogPost[]; total: number }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (category) params = params.set('category', category);
    return this.http.get<{ data: BlogPost[]; total: number }>(`${this.baseUrl}/blog`, { params })
      .pipe(catchError(() => of({ data: [], total: 0 })));
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.http.get<BlogPost>(`${this.baseUrl}/blog/${encodeURIComponent(slug)}`)
      .pipe(catchError(() => of(null)));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/blog/categories`)
      .pipe(catchError(() => of([])));
  }
}
