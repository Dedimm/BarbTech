import { Component, Input, OnInit } from '@angular/core';
import { ProfissionalService } from '../services/profissional';

@Component({
  selector: 'app-agenda-component',
  standalone: false,
  templateUrl: './agenda-component.html',
  styleUrl: './agenda-component.css'
})
export class AgendaComponent implements OnInit {
  confirmado: boolean = false;

  @Input() servico: any = null;

  agenda: any[] = [];
  diaSelecionado: any = null;
  slots: string[] = [];
  horarioSelecionado: string | null = null;

  constructor(private profissionalService: ProfissionalService) {}

  ngOnInit() {
    this.agenda = this.profissionalService.getAgenda();
  }

  selecionarDia(dia: any, index: number) {
    if (dia.fechado) return;
    this.diaSelecionado = dia;
    this.horarioSelecionado = null;
    const duracao = this.servico?.tempo ?? 30;
    this.slots = this.profissionalService.gerarSlots(index, duracao);
  }

  selecionarHorario(slot: string) {
    this.horarioSelecionado = slot;
  }
  confirmar() {
  this.confirmado = true;
}
novoAgendamento() {
  this.confirmado = false;
  this.horarioSelecionado = null;
  this.diaSelecionado = null;
  this.slots = [];
}
}