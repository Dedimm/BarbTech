import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
  }

  onServicoEscolhido(servico: any) {
    this.servicoSelecionado = servico;
    this.abaSelecionada = 'agenda'; // já muda pra aba de agenda automaticamente
  }

  constructor(private sanitizer: DomSanitizer) {
    const perfil = localStorage.getItem('fotoPerfil');
    const banner = localStorage.getItem('fotoBanner');

    this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(
      perfil ? `url(${perfil})` : "url('/avatar-padrao.png')"
    );
    this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(
      banner ? `url(${banner})` : "url('/capa-padrao.jpg')"
    );
  }
}