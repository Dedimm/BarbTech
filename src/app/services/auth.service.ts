import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => {
        if (response && response.access) {
          localStorage.setItem('access_token', response.access);
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
          if (response.user_id) {
            localStorage.setItem('user_id', response.user_id.toString());
          }
          if (response.is_barbeiro !== undefined) {
            localStorage.setItem('is_barbeiro', response.is_barbeiro.toString());
          }
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_barbeiro');
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isBarbeiro(): boolean {
    return localStorage.getItem('is_barbeiro') === 'true';
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }
}
