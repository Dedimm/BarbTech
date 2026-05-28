import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarbeiroService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBarbeiros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/?is_barbeiro=true`).pipe(
      map(usuarios => usuarios.map(u => ({
        id: u.id,
        nome: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
        especialidade: u.nome_barbearia || 'Especialista',
        foto_url: u.foto_url || 'assets/image/avatar-padrao.png',
        bio: u.bio || '',
        telefone: u.telefone || ''
      })))
    );
  }
}