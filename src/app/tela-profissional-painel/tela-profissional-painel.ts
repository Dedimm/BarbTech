import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfissionalService } from '../services/profissional';

@Component({
  selector: 'app-tela-profissional-painel',
  standalone: false,
  templateUrl: './tela-profissional-painel.html',
  styleUrl: './tela-profissional-painel.css',
})
export class TelaProfissionalPainel implements OnInit {

  fotoPerfil: any;
  fotoBanner: any;

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
    private profissionalService: ProfissionalService
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
    
    this.listaServicos = this.profissionalService.getServicos();
    this.agenda = this.profissionalService.getAgenda();
  }

 

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        localStorage.setItem('fotoPerfil', base64);
        this.fotoPerfil = this.sanitizer.bypassSecurityTrustStyle(`url(${base64})`);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  onBannerSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        localStorage.setItem('fotoBanner', base64);
        this.fotoBanner = this.sanitizer.bypassSecurityTrustStyle(`url(${base64})`);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }



  toggleFechado(dia: any) {
    dia.fechado = !dia.fechado;
    this.profissionalService.salvarAgenda(this.agenda); 
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
  this.listaServicos.push({ ...this.novoServico });
  this.profissionalService.salvarServicos(this.listaServicos);
  this.fecharModal();
}
deletarServico(servico: any) {
  this.listaServicos = this.listaServicos.filter(s => s !== servico);
  this.profissionalService.salvarServicos(this.listaServicos);
}
fecharModal() {
  this.modalAberto = false;
}
  salvarAgenda() {
  this.profissionalService.salvarAgenda(this.agenda);
}

}