import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ProfissionalService } from '../services/profissional';
import { AgendamentoService } from '../services/agendamento.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-profissional',
  standalone: false,
  templateUrl: './home-profissional.html',
  styleUrl: './home-profissional.css',
})
export class HomeProfissional implements OnInit {
  userId: string = '';
  diasAtivos: any[] = [];
  agendaCompleta: any[] = [];
  fotoPerfil: string = '';
  agendamentos: any[] = [];

  modalAberto = false;
  agendamentoSelecionado: any = null;
  novoHorario: string = '';
  slotsDisponiveis: string[] = [];

  private diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  constructor(
    private profissionalService: ProfissionalService,
    private agendamentoService: AgendamentoService,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId() || '';
    if (!this.userId) {
      this.router.navigate(['/login-profissional']);
      return;
    }
    this.carregarDados();
  }

  carregarDados() {
    // 1. Carregar perfil para foto
    this.http.get<any>(`${environment.apiUrl}/usuarios/${this.userId}/`).subscribe({
      next: (res) => {
        this.fotoPerfil = res.foto_url || '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados do profissional:', err)
    });

    // 2. Carregar agenda do profissional
    this.profissionalService.getAgenda(this.userId).subscribe({
      next: (agenda) => {
        this.agendaCompleta = agenda;
        this.diasAtivos = agenda.filter((d: any) => !d.fechado);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar agenda:', err)
    });

    // 3. Carregar agendamentos reais da API
    this.agendamentoService.getAgendamentos({ barbeiro: this.userId }).subscribe({
      next: (res) => {
        this.agendamentos = res.map(ag => {
          const dt = new Date(ag.data_hora);
          const hrs = String(dt.getHours()).padStart(2, '0');
          const mins = String(dt.getMinutes()).padStart(2, '0');
          const timeStr = `${hrs}:${mins}`;
          
          // JS getDay(): 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
          // Nosso model dia_semana: 0 = Segunda, ..., 6 = Domingo
          const jsDay = dt.getDay();
          const diaSemanaIndex = jsDay === 0 ? 6 : jsDay - 1;

          return {
            id: ag.id,
            dia: this.diasNomes[diaSemanaIndex],
            horario: timeStr,
            servico: ag.servico_nome || 'Serviço',
            cliente: ag.cliente_nome || 'Cliente',
            servicoId: ag.servico,
            clienteId: ag.cliente,
            dataOriginal: dt
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar agendamentos:', err)
    });
  }

  gerarSlots(dia: any): string[] {
    const diaObj = this.agendaCompleta.find(d => d.nome === dia.nome);
    if (!diaObj) return [];
    return this.profissionalService.gerarSlots(this.agendaCompleta, diaObj.dia_semana, 30);
  }

  getAgendamentoDoSlot(diaNome: string, slot: string): any {
    return this.agendamentos.find(a => a.dia === diaNome && a.horario === slot) || null;
  }

  abrirModal(ag: any) {
    this.agendamentoSelecionado = ag;
    this.novoHorario = ag.horario;
    const diaObj = this.diasAtivos.find(d => d.nome === ag.dia);
    this.slotsDisponiveis = diaObj ? this.gerarSlots(diaObj) : [];
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.agendamentoSelecionado = null;
  }

  salvarEdicao() {
    if (!this.agendamentoSelecionado || !this.novoHorario) return;
    
    // Monta nova data/hora mantendo a data original
    const dataObj = new Date(this.agendamentoSelecionado.dataOriginal);
    const [hrs, mins] = this.novoHorario.split(':');
    dataObj.setHours(parseInt(hrs, 10));
    dataObj.setMinutes(parseInt(mins, 10));

    const payload = {
      data_hora: dataObj.toISOString()
    };

    this.agendamentoService.editarAgendamento(this.agendamentoSelecionado.id, payload).subscribe({
      next: () => {
        this.carregarDados();
        this.fecharModal();
      },
      error: (err) => console.error('Erro ao editar agendamento:', err)
    });
  }

  excluir() {
    if (!this.agendamentoSelecionado) return;
    this.agendamentoService.excluirAgendamento(this.agendamentoSelecionado.id).subscribe({
      next: () => {
        this.carregarDados();
        this.fecharModal();
      },
      error: (err) => console.error('Erro ao excluir agendamento:', err)
    });
  }
}