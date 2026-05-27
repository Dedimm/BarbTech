import { Component, Input, OnInit, Host, Inject, forwardRef } from '@angular/core';
import { ProfissionalService } from '../services/profissional';
import { TelaAgendamento } from '../tela-agendamento/tela-agendamento';

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

  constructor(
    private profesionalService: ProfissionalService,
    @Host() @Inject(forwardRef(() => TelaAgendamento)) private telaAgendamento: TelaAgendamento
  ) {}

  ngOnInit() {
    this.agenda = this.profesionalService.getAgenda();
  }

  selecionarDia(dia: any, index: number) {
    if (dia.fechado) return;
    this.diaSelecionado = dia;
    this.horarioSelecionado = null;
    const duration = this.servico?.tempo ?? 30;
    this.slots = this.profesionalService.gerarSlots(index, duration);
  }

  selecionarHorario(slot: string) {
    this.horarioSelecionado = slot;
  }

  confirmar() {
    if (!this.horarioSelecionado) return;

    this.confirmado = true;
    this.telaAgendamento.finalizarAgendamentoNoBanco(this.horarioSelecionado, 2);
  }

  novoAgendamento() {
    this.confirmado = false;
    this.horarioSelecionado = null;
    this.diaSelecionado = null;
    this.slots = [];
  }
}