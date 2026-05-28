import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfissionalService } from '../services/profissional';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tela-profissional-painel',
  standalone: false,
  templateUrl: './tela-profissional-painel.html',
  styleUrl: './tela-profissional-painel.css',
})
export class TelaProfissionalPainel implements OnInit {

  fotoPerfil: any;
  fotoBanner: any;
  foto_url = '';
  banner_url = '';

  // Dados do usuário logado
  userId = '';
  nome = '';
  nomeBarbearia = '';
  bio = '';

  domiciliarAtivo = false;
  endereco = { rua: '', numero: '', bairro: '', cep: '' };

  agenda: any[] = [];
  dias = [
    { nome: 'SEG', ativo: false }, { nome: 'TER', ativo: false },
    { nome: 'QUA', ativo: false }, { nome: 'QUI', ativo: false },
    { nome: 'SEX', ativo: false }, { nome: 'SÁB', ativo: false },
    { nome: 'DOM', ativo: false },
  ];

  listaServicos: any[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private profissionalService: ProfissionalService,
    private authService: AuthService,
    private http: HttpClient,
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
    // Carregar informações do perfil
    this.http.get<any>(`${environment.apiUrl}/usuarios/${this.userId}/`).subscribe({
      next: (res) => {
        this.nome = `${res.first_name || ''} ${res.last_name || ''}`.trim() || 'Sem Nome';
        this.nomeBarbearia = res.nome_barbearia || 'Master Barber & Stylist';
        this.bio = res.bio || '';
        this.foto_url = res.foto_url || '';
        this.banner_url = res.banner_url || '';

        this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(
          res.foto_url ? `url(${res.foto_url})` : "url('assets/image/avatar-padrao.png')"
        );
        this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(
          res.banner_url ? `url(${res.banner_url})` : "url('assets/image/capa-padrao.jpg')"
        );

        this.endereco = {
          rua: res.endereco_rua || '',
          numero: res.endereco_numero || '',
          bairro: res.endereco_bairro || '',
          cep: res.endereco_cep || ''
        };

        this.domiciliarAtivo = res.atende_domicilio || false;
        
        // Mapear dias do atendimento domiciliar
        const diasAtivos = (res.dias_domicilio || '').split(',');
        this.dias.forEach(d => {
          d.ativo = diasAtivos.includes(d.nome);
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados do profissional:', err)
    });

    // Carregar serviços da API
    this.profissionalService.getServicos(this.userId).subscribe({
      next: (servicos) => {
        this.listaServicos = servicos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar serviços:', err)
    });

    // Carregar agenda da API
    this.profissionalService.getAgenda(this.userId).subscribe({
      next: (agenda) => {
        this.agenda = agenda;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar agenda:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('foto', file);
      this.http.post<any>(`${environment.apiUrl}/usuarios/${this.userId}/upload-foto/`, formData).subscribe({
        next: (res) => {
          this.foto_url = res.foto_url;
          this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(`url(${res.foto_url})`);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao enviar foto:', err)
      });
    }
    event.target.value = '';
  }

  onBannerSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('banner', file);
      this.http.post<any>(`${environment.apiUrl}/usuarios/${this.userId}/upload-banner/`, formData).subscribe({
        next: (res) => {
          this.banner_url = res.banner_url;
          this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(`url(${res.banner_url})`);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao enviar banner:', err)
      });
    }
    event.target.value = '';
  }

  toggleFechado(dia: any) {
    dia.fechado = !dia.fechado;
    this.profissionalService.salvarDiaAgenda(dia, this.userId).subscribe({
      next: (res: any) => {
        if (res && res.id) {
          dia.id = res.id;
        }
      },
      error: (err) => console.error('Erro ao salvar dia:', err)
    }); 
  }

  toggleDia(dia: any) {
    if (!this.domiciliarAtivo) return;
    dia.ativo = !dia.ativo;
  }

  getDiasSelecionados() {
    return this.dias.filter(d => d.ativo).map(d => d.nome);
  }

  modalAberto = false;
  novoServico = { nome: '', valor: '', tempo: 30 };

  adicionarServico() {
    this.modalAberto = true;
    this.novoServico = { nome: '', valor: '', tempo: 30 };
  }

  confirmarServico() {
    if (!this.novoServico.nome.trim()) return;
    this.profissionalService.adicionarServico(this.novoServico, this.userId).subscribe({
      next: (res) => {
        this.listaServicos.push({
          id: res.id,
          nome: res.nome,
          valor: res.preco,
          tempo: res.duracao_minutos
        });
        this.fecharModal();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao adicionar serviço:', err)
    });
  }

  deletarServico(servico: any) {
    if (!servico.id) return;
    this.profissionalService.deletarServico(servico.id).subscribe({
      next: () => {
        this.listaServicos = this.listaServicos.filter(s => s.id !== servico.id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao deletar serviço:', err)
    });
  }

  fecharModal() {
    this.modalAberto = false;
  }

  salvarAgenda() {
    this.agenda.forEach(dia => {
      this.profissionalService.salvarDiaAgenda(dia, this.userId).subscribe({
        next: (res: any) => {
          if (res && res.id) {
            dia.id = res.id;
          }
        },
        error: (err) => console.error('Erro ao salvar agenda:', err)
      });
    });
  }

  salvarPerfil() {
    const diasStr = this.dias.filter(d => d.ativo).map(d => d.nome).join(',');
    const payload = {
      bio: this.bio,
      endereco_rua: this.endereco.rua,
      endereco_numero: this.endereco.numero,
      endereco_bairro: this.endereco.bairro,
      endereco_cep: this.endereco.cep,
      atende_domicilio: this.domiciliarAtivo,
      dias_domicilio: diasStr
    };

    this.http.patch<any>(`${environment.apiUrl}/usuarios/${this.userId}/`, payload).subscribe({
      next: (res) => {
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        alert('Erro ao salvar configurações do perfil.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/home-profissional']);
  }
}