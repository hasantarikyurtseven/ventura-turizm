import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly AUTH_API = `${environment.apiUrl}/admin/auth`;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            this.currentUserSubject.next(this.normalizeUser(parsedUser));
        }
    }

    get accessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    get refreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    login(credentials: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, credentials).pipe(
            tap(res => this.handleAuth(res))
        );
    }

    refresh(): Observable<AuthResponse> {
        const refreshToken = this.refreshToken;
        return this.http.post<AuthResponse>(`${this.AUTH_API}/refresh`, { refreshToken }).pipe(
            tap(res => this.handleAuth(res))
        );
    }

    logout(): void {
        const refreshToken = this.refreshToken;
        if (refreshToken) {
            this.http.post(`${this.AUTH_API}/logout`, { refreshToken }).subscribe();
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    private handleAuth(res: AuthResponse): void {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);

        // Decode JWT for basic user info (optional, just to set subject)
        const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
        const user = this.normalizeUser({
            id: payload.sub,
            username: payload.username,
            name: payload.name,
            surName: payload.surName,
            roles: payload.roles
        });
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    /** Token varsa ve süresi dolmamışsa true; yoksa veya süresi dolmuşsa false (yerel oturum temizlenir). */
    isLoggedIn(): boolean {
        const token = this.accessToken;
        if (!token) {
            return false;
        }
        if (this.isTokenExpired(token)) {
            this.clearSession();
            return false;
        }
        return true;
    }

    /** JWT access token süresi dolmuş mu (exp claim). */
    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp as number | undefined;
            if (exp == null) return true;
            // exp saniye cinsinden; 10 saniye tolerans
            return Date.now() / 1000 >= exp - 10;
        } catch {
            return true;
        }
    }

    /** Sadece yerel oturumu temizler (API çağrısı yok). Süresi dolmuş token için kullanılır. */
    private clearSession(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    updateCurrentUser(userData: any): void {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
            const updatedUser = this.normalizeUser({ ...currentUser, ...userData });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
        }
    }

    private normalizeUser(user: any): any {
        if (!user) {
            return user;
        }
        return {
            ...user,
            name: this.normalizeText(user.name),
            surName: this.normalizeText(user.surName)
        };
    }

    private normalizeText(value?: string): string | undefined {
        if (!value) {
            return value;
        }
        const looksMojibake = /[ÃÂÄÅÐÞÝ]/.test(value);
        if (!looksMojibake) {
            return value;
        }
        try {
            const bytes = new Uint8Array([...value].map(char => char.charCodeAt(0)));
            const decoded = new TextDecoder('utf-8').decode(bytes);
            return decoded || value;
        } catch {
            return value;
        }
    }
}
