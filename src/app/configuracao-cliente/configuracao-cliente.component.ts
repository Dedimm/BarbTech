import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

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

  /* ── Dados do cliente ── */
  cliente: Cliente = {
    id: 0,
    nome: '',
    email: ''
  };

  endereco: Endereco = {
    rua: '',
    numero: '',
    cep: '',
    bairro: '',
    cidade: ''
  };

  condicoes: CondicoesEspeciais = {
    requerAcessibilidade: false,
    detalhesAcessibilidade: '',
    possuiAlergia: false,
    descricaoAlergia: ''
  };

  agendamentos: Agendamento[] = [];

  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private subscriptions = new Subscription();

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* ── Lifecycle ── */

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  /* ── Métodos de imagem ── */

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const userId = this.authService.getUserId();
    if (file && userId) {
      const formData = new FormData();
      formData.append('foto', file);
      this.http.post<any>(`${environment.apiUrl}/usuarios/${userId}/upload-foto/`, formData).subscribe({
        next: (res) => {
          this.avatarUrl = res.foto_url;
          this.exibirToast('Foto de perfil atualizada!');
        },
        error: (err) => console.error(err)
      });
    }
  }

  onBannerChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const userId = this.authService.getUserId();
    if (file && userId) {
      const formData = new FormData();
      formData.append('banner', file);
      this.http.post<any>(`${environment.apiUrl}/usuarios/${userId}/upload-banner/`, formData).subscribe({
        next: (res) => {
          this.bannerUrl = res.banner_url;
          this.exibirToast('Banner atualizado!');
        },
        error: (err) => console.error(err)
      });
    }
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
  }

  /* ── Salvar ── */

  salvarAlteracoes(): void {
    if (this.salvando) return;
    this.salvando = true;
    const userId = this.authService.getUserId();
    if (!userId) return;

    const payload = {
      endereco_rua: this.endereco.rua,
      endereco_numero: this.endereco.numero,
      endereco_cep: this.endereco.cep,
      endereco_bairro: this.endereco.bairro,
      endereco_cidade: this.endereco.cidade,
      requer_acessibilidade: this.condicoes.requerAcessibilidade,
      detalhes_acessibilidade: this.condicoes.detalhesAcessibilidade,
      possui_alergia: this.condicoes.possuiAlergia,
      descricao_alergia: this.condicoes.descricaoAlergia
    };

    this.http.patch<any>(`${environment.apiUrl}/usuarios/${userId}/`, payload).subscribe({
      next: () => {
        this.salvando = false;
        this.exibirToast('Alterações salvas com sucesso!');
      },
      error: (err) => {
        this.salvando = false;
        this.exibirToast('Erro ao salvar. Tente novamente.');
        console.error(err);
      }
    });
  }

  /* ── Carregamento inicial com API real ── */

  private carregarDados(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    // Load customer profile info
    this.http.get<any>(`${environment.apiUrl}/usuarios/${userId}/`).subscribe({
      next: (res) => {
        this.cliente = {
          id: res.id,
          nome: `${res.first_name || ''} ${res.last_name || ''}`.trim() || 'Cliente BarbTech',
          email: res.email
        };

        this.endereco = {
          rua: res.endereco_rua || '',
          numero: res.endereco_numero || '',
          cep: res.endereco_cep || '',
          bairro: res.endereco_bairro || '',
          cidade: res.endereco_cidade || ''
        };

        this.condicoes = {
          requerAcessibilidade: res.requer_acessibilidade || false,
          detalhesAcessibilidade: res.detalhes_acessibilidade || '',
          possuiAlergia: res.possui_alergia || false,
          descricaoAlergia: res.descricao_alergia || ''
        };

        this.avatarUrl = res.foto_url || '';
        this.bannerUrl = res.banner_url || '';
        this.loaded = true;
      },
      error: (err) => {
        console.error('[BarbTech] Erro ao carregar dados do cliente:', err);
        this.loaded = true; // garante a renderização do layout mesmo em erro
      }
    });

    // Load client bookings
    this.http.get<any[]>(`${environment.apiUrl}/agendamentos/?cliente=${userId}`).subscribe({
      next: (res) => {
        this.agendamentos = res.map(ag => {
          const dt = new Date(ag.data_hora);
          const hrs = String(dt.getHours()).padStart(2, '0');
          const mins = String(dt.getMinutes()).padStart(2, '0');
          
          let tipo: TipoServico = 'corte';
          const servName = (ag.servico_nome || '').toLowerCase();
          if (servName.includes('barba')) tipo = 'barba';
          else if (servName.includes('combo') || servName.includes('+')) tipo = 'combo';

          let status: StatusAgendamento = 'pendente';
          if (ag.status === 'AGENDADO') status = 'confirmado';
          else if (ag.status === 'CONCLUIDO') status = 'concluido';
          else if (ag.status === 'CANCELADO') status = 'cancelado';

          return {
            id: ag.id,
            servico: ag.servico_nome || 'Serviço BarbTech',
            data: dt,
            hora: `${hrs}:${mins}`,
            tipo,
            status
          };
        });
      },
      error: (err) => console.error('[BarbTech] Erro ao carregar agendamentos:', err)
    });
  }

  /* ── Helpers privados ── */

  private exibirToast(msg: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMsg     = msg;
    this.toastVisible = true;
    this.toastTimer   = setTimeout(() => (this.toastVisible = false), 3200);
  }
}
