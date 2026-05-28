import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── SERVIÇOS ──

  getServicos(barbeiroId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicos/?barbeiro=${barbeiroId}`).pipe(
      map(servicos => servicos.map(s => ({
        id: s.id,
        nome: s.nome,
        valor: s.preco,
        tempo: s.duracao_minutos
      })))
    );
  }

  adicionarServico(servico: any, barbeiroId: string): Observable<any> {
    const payload = {
      barbeiro: parseInt(barbeiroId, 10),
      nome: servico.nome,
      preco: servico.valor.replace(',', '.'),
      duracao_minutos: servico.tempo
    };
    return this.http.post<any>(`${this.apiUrl}/servicos/`, payload);
  }

  deletarServico(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/servicos/${id}/`);
  }

  // ── AGENDA ──

  getAgenda(barbeiroId: string): Observable<any[]> {
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    return this.http.get<any[]>(`${this.apiUrl}/horarios-trabalho/?barbeiro=${barbeiroId}`).pipe(
      map(horarios => {
        // Inicializa todos os dias fechados por padrão
        const agendaResult = diasNomes.map((nome, index) => ({
          nome,
          dia_semana: index,
          inicio: '09:00',
          fim: '18:00',
          fechado: true,
          id: null as number | null
        }));

        // Atualiza os dias que têm registro no banco
        horarios.forEach(h => {
          const dia = agendaResult.find(d => d.dia_semana === h.dia_semana);
          if (dia) {
            dia.id = h.id;
            dia.fechado = false;
            dia.inicio = h.hora_inicio.substring(0, 5);
            dia.fim = h.hora_fim.substring(0, 5);
          }
        });

        return agendaResult;
      })
    );
  }

  salvarDiaAgenda(dia: any, barbeiroId: string): Observable<any> {
    const payload = {
      barbeiro: parseInt(barbeiroId, 10),
      dia_semana: dia.dia_semana,
      hora_inicio: dia.inicio.length === 5 ? `${dia.inicio}:00` : dia.inicio,
      hora_fim: dia.fim.length === 5 ? `${dia.fim}:00` : dia.fim
    };

    if (dia.fechado) {
      if (dia.id) {
        return this.http.delete(`${this.apiUrl}/horarios-trabalho/${dia.id}/`);
      }
      // Se já estava fechado e não tem ID, não faz nada
      return new Observable(sub => { sub.next(null); sub.complete(); });
    } else {
      if (dia.id) {
        return this.http.put(`${this.apiUrl}/horarios-trabalho/${dia.id}/`, payload);
      } else {
        return this.http.post(`${this.apiUrl}/horarios-trabalho/`, payload);
      }
    }
  }

  // ── GERADOR DE SLOTS (local helper para agendamento) ──

  gerarSlots(agenda: any[], diaIndex: number, duracaoMinutos: number): string[] {
    const dia = agenda.find(d => d.dia_semana === diaIndex);

    if (!dia || dia.fechado) return [];

    const slots: string[] = [];
    const [hIni, mIni] = dia.inicio.split(':').map(Number);
    const [hFim, mFim] = dia.fim.split(':').map(Number);

    let atual = hIni * 60 + mIni;
    const fim  = hFim * 60 + mFim;

    while (atual + duracaoMinutos <= fim) {
      const h = String(Math.floor(atual / 60)).padStart(2, '0');
      const m = String(atual % 60).padStart(2, '0');
      slots.push(`${h}:${m}`);
      atual += duracaoMinutos;
    }

    return slots;
  }
}