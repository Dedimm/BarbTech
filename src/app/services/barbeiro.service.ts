import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BarbeiroService {
  private readonly CHAVE = 'barbeiros';

  getBarbeiros() {
    const salvo = localStorage.getItem(this.CHAVE);
    return salvo ? JSON.parse(salvo) : [
      { id: 1, nome: 'Carlos Silva', especialidade: 'Corte + Barba', avaliacao: 4.8,
        servicos: ['Corte + Barba', 'Barba Completa'] },
      { id: 2, nome: 'Rafael Souza', especialidade: 'Degradê / Fade', avaliacao: 4.6,
        servicos: ['Degradê / Fade', 'Corte Social'] },
      { id: 3, nome: 'Lucas Mendes', especialidade: 'Corte Social', avaliacao: 4.9,
        servicos: ['Corte Social', 'Corte + Barba', 'Degradê / Fade'] },
    ];
  }

  salvarBarbeiros(barbeiros: any[]) {
    localStorage.setItem(this.CHAVE, JSON.stringify(barbeiros));
  }
}