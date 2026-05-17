import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {

  private readonly CHAVE_SERVICOS = 'profissional_servicos';
  private readonly CHAVE_AGENDA = 'profissional_agenda';

  // ── SERVIÇOS ──

  getServicos() {
    const salvo = localStorage.getItem(this.CHAVE_SERVICOS);
    return salvo ? JSON.parse(salvo) : [
      { nome: 'Corte Social', valor: '45,00', tempo: 30 },
      { nome: 'Barba Completa', valor: '35,00', tempo: 20 },
      { nome: 'Corte + Barba', valor: '75,00', tempo: 50 },
      { nome: 'Degradê / Fade', valor: '50,00', tempo: 40 }
    ];
  }

  salvarServicos(servicos: any[]) {
    localStorage.setItem(this.CHAVE_SERVICOS, JSON.stringify(servicos));
  }

  // ── AGENDA ──

  getAgenda() {
    const salvo = localStorage.getItem(this.CHAVE_AGENDA);
    return salvo ? JSON.parse(salvo) : [
      { nome: 'Segunda', inicio: '09:00', fim: '18:00', fechado: false },
      { nome: 'Terça',   inicio: '09:00', fim: '18:00', fechado: false },
      { nome: 'Quarta',  inicio: '09:00', fim: '18:00', fechado: false },
      { nome: 'Quinta',  inicio: '09:00', fim: '18:00', fechado: false },
      { nome: 'Sexta',   inicio: '09:00', fim: '18:00', fechado: false },
      { nome: 'Sábado',  inicio: '09:00', fim: '18:00', fechado: true  },
      { nome: 'Domingo', inicio: '09:00', fim: '18:00', fechado: true  },
    ];
  }

  salvarAgenda(agenda: any[]) {
    localStorage.setItem(this.CHAVE_AGENDA, JSON.stringify(agenda));
  }

  // ── GERADOR DE SLOTS ──

  gerarSlots(diaIndex: number, duracaoMinutos: number): string[] {
    const agenda = this.getAgenda();
    const dia = agenda[diaIndex];

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