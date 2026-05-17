import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

/* ═══════════════════════════════════════
   INTERFACES
═══════════════════════════════════════ */

export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface Endereco {
  rua: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
}

export interface CondicoesEspeciais {
  requerAcessibilidade: boolean;
  detalhesAcessibilidade: string;
  possuiAlergia: boolean;
  descricaoAlergia: string;
}

export type TipoServico = 'corte' | 'barba' | 'combo' | 'outro';
export type StatusAgendamento = 'confirmado' | 'pendente' | 'concluido' | 'cancelado';

export interface Agendamento {
  id: number;
  servico: string;
  data: Date;
  hora: string;
  tipo: TipoServico;
  status: StatusAgendamento;
}

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */

@Component({
  selector: 'app-configuracao-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './configuracao-cliente.component.html',
  styleUrls: ['./configuracao-cliente.component.css']
})
export class ConfiguracaoClienteComponent implements OnInit, OnDestroy {

  /* ── State ── */
  loaded = false;
  salvando = false;
  toastVisible = false;
  toastMsg = '';
  cepMsg = '';
  cepError = false;

  /* ── Assets ── */
  avatarUrl = '';
  bannerUrl = '';
  readonly defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFhMWExYSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzgiIHI9IjIwIiBmaWxsPSIjMmEyYTJhIi8+PHBhdGggZD0iTTE1IDkwYzAtMTkuOCAxNi4xLTM1IDM1LTM1czM1IDE1LjIgMzUgMzUiIGZpbGw9IiMyYTJhMmEiLz48L3N2Zz4=';

  /* ── Dados do cliente (substituir pela chamada real) ── */
  cliente: Cliente = {
    id: 1,
    nome: 'ARTHUR STERLING',
    email: 'arthur@barbtech.com'
  };

  endereco: Endereco = {
    rua: 'Avenida Paulista',
    numero: '1200',
    cep: '01310-100',
    bairro: 'Bela Vista',
    cidade: 'São Paulo'
  };

  condicoes: CondicoesEspeciais = {
    requerAcessibilidade: true,
    detalhesAcessibilidade: '',
    possuiAlergia: false,
    descricaoAlergia: ''
  };

  agendamentos: Agendamento[] = [
    {
      id: 1,
      servico: 'Corte Masculino Premium',
      data: new Date('2023-11-12'),
      hora: '14:30',
      tipo: 'corte',
      status: 'confirmado'
    },
    {
      id: 2,
      servico: 'Barboterapia Imperial',
      data: new Date('2023-11-28'),
      hora: '10:00',
      tipo: 'barba',
      status: 'confirmado'
    }
  ];

  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private subscriptions = new Subscription();

  constructor(private http: HttpClient) {}

  /* ── Lifecycle ── */

  ngOnInit(): void {
    // Simula carregamento inicial
    setTimeout(() => (this.loaded = true), 100);

    // Descomente para carregar dados reais da API:
    // this.carregarDados();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  /* ── Métodos de imagem ── */

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.lerArquivoComoUrl(input.files[0], (url) => (this.avatarUrl = url));
    }
  }

  onBannerChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.lerArquivoComoUrl(input.files[0], (url) => (this.bannerUrl = url));
    }
  }

  private lerArquivoComoUrl(file: File, callback: (url: string) => void): void {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  /* ── CEP ── */

  formatarCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 8);
    if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5);
    this.endereco.cep = val;
  }

  buscarCep(): void {
    const cep = this.endereco.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    this.cepMsg = 'Buscando CEP...';
    this.cepError = false;

    const sub = this.http
      .get<{ logradouro?: string; bairro?: string; localidade?: string; uf?: string; erro?: boolean; cep?: string }>
      (`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe({
        next: (data) => {
          if (data.erro) {
            this.cepMsg = 'CEP não encontrado.';
            this.cepError = true;
          } else {
            this.endereco.rua    = data.logradouro || this.endereco.rua;
            this.endereco.bairro = data.bairro     || this.endereco.bairro;
            this.endereco.cidade = data.localidade
              ? `${data.localidade} / ${data.uf}`
              : this.endereco.cidade;
            this.cepMsg  = 'Endereço preenchido automaticamente.';
            this.cepError = false;
            setTimeout(() => (this.cepMsg = ''), 3000);
          }
        },
        error: () => {
          this.cepMsg  = 'Erro ao buscar CEP. Verifique a conexão.';
          this.cepError = true;
        }
      });

    this.subscriptions.add(sub);
  }

  /* ── Agendamentos ── */

  isHoje(data: Date): boolean {
    const hoje = new Date();
    const d    = new Date(data);
    return (
      d.getDate()     === hoje.getDate()     &&
      d.getMonth()    === hoje.getMonth()    &&
      d.getFullYear() === hoje.getFullYear()
    );
  }

  trackById(_index: number, ag: Agendamento): number {
    return ag.id;
  }

  statusLabel(status: StatusAgendamento): string {
    const map: Record<StatusAgendamento, string> = {
      confirmado: 'Confirmado',
      pendente:   'Pendente',
      concluido:  'Concluído',
      cancelado:  'Cancelado'
    };
    return map[status] ?? status;
  }

  verAgendamento(ag: Agendamento): void {
    console.log('Navegar para agendamento:', ag.id);
    // Exemplo com Router:
    // this.router.navigate(['/agendamentos', ag.id]);
  }

  /* ── Salvar ── */

  salvarAlteracoes(): void {
    if (this.salvando) return;
    this.salvando = true;

    const payload = {
      clienteId:  this.cliente.id,
      endereco:   { ...this.endereco },
      condicoes:  { ...this.condicoes }
    };

    // ── Substitua o setTimeout pela chamada real à sua API: ──
    //
    // const sub = this.http
    //   .put(`/api/clientes/${this.cliente.id}/configuracoes`, payload)
    //   .subscribe({
    //     next: () => {
    //       this.salvando = false;
    //       this.exibirToast('Alterações salvas com sucesso!');
    //     },
    //     error: (err) => {
    //       this.salvando = false;
    //       this.exibirToast('Erro ao salvar. Tente novamente.');
    //       console.error(err);
    //     }
    //   });
    // this.subscriptions.add(sub);

    setTimeout(() => {
      this.salvando = false;
      this.exibirToast('Alterações salvas com sucesso!');
      console.log('[BarbTech] Payload salvo:', payload);
    }, 1400);
  }

  /* ── Carregamento inicial (exemplo com API real) ── */

  // private carregarDados(): void {
  //   const sub = this.http
  //     .get<{ cliente: Cliente; endereco: Endereco; condicoes: CondicoesEspeciais; agendamentos: Agendamento[]; avatarUrl: string }>
  //     (`/api/clientes/${this.cliente.id}/configuracoes`)
  //     .subscribe({
  //       next: (data) => {
  //         this.cliente      = data.cliente;
  //         this.endereco     = data.endereco;
  //         this.condicoes    = data.condicoes;
  //         this.agendamentos = data.agendamentos.map(ag => ({ ...ag, data: new Date(ag.data) }));
  //         this.avatarUrl    = data.avatarUrl;
  //         this.loaded       = true;
  //       },
  //       error: (err) => console.error('[BarbTech] Erro ao carregar dados:', err)
  //     });
  //   this.subscriptions.add(sub);
  // }

  /* ── Helpers privados ── */

  private exibirToast(msg: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMsg     = msg;
    this.toastVisible = true;
    this.toastTimer   = setTimeout(() => (this.toastVisible = false), 3200);
  }
}
