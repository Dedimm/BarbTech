import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tela-agendamento',
  standalone: false,
  templateUrl: './tela-agendamento.html',
  styleUrl: './tela-agendamento.css',
})
export class TelaAgendamento {
  fotoBanner: any;
  fotoPerfil: any;
  abaSelecionada: string = 'servicos';
  servicoSelecionado: any = null; 

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    const perfil = localStorage.getItem('fotoPerfil');
    const banner = localStorage.getItem('fotoBanner');

    this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(
      perfil ? `url(${perfil})` : "url('/avatar-padrao.png')"
    );
    this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(
      banner ? `url(${banner})` : "url('/capa-padrao.jpg')"
    );
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
  }

  onServicoEscolhido(servico: any) {
    this.servicoSelecionado = servico;
    this.abaSelecionada = 'agenda'; 
  }

  finalizarAgendamentoNoBanco(horarioEscolhido: string, barbeiroId: number) {
    const hoje = new Date().toISOString().substring(0, 10);
    const dadosAgendamento = {
      cliente: 4,
      barbeiro: barbeiroId ? barbeiroId : 1,
      servico: Number(this.servicoSelecionado.id),
      data_hora: `${hoje} ${horarioEscolhido}:00`
    };

    this.http.post('http://localhost:8000/api/agendamentos/', dadosAgendamento).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
      }
    });
  }
}