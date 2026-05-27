import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importamos o Roteador do Angular

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  currentIndex = 1;
  selectedIndex = 0;

  items = [
    { url: 'image/DestaqueCentral.png' },
    { url: 'image/DestaqueEsquerda.png' },
    { url: 'image/DestaqueDireita.png' },
  ];

  specialists = [
    { id: 1, url: 'image/Barbeiro1.png', nome: 'Ricardo', nomeCompleto: 'Ricardo Silva', fotoGrande:'image/Barbeiro1FotoGrande.png', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável." },
    { id: 2, url: 'image/Barbeiro2.png', nome: 'Marcus', nomeCompleto: 'Marcus Santos', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { id: 3, url: 'image/Barbeiro3.png', nome: 'Felipe', nomeCompleto: 'Felipe Amancio', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { id: 4, url: 'image/Barbeiro4.png', nome: 'André', nomeCompleto: 'André Oliveira', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { id: 5, url: 'image/Barbeiro5.png', nome: 'Julio', nomeCompleto: 'Julio Pilla', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { id: 6, url: 'image/Barbeiro6.png', nome: 'Sérgio', nomeCompleto: 'Sérgio Pereira', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."}
  ];

  // Injetamos o Router no construtor
  constructor(private router: Router) {}

  getClass(index: number) {
    if (index === this.currentIndex) return 'active';
    if (index === this.currentIndex - 1) return 'left';
    if (index === this.currentIndex + 1) return 'right';
    return 'hidden';
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  selecionar(index: number) {
    this.selectedIndex = index;
  }

  // Função que redireciona o cliente para o fluxo real de agendamento do grupo
  fazerAgendamento() {
    const especialistaSelecionado = this.specialists[this.selectedIndex];
    console.log('Navegando para a tela de agendamento do barbeiro:', especialistaSelecionado.nome);
    
    // Redireciona para a rota filha de serviços deles
    this.router.navigate(['/tela-agendamento/agendamento-servico']);
  }
}