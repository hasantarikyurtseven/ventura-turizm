import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  publishedAt: string;
  viewCount: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = `${environment.apiUrl}/admin/blog`;

  constructor(private http: HttpClient) {}

  getBlogs(page = 1, limit = 20, search?: string, status?: string): Observable<{ data: Blog[]; total: number }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<{ data: Blog[]; total: number }>(this.apiUrl, { params });
  }

  getBlog(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  createBlog(dto: Partial<Blog>): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, dto);
  }

  updateBlog(id: string, dto: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, dto);
  }

  deleteBlog(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
