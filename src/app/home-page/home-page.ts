import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BarbeiroService } from '../services/barbeiro.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  currentIndex = 1;
  selectedIndex = 0;
  termoBusca = '';

  items = [
    { url: 'assets/image/DestaqueCentral.png' },
    { url: 'assets/image/DestaqueEsquerda.png' },
    { url: 'assets/image/DestaqueDireita.png' },
  ];

  specialists: any[] = [];

  constructor(
    private router: Router,
    private barbeiroService: BarbeiroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.barbeiroService.getBarbeiros().subscribe({
      next: (barbeiros) => {
        this.specialists = barbeiros.map(b => ({
          id: b.id,
          nome: b.nome.split(' ')[0],
          nomeCompleto: b.nome,
          url: b.foto_url,
          descricao: b.bio || 'Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável.'
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar barbeiros na home:', err)
    });
  }

  getClass(index: number) {
    if (index === this.currentIndex) return 'active';
    if (index === this.currentIndex - 1) return 'left';
    if (index === this.currentIndex + 1) return 'right';
    return 'hidden';
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Torna o carousel cíclico (BUG-17)
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.items.length - 1; // Cíclico
    }
  }

  selecionar(index: number) {
    this.selectedIndex = index;
  }

  fazerAgendamento() {
    if (this.specialists.length === 0) return;
    const especialistaSelecionado = this.specialists[this.selectedIndex];
    this.router.navigate(['/agendamento', especialistaSelecionado.id]);
  }

  buscar() {
    if (this.termoBusca.trim()) {
      this.router.navigate(['/lista-servico'], { queryParams: { q: this.termoBusca } });
    }
  }
}