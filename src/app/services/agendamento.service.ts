import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAgendamentos(filtros?: { barbeiro?: string; cliente?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/agendamentos/`;
    const params: string[] = [];
    if (filtros?.barbeiro) params.push(`barbeiro=${filtros.barbeiro}`);
    if (filtros?.cliente) params.push(`cliente=${filtros.cliente}`);
    if (params.length > 0) url += '?' + params.join('&');
    return this.http.get<any[]>(url);
  }

  salvarAgendamento(agendamento: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agendamentos/`, agendamento);
  }

  editarAgendamento(id: number, dados: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/agendamentos/${id}/`, dados);
  }

  excluirAgendamento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agendamentos/${id}/`);
  }

  cancelarAgendamento(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/agendamentos/${id}/`, { status: 'CANCELADO' });
  }
}