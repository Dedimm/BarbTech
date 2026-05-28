import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BarbeiroService } from '../services/barbeiro.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tela-agendamento',
  standalone: false,
  templateUrl: './tela-agendamento.html',
  styleUrl: './tela-agendamento.css',
})
export class TelaAgendamento implements OnInit {
  fotoBanner: any;
  fotoPerfil: any;
  abaSelecionada: string = 'servicos';
  servicoSelecionado: any = null;
  barbeiro: any = null;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private barbeiroService: BarbeiroService,
    private http: HttpClient
  ) {
    const perfil = localStorage.getItem('fotoPerfil');
    const banner = localStorage.getItem('fotoBanner');

    this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(
      perfil ? `url(${perfil})` : "url('/avatar-padrao.png')"
    );
    this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(
      banner ? `url(${banner})` : "url('/capa-padrao.jpg')"
    );
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.barbeiroService.getBarbeiros().subscribe({
      next: (barbeiros) => {
        this.barbeiro = barbeiros.find((b: any) => b.id === id);
        if (this.barbeiro) {
          this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(
            this.barbeiro.foto_url ? `url(${this.barbeiro.foto_url})` : "url('assets/image/avatar-padrao.png')"
          );
          this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(
            this.barbeiro.banner_url ? `url(${this.barbeiro.banner_url})` : "url('assets/image/capa-padrao.jpg')"
          );
        }
      },
      error: (err) => console.error('Erro ao carregar barbeiro:', err)
    });
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
  }

  onServicoEscolhido(servico: any) {
    this.servicoSelecionado = servico;
    this.abaSelecionada = 'agenda';
  }

  finalizarAgendamentoNoBanco(horarioEscolhido: string, barbeiroId: number) {
    const loggedUserId = localStorage.getItem('user_id');
    if (!loggedUserId) {
      alert('Você precisa estar logado para agendar um horário.');
      this.router.navigate(['/login-usuario']);
      return;
    }

    const hoje = new Date().toISOString().substring(0, 10);
    const dadosAgendamento = {
      cliente: Number(loggedUserId),
      barbeiro: barbeiroId ? barbeiroId : 1,
      servico: Number(this.servicoSelecionado.id),
      data_hora: `${hoje}T${horarioEscolhido}:00`
    };

    this.http.post(`${environment.apiUrl}/agendamentos/`, dadosAgendamento).subscribe({
      next: (response) => {
        console.log('Sucesso ao salvar agendamento:', response);
        alert('Agendamento cadastrado com sucesso!');
      },
      error: (err) => {
        console.error('Erro detalhado do Django ao agendar:', err.error);
        alert('Erro ao realizar o agendamento. Verifique o console.');
      }
    });
  }
}