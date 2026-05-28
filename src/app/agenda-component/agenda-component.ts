import { Component, Input, OnInit, Host, Inject, forwardRef, ChangeDetectorRef } from '@angular/core';
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

  nomeCliente: string = '';

  constructor(
    private profissionalService: ProfissionalService,
    private cdr: ChangeDetectorRef,
    @Host() @Inject(forwardRef(() => TelaAgendamento)) private telaAgendamento: TelaAgendamento
  ) {}

  ngOnInit() {
    const barbeiroId = this.telaAgendamento.barbeiro?.id || 1;
    this.profissionalService.getAgenda(barbeiroId.toString()).subscribe({
      next: (agenda) => {
        this.agenda = agenda;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao obter agenda:', err)
    });
  }

  selecionarDia(dia: any, index: number) {
    if (dia.fechado) return;
    this.diaSelecionado = dia;
    this.horarioSelecionado = null;
    const duration = this.servico?.tempo ?? 30;
    this.slots = this.profissionalService.gerarSlots(this.agenda, dia.dia_semana, duration);
  }

  selecionarHorario(slot: string) {
    this.horarioSelecionado = slot;
  }

  confirmar() {
    if (!this.horarioSelecionado || !this.diaSelecionado) return;

    this.confirmado = true;
    const barbeiroId = this.telaAgendamento.barbeiro?.id || 1;
    this.telaAgendamento.finalizarAgendamentoNoBanco(this.horarioSelecionado, barbeiroId);
  }

  novoAgendamento() {
    this.confirmado = false;
    this.horarioSelecionado = null;
    this.diaSelecionado = null;
    this.slots = [];
    this.nomeCliente = '';
  }
}